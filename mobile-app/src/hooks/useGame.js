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
    const [totalScore, setTotalScore] = useState(0);
    const [wordsFoundCount, setWordsFoundCount] = useState(0);
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [avatarId, setAvatarId] = useState('default');
    const [arcadeSubMode, setArcadeSubMode] = useState('moves'); // 'moves' or 'time'
    const [arcadeValue, setArcadeValue] = useState(30);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalMovesMade, setTotalMovesMade] = useState(0);
    const [zenDuration, setZenDuration] = useState(0);
    const [gardenState, setGardenState] = useState({ flowers: 0, stones: 0, ripples: 0 });

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
            } else {
                // Initial cleanup for guest if no session exists but local storage has data
                localStorage.removeItem('crush_completed_levels');
                setCompletedLevels(0);
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
                // Reset states to defaults for guest
                setCoins(500);
                setTools({ bomb: 1, swap: 2, row: 1, col: 1, cell: 3 });
                setCompletedLevels(0);
                setTotalScore(0);
                setWordsFoundCount(0);
                setGamesPlayed(0);
                setHighScore(0);
                setEnergy(5);
                localStorage.removeItem('crush_completed_levels');
                localStorage.setItem('crush_coins', '500');
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
            if (data.total_score) setTotalScore(data.total_score);
            if (data.words_found_count) setWordsFoundCount(data.words_found_count);
            if (data.games_played) setGamesPlayed(data.games_played);
            if (data.high_score) setHighScore(data.high_score);
            if (data.avatar_id) setAvatarId(data.avatar_id);
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
        return new GameEngine(settings.rows, settings.cols, settings.vowelBonus, language);
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
                    last_energy_refill: new Date(lastEnergyRefill).toISOString(),
                    total_score: totalScore,
                    words_found_count: wordsFoundCount,
                    games_played: gamesPlayed,
                    high_score: highScore,
                    avatar_id: avatarId
                });
            }, 2000); // 2 saniye debounce
            return () => clearTimeout(timeoutId);
        }
    }, [coins, tools, user, completedLevels, language, energy, lastEnergyRefill, totalScore, wordsFoundCount, gamesPlayed, highScore, avatarId]);

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

    // Arcade Timer Logic
    useEffect(() => {
        let timer;
        if (gameState === 'playing' && gameMode === 'arcade' && arcadeSubMode === 'time' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameState('gameover');
                        soundManager.play('error');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, gameMode, arcadeSubMode, timeLeft]);

    // Zen Duration Timer
    useEffect(() => {
        let timer;
        if (gameState === 'playing' && gameMode === 'zen') {
            timer = setInterval(() => {
                setZenDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, gameMode]);

    // Session Statistics Recording
    useEffect(() => {
        if (gameState !== 'playing' && gameState !== 'initial' && user) {
            const saveStats = async () => {
                const sessionStats = {
                    words: foundWords.length,
                    moves: totalMovesMade,
                    duration: gameMode === 'zen' ? zenDuration : (gameMode === 'arcade' && arcadeSubMode === 'time' ? (arcadeValue - timeLeft) : (gameMode === 'arcade' ? totalMovesMade * 3 : 0)) // Basit bir tahmin ya da gerçek süre
                };

                // Mission için süre takibi yoksa 0 gönderilebilir veya hamle bazlı bir tahmin yapılabilir.
                // Zen ve Arcade Time en doğru süreleri verir.

                await SupabaseService.updateModeStats(user.id, gameMode, sessionStats);
            };
            saveStats();
        }
    }, [gameState]);

    useEffect(() => {
        const dictFile = language === 'tr' ? './sozluk.json' : './sozluk_en.json';
        setIsDictionaryLoaded(false);
        if (engine) engine.setLanguage(language);
        dictionary.load(dictFile).then(() => setIsDictionaryLoaded(true));
    }, [language]);

    // Mission Mode Initialization
    const startMission = useCallback((index, selectedBoosters = {}) => {
        const mission = cloudLevels[index];
        if (!mission) return;
        const settings = DIFFICULTY_SETTINGS[mission.difficulty];
        const newEngine = new GameEngine(settings.rows, settings.cols, settings.vowelBonus, language);

        setGameMode('mission');
        setCurrentLevelIndex(index);
        setLevelGoals(mission.goals.map(g => ({ ...g, current: 0 })));
        newEngine.setLanguage(language);
        setEngine(newEngine);
        const newGrid = newEngine.initGrid();
        setGrid(newGrid);
        setMoves(mission.moves);
        setScore(0);
        setFoundWords([]);
        setSelectedPath([]);
        setGameState('playing');
        setActiveTool(null);

        // Consume and Place selected boosters
        if (selectedBoosters) {
            const consumed = {};
            Object.entries(selectedBoosters).forEach(([type, isSelected]) => {
                if (isSelected && tools[type] > 0) {
                    consumed[type] = 1;
                    // Place on grid
                    const engineType = type === 'row' ? 'row_blast' : type === 'col' ? 'col_blast' : 'bomb';
                    const r = Math.floor(Math.random() * settings.rows);
                    const c = Math.floor(Math.random() * settings.cols);
                    if (newGrid[r] && newGrid[r][c]) {
                        newGrid[r][c].type = engineType;
                    }
                }
            });

            if (Object.keys(consumed).length > 0) {
                setTools(prev => {
                    const next = { ...prev };
                    Object.keys(consumed).forEach(type => {
                        next[type] -= 1;
                    });
                    return next;
                });
                setGrid([...newGrid.map(row => [...row])]);
            }
        }
        setGamesPlayed(prev => prev + 1);
    }, [cloudLevels]);

    const updateGoals = useCallback((type, value, currentScore) => {
        if (gameMode !== 'mission') return;

        setLevelGoals(prev => {
            const next = prev.map(goal => {
                if (goal.type === type) {
                    if (type === GOAL_TYPES.WORD_LENGTH) {
                        const targetValue = String(goal.value);
                        const currentValue = String(value);
                        if (targetValue === currentValue) {
                            return { ...goal, current: Math.min(goal.count, goal.current + 1) };
                        }
                    }
                    if (type === GOAL_TYPES.SCORE) {
                        return { ...goal, current: Math.min(goal.value, currentScore) };
                    }
                    if (type === GOAL_TYPES.USE_TOOL) {
                        const targetValue = String(goal.value).toLowerCase().trim();
                        const currentValue = String(value).toLowerCase().trim();
                        if (targetValue === currentValue) {
                            return { ...goal, current: Math.min(goal.count, goal.current + 1) };
                        }
                    }
                    if (type === GOAL_TYPES.WORD_COUNT) {
                        return { ...goal, current: Math.min(goal.count, goal.current + 1) };
                    }
                }
                return goal;
            });

            // Check if all goals completed
            const allDone = next.length > 0 && next.every(g => {
                if (g.type === GOAL_TYPES.SCORE) return currentScore >= g.value;
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
    }, [gameMode, gameState, currentLevelIndex, cloudLevels, completedLevels]);

    const changeDifficulty = useCallback((newDiff) => {
        const settings = DIFFICULTY_SETTINGS[newDiff];
        const newEngine = new GameEngine(settings.rows, settings.cols, settings.vowelBonus, language);
        setGameMode('arcade');
        setDifficultyState(newDiff);
        newEngine.setLanguage(language);
        setEngine(newEngine);
        setGrid(newEngine.initGrid());
        setMoves(settings.moves);
        setScore(0);
        setLevel(1);
        setFoundWords([]);
        setSelectedPath([]);
        setActiveTool(null);
        setAnimatingCells([]);
        setArcadeSubMode('moves');
        setTotalMovesMade(0);
        setTimeLeft(0);
        setZenDuration(0);
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
            updateGoals(GOAL_TYPES.USE_TOOL, toolUsed, score);
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
                setMoves(m => {
                    if (gameMode === 'arcade' && arcadeSubMode === 'time') return m;
                    if (gameMode === 'zen') return m;
                    return m - 1;
                });
                setTotalMovesMade(prev => prev + 1);
                soundManager.play('bomb_blast');
                setSelectedPath([]);
                updateGoals(GOAL_TYPES.USE_TOOL, cell.type === 'bomb' ? 'bomb' : 'blast', score);
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

            if (gameMode === 'zen') {
                if (word.length >= 7) setGardenState(prev => ({ ...prev, flowers: prev.flowers + 1 }));
                else if (word.length >= 5) setGardenState(prev => ({ ...prev, stones: prev.stones + 1 }));
                else if (word.length >= 3) setGardenState(prev => ({ ...prev, ripples: prev.ripples + 1 }));
            }

            setMoves(m => {
                if (gameMode === 'arcade' && arcadeSubMode === 'time') return m;
                if (gameMode === 'zen') return m;
                return m - 1;
            });
            setTotalMovesMade(prev => prev + 1);
            if (newSpecial) {
                setCreatedSpecial(newSpecial);
                setTimeout(() => setCreatedSpecial(null), 100);
            }
            setFoundWords(prev => [word, ...prev].slice(0, 50));
            setSelectedPath([]);

            // Award coins for word
            const coinReward = Math.max(0, word.length - 2) * 2;
            if (gameMode !== 'zen') {
                setCoins(c => c + coinReward);
            }

            // Update Mission Goals
            const newScore = score + turnScore;
            if (gameMode === 'mission') {
                updateGoals(GOAL_TYPES.WORD_COUNT, 1, newScore);
                updateGoals(GOAL_TYPES.WORD_LENGTH, word.length, newScore);
                updateGoals(GOAL_TYPES.SCORE, turnScore, newScore);
            }

            // Update stats
            setWordsFoundCount(prev => prev + 1);
            if (gameMode !== 'zen') {
                setTotalScore(prev => prev + turnScore);
            }
            // highScore, oyun bitiminde (gameover/victory useEffect) güncellenecek

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
        setMoves(m => {
            if (gameMode === 'arcade' && arcadeSubMode === 'time') return m;
            if (gameMode === 'zen') return m;
            return m - 5;
        });
        setTotalMovesMade(prev => prev + 5);
        soundManager.play('swap');
    }, [engine, moves, gameState]);

    const resetGame = useCallback((selectedBoosters = {}, mode = null, subMode = 'moves', subValue = 30, targetDifficulty = null) => {
        const targetMode = mode || gameMode;
        const currentDiff = targetDifficulty || difficulty;

        if (targetMode === 'mission') {
            startMission(currentLevelIndex, selectedBoosters);
            return;
        }

        // Ensure Mode
        setGameMode(targetMode);
        setArcadeSubMode(subMode);
        setArcadeValue(subValue);
        setTotalMovesMade(0);
        setZenDuration(0);
        setGardenState({ flowers: 0, stones: 0, ripples: 0 });

        if (targetMode === 'zen') {
            setMoves(999);
            setTimeLeft(0);
        } else if (subMode === 'time') {
            setTimeLeft(subValue);
            setMoves(999);
        } else {
            setMoves(subValue);
            setTimeLeft(0);
        }

        const settings = DIFFICULTY_SETTINGS[currentDiff];
        const newEngine = new GameEngine(settings.rows, settings.cols, settings.vowelBonus, language);
        newEngine.setLanguage(language);
        setEngine(newEngine);
        const initialGrid = newEngine.initGrid();
        setGrid(initialGrid);

        setScore(0);
        setLevel(1);
        setFoundWords([]);
        setSelectedPath([]);
        setGameState('playing');
        setActiveTool(null);
        setAnimatingCells([]);

        // Consume and Place selected boosters
        if (selectedBoosters) {
            const consumed = {};
            Object.entries(selectedBoosters).forEach(([type, isSelected]) => {
                if (isSelected && tools[type] > 0) {
                    consumed[type] = 1;
                    const engineType = type === 'row' ? 'row_blast' : type === 'col' ? 'col_blast' : 'bomb';
                    const r = Math.floor(Math.random() * settings.rows);
                    const c = Math.floor(Math.random() * settings.cols);
                    if (initialGrid[r] && initialGrid[r][c]) {
                        initialGrid[r][c].type = engineType;
                    }
                }
            });

            if (Object.keys(consumed).length > 0) {
                setTools(prev => {
                    const next = { ...prev };
                    Object.keys(consumed).forEach(type => {
                        next[type] -= 1;
                    });
                    return next;
                });
                setGrid([...initialGrid.map(row => [...row])]);
            }
        }
        setGamesPlayed(prev => prev + 1);
    }, [engine, difficulty, gameMode, currentLevelIndex, startMission, language, tools]);

    // Game Over / Victory: Update highScore based on final session score
    useEffect(() => {
        if (score > 0 && gameMode !== 'zen') {
            setHighScore(prev => Math.max(prev, score));
        }
        if (gameState === 'playing') {
            if (gameMode === 'arcade' && arcadeSubMode === 'moves' && moves <= 0) {
                setGameState('gameover');
            } else if (gameMode === 'arcade' && arcadeSubMode === 'time' && timeLeft <= 0) {
                setGameState('gameover');
            } else if (gameMode === 'mission' && moves <= 0) {
                setGameState('gameover');
            }
        }
    }, [moves, timeLeft, gameState, score, gameMode, arcadeSubMode]);

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
        energy, nextEnergyIn, setEnergy, setLastEnergyRefill,
        totalScore, wordsFoundCount, gamesPlayed, highScore, avatarId, setAvatarId,
        arcadeSubMode, arcadeValue, timeLeft, totalMovesMade, zenDuration,
        gardenState, setGameState
    };
};
