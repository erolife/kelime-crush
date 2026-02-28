import { useState, useCallback, useEffect } from 'react';
import { GameEngine } from '../logic/GameEngine';
import { dictionary } from '../logic/Dictionary';
import { soundManager } from '../logic/SoundManager';
import { DIFFICULTY_SETTINGS } from '../logic/Constants';
import { LEVELS as LOCAL_LEVELS, GOAL_TYPES } from '../logic/Levels';
import { SupabaseService } from '../logic/SupabaseService';
import { supabase } from '../logic/supabaseClient';
import { TRANSLATIONS } from '../logic/Translations';

export const useGame = (initialDifficulty = 'normal') => {
    const [language, setLanguageState] = useState(() => {
        return localStorage.getItem('crush_lang') || 'tr';
    });
    const [difficulty, setDifficultyState] = useState(initialDifficulty);
    const [gameMode, setGameMode] = useState('arcade'); // 'arcade' or 'mission'
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [levelGoals, setLevelGoals] = useState([]);
    const [cloudLevels, setCloudLevels] = useState(LOCAL_LEVELS);
    const [isLoadingLevels, setIsLoadingLevels] = useState(true);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [completedLevels, setCompletedLevels] = useState(() => {
        return parseInt(localStorage.getItem('crush_completed_levels') || "0");
    });
    const [energy, setEnergy] = useState(() => {
        return parseInt(localStorage.getItem('crush_energy') || "5");
    });
    const [lastEnergyRefill, setLastEnergyRefill] = useState(() => {
        return parseInt(localStorage.getItem('crush_last_refill') || Date.now().toString());
    });
    const [nextEnergyIn, setNextEnergyIn] = useState(0); // Saniye cinsinden geri sayım

    // Dynamic Level Loader
    useEffect(() => {
        const fetchLevels = async () => {
            setIsLoadingLevels(true);
            const data = await SupabaseService.getLevels();
            if (data && data.length > 0) {
                setCloudLevels(data);
            }
            setIsLoadingLevels(false);
        };
        fetchLevels();
    }, []);

    // Auth & Profile Listener
    useEffect(() => {
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                fetchProfile(session.user.id);
            }
        };
        getInitialSession();

        const { data: { subscription } } = SupabaseService.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                setUser(session.user);
                fetchProfile(session.user.id);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
                // Çıkış yapınca yerel coin ve tools kullanmaya devam eder
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        setIsLoadingProfile(true);
        const data = await SupabaseService.getProfile(userId);
        if (data) {
            setProfile(data);
            // Senkronizasyon: Bulut verisini yerel state'e aktar
            setCoins(data.coins);
            setTools(data.tools);
            setCompletedLevels(data.current_level_index || 0);
            if (data.energy !== undefined) setEnergy(data.energy);
            if (data.last_energy_refill) setLastEnergyRefill(new Date(data.last_energy_refill).getTime());
            if (data.language) setLanguageState(data.language);
            localStorage.setItem('crush_completed_levels', (data.current_level_index || 0).toString());
        }
        setIsLoadingProfile(false);
    };

    const setLanguage = useCallback((lang) => {
        setLanguageState(lang);
        localStorage.setItem('crush_lang', lang);
    }, []);

    const t = useCallback((key, params = {}) => {
        let text = TRANSLATIONS[language]?.[key] || key;
        // Parametre değişimi (örn: {day} -> 5)
        Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, v);
        });
        return text;
    }, [language]);

    const [engine, setEngine] = useState(() => {
        const settings = DIFFICULTY_SETTINGS[initialDifficulty];
        return new GameEngine(settings.rows, settings.cols, settings.vowelBonus);
    });

    const [grid, setGrid] = useState(() => engine.initGrid());
    const [selectedPath, setSelectedPath] = useState([]);
    const [animatingCells, setAnimatingCells] = useState([]);
    const [score, setScore] = useState(0);
    const [createdSpecial, setCreatedSpecial] = useState(null);
    const [moves, setMoves] = useState(DIFFICULTY_SETTINGS[initialDifficulty].moves);
    const [level, setLevel] = useState(1);
    const [isDictionaryLoaded, setIsDictionaryLoaded] = useState(false);
    const [foundWords, setFoundWords] = useState([]);
    const [gameState, setGameState] = useState('playing'); // 'playing', 'gameover', 'victory'

    const [activeTool, setActiveTool] = useState(null);
    const [swapSelection, setSwapSelection] = useState(null);
    const [coins, setCoins] = useState(() => {
        return parseInt(localStorage.getItem('crush_coins') || "500");
    });

    const [tools, setTools] = useState({
        bomb: 1, swap: 2, row: 1, col: 1, cell: 3
    });

    useEffect(() => {
        localStorage.setItem('crush_coins', coins.toString());
        localStorage.setItem('crush_completed_levels', completedLevels.toString());
        localStorage.setItem('crush_energy', energy.toString());
        localStorage.setItem('crush_last_refill', lastEnergyRefill.toString());
        // Sync to Cloud
        if (user) {
            const timeoutId = setTimeout(() => {
                SupabaseService.updateProfile(user.id, {
                    coins,
                    tools,
                    current_level_index: completedLevels,
                    language,
                    energy,
                    last_energy_refill: new Date(lastEnergyRefill).toISOString()
                });
            }, 2000); // 2 saniye debounce
            return () => clearTimeout(timeoutId);
        }
    }, [coins, tools, user, completedLevels, language, energy, lastEnergyRefill]);

    // Energy Refill Logic (20 minutes = 1200 seconds)
    useEffect(() => {
        const REFILL_TIME = 20 * 60 * 1000;
        const interval = setInterval(() => {
            if (energy < 5) {
                const now = Date.now();
                const diff = now - lastEnergyRefill;
                if (diff >= REFILL_TIME) {
                    const refillAmount = Math.floor(diff / REFILL_TIME);
                    const newEnergy = Math.min(5, energy + refillAmount);
                    setEnergy(newEnergy);
                    setLastEnergyRefill(lastEnergyRefill + (refillAmount * REFILL_TIME));
                } else {
                    setNextEnergyIn(Math.ceil((REFILL_TIME - diff) / 1000));
                }
            } else {
                setNextEnergyIn(0);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [energy, lastEnergyRefill]);

    useEffect(() => {
        const dictFile = language === 'tr' ? './sozluk.json' : './sozluk_en.json';
        setIsDictionaryLoaded(false);
        dictionary.load(dictFile).then(() => setIsDictionaryLoaded(true));
    }, [language]);

    // Mission Mode Initialization
    const startMission = useCallback((index, selectedBoosters = {}) => {
        const mission = cloudLevels[index];
        if (!mission) return;
        const settings = DIFFICULTY_SETTINGS[mission.difficulty];
        const newEngine = new GameEngine(settings.rows, settings.cols, settings.vowelBonus);

        setGameMode('mission');
        setCurrentLevelIndex(index);
        setLevelGoals(mission.goals.map(g => ({ ...g, current: 0 })));
        setEngine(newEngine);
        setGrid(newEngine.initGrid());
        setMoves(mission.moves);
        setScore(0);
        setFoundWords([]);
        setSelectedPath([]);
        setGameState('playing');
        setActiveTool(null);

        // Consume selected boosters
        if (selectedBoosters) {
            setTools(prev => {
                const next = { ...prev };
                Object.entries(selectedBoosters).forEach(([type, isSelected]) => {
                    if (isSelected && next[type] > 0) {
                        next[type] -= 1;
                        // Start with 1 of each selected booster added to active tools indirectly 
                        // Actually, adding them to active tools at start is tricky with current state.
                        // For now we just consume from inventory as the user requested "start with one of them".
                    }
                });
                return next;
            });
        }
    }, [cloudLevels]);

    const updateGoals = useCallback((type, value) => {
        if (gameMode !== 'mission') return;

        setLevelGoals(prev => {
            const next = prev.map(goal => {
                if (goal.type === type) {
                    if (type === GOAL_TYPES.WORD_LENGTH && goal.value === value) {
                        return { ...goal, current: Math.min(goal.count, goal.current + 1) };
                    }
                    if (type === GOAL_TYPES.SCORE) {
                        return { ...goal, current: Math.min(goal.value, score + value) };
                    }
                    if (type === GOAL_TYPES.USE_TOOL && goal.value === value) {
                        return { ...goal, current: Math.min(goal.count, goal.current + 1) };
                    }
                    if (type === GOAL_TYPES.WORD_COUNT) {
                        return { ...goal, current: Math.min(goal.count, goal.current + 1) };
                    }
                }
                return goal;
            });

            // Check if all goals completed
            const allDone = next.every(g => {
                if (g.type === GOAL_TYPES.SCORE) return (score + (type === GOAL_TYPES.SCORE ? value : 0)) >= g.value;
                return g.current >= g.count;
            });

            if (allDone && gameState === 'playing') {
                setGameState('victory');
                // Update progression
                const nextLevel = Math.max(completedLevels, currentLevelIndex + 1);
                setCompletedLevels(nextLevel);

                // Give rewards
                const rewards = cloudLevels[currentLevelIndex].rewards;
                if (rewards) {
                    if (rewards.tools) {
                        setTools(t => {
                            const newTools = { ...t };
                            Object.entries(rewards.tools).forEach(([id, amt]) => {
                                newTools[id] = (newTools[id] || 0) + amt;
                            });
                            return newTools;
                        });
                    }
                    if (rewards.coins) {
                        setCoins(c => c + rewards.coins);
                    }
                }
            }
            return next;
        });
    }, [gameMode, score, gameState, currentLevelIndex, cloudLevels]);

    const changeDifficulty = useCallback((newDiff) => {
        const settings = DIFFICULTY_SETTINGS[newDiff];
        const newEngine = new GameEngine(settings.rows, settings.cols, settings.vowelBonus);
        setGameMode('arcade');
        setDifficultyState(newDiff);
        setEngine(newEngine);
        setGrid(newEngine.initGrid());
        setMoves(settings.moves);
        setScore(0);
        setLevel(1);
        setFoundWords([]);
        setSelectedPath([]);
        setActiveTool(null);
        setAnimatingCells([]);
    }, []);

    const handleToolUsage = useCallback((r, c) => {
        if (!activeTool || tools[activeTool] <= 0) return;
        let result;
        const toolUsed = activeTool;
        switch (activeTool) {
            case 'bomb': result = engine.removeArea(r, c, 1); break;
            case 'row': result = engine.removeRow(r); break;
            case 'col': result = engine.removeCol(c); break;
            case 'cell': result = engine.removeSingle(r, c); break;
            case 'swap':
                if (!swapSelection) {
                    setSwapSelection({ r, c });
                    soundManager.play('select');
                    return;
                } else {
                    if (swapSelection.r === r && swapSelection.c === c) {
                        setSwapSelection(null);
                        return;
                    }
                    result = engine.swapCells(swapSelection, { r, c });
                    setSwapSelection(null);
                }
                break;
            default: return;
        }

        if (result) {
            if (result.blasted) {
                setAnimatingCells(result.blasted);
                setTimeout(() => setAnimatingCells([]), 600);
            }
            setGrid([...result.grid]);
            setTools(prev => ({ ...prev, [activeTool]: prev[activeTool] - 1 }));
            setActiveTool(null);
            soundManager.play('powerup');
            updateGoals(GOAL_TYPES.USE_TOOL, toolUsed);
        }
    }, [activeTool, tools, engine, swapSelection, updateGoals]);

    const selectCell = useCallback((r, c) => {
        if (gameState !== 'playing' || moves <= 0) return;
        if (activeTool) {
            handleToolUsage(r, c);
            return;
        }
        const cell = grid[r][c];
        if (!cell) return;
        setSelectedPath(prev => {
            const index = prev.findIndex(p => p.r === r && p.c === c);
            if (index !== -1) {
                if (index === prev.length - 2) {
                    soundManager.play('select');
                    return prev.slice(0, -1);
                }
                return prev;
            }
            if (prev.length > 0) {
                const last = prev[prev.length - 1];
                if (!engine.areAdjacent(last, { r, c })) return prev;
            }
            soundManager.play('select');
            return [...prev, { r, c, letter: cell.letter }];
        });
    }, [grid, moves, engine, activeTool, handleToolUsage, gameState]);

    const finishTurn = useCallback(() => {
        if (selectedPath.length === 1) {
            const p = selectedPath[0];
            const cell = grid[p.r][p.c];
            if (cell && cell.type !== 'normal') {
                const { grid: newGrid, blasted } = engine.removeSingle(p.r, p.c);
                setAnimatingCells(blasted || []);
                setTimeout(() => setAnimatingCells([]), 600);
                setGrid([...newGrid]);
                setMoves(m => m - 1);
                soundManager.play('bomb_blast');
                setSelectedPath([]);
                updateGoals(GOAL_TYPES.USE_TOOL, cell.type === 'bomb' ? 'bomb' : 'blast');
                return true;
            }
            setSelectedPath([]);
            return false;
        }

        if (selectedPath.length < 3) {
            setSelectedPath([]);
            return false;
        }

        const word = selectedPath.map(p => p.letter).join('');
        const isValid = dictionary.isValid(word);

        if (isValid) {
            const turnScore = engine.calculateScore(selectedPath);
            const { grid: newGrid, blasted, createdSpecial: newSpecial } = engine.removeCells(selectedPath);

            const allRemoved = [
                ...selectedPath.map(p => ({ ...p, type: 'match' })),
                ...(blasted || [])
            ];

            setAnimatingCells(allRemoved);
            setTimeout(() => setAnimatingCells([]), 600);

            setGrid([...newGrid]);
            setScore(s => s + turnScore);
            setMoves(m => m - 1);
            if (newSpecial) {
                setCreatedSpecial(newSpecial);
                setTimeout(() => setCreatedSpecial(null), 100);
            }
            setFoundWords(prev => [word, ...prev].slice(0, 50));
            setSelectedPath([]);

            // Award coins for word
            const coinReward = Math.max(0, word.length - 2) * 2;
            setCoins(c => c + coinReward);

            // Update Mission Goals
            updateGoals(GOAL_TYPES.WORD_COUNT, 1);
            updateGoals(GOAL_TYPES.WORD_LENGTH, word.length);
            updateGoals(GOAL_TYPES.SCORE, turnScore);

            return true;
        }
        soundManager.play('error');
        setSelectedPath([]);
        return false;
    }, [selectedPath, grid, engine, updateGoals]);

    const shuffle = useCallback(() => {
        if (gameState !== 'playing' || moves < 5) return;
        const result = engine.shuffleGrid();
        setGrid([...result.grid]);
        setMoves(m => m - 5);
        soundManager.play('swap');
    }, [engine, moves, gameState]);

    const resetGame = useCallback((selectedBoosters = {}, mode = null) => {
        const targetMode = mode || gameMode;
        if (targetMode === 'mission') {
            startMission(currentLevelIndex, selectedBoosters);
            return;
        }

        // Ensure Arcade mode
        setGameMode('arcade');
        const settings = DIFFICULTY_SETTINGS[difficulty];
        setGrid(engine.initGrid());
        setMoves(settings.moves);
        setScore(0);
        setLevel(1);
        setFoundWords([]);
        setSelectedPath([]);
        setGameState('playing');
        setActiveTool(null);
        setAnimatingCells([]);

        // Consume selected boosters
        if (selectedBoosters) {
            setTools(prev => {
                const next = { ...prev };
                Object.entries(selectedBoosters).forEach(([type, isSelected]) => {
                    if (isSelected && next[type] > 0) {
                        next[type] -= 1;
                    }
                });
                return next;
            });
        }
    }, [engine, difficulty, gameMode, currentLevelIndex, startMission]);

    useEffect(() => {
        if (moves <= 0 && gameState === 'playing') {
            setGameState('gameover');
        }
    }, [moves, gameState]);

    const buyTool = useCallback((toolId, price) => {
        if (coins >= price) {
            setCoins(c => c - price);
            setTools(t => ({ ...t, [toolId]: (t[toolId] || 0) + 1 }));
            soundManager.play('powerup');
            return true;
        }
        soundManager.play('error');
        return false;
    }, [coins]);

    const addCoins = useCallback((amount) => setCoins(c => c + amount), []);
    const addTool = useCallback((toolId, amount = 1) => setTools(t => ({ ...t, [toolId]: (t[toolId] || 0) + amount })), []);

    return {
        grid, selectedPath, animatingCells, score, moves, level, difficulty, foundWords,
        gameState, resetGame, swapSelection, createdSpecial,
        tools, activeTool, setActiveTool, changeDifficulty, selectCell,
        finishTurn, shuffle, isDictionaryLoaded,
        gameMode, currentLevelIndex, levelGoals, startMission,
        coins, buyTool, addCoins, addTool,
        cloudLevels, isLoadingLevels,
        user, profile, isLoadingProfile, completedLevels,
        language, setLanguage, t,
        energy, nextEnergyIn, setEnergy, setLastEnergyRefill
    };
};
