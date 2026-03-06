import { useState, useCallback, useEffect } from 'react';
import { GameEngine } from '../logic/GameEngine';
import { dictionary } from '../logic/Dictionary';
import { soundManager } from '../logic/SoundManager';
import { DIFFICULTY_SETTINGS, getGridSize, TIME_BATTLE_GOLD_TIERS, TIME_BATTLE_RANKS, TIME_BATTLE_TOOL_REWARDS, TIME_BATTLE_REWARD_POOL } from '../logic/Constants';
import { SupabaseService } from '../logic/SupabaseService';
import { supabase } from '../logic/supabaseClient';
import { TRANSLATIONS } from '../logic/Translations';
import { NotificationService } from '../logic/NotificationService';

// --- Onboarding / Tutorial Boards (v10.4.2) ---
const LOCAL_LOCAL_TUTORIAL_BOARD_TR = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'Y', 'Z', 'A'],
    ['S', 'P', 'O', 'R', 'K', 'A', 'R', 'T', 'A', 'L', 'B', 'C'],
    ['G', 'E', 'C', 'E', 'B', 'E', 'B', 'E', 'K', 'M', 'N', 'O'],
    ['K', 'E', 'L', 'İ', 'M', 'E', 'A', 'B', 'C', 'D', 'E', 'F'],
    ['F', 'U', 'T', 'B', 'O', 'L', 'P', 'A', 'Z', 'A', 'R', 'S'],
    ['M', 'A', 'K', 'A', 'R', 'N', 'A', 'L', 'İ', 'M', 'O', 'N'],
    ['R', 'A', 'D', 'Y', 'O', 'D', 'E', 'N', 'İ', 'Z', 'G', 'Ö'],
    ['T', 'Ü', 'R', 'K', 'İ', 'Y', 'E', 'G', 'Ü', 'N', 'E', 'Ş'],
    ['K', 'A', 'L', 'E', 'M', 'B', 'A', 'R', 'D', 'A', 'K', 'S'],
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X']
];

const LOCAL_LOCAL_TUTORIAL_BOARD_EN = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
    ['A', 'P', 'P', 'L', 'E', 'B', 'A', 'N', 'A', 'B', 'C', 'D'],
    ['G', 'L', 'A', 'S', 'S', 'D', 'R', 'I', 'N', 'K', 'M', 'N'],
    ['W', 'O', 'R', 'D', 'S', 'P', 'L', 'A', 'Y', 'G', 'A', 'M'],
    ['F', 'O', 'O', 'T', 'B', 'A', 'L', 'L', 'P', 'L', 'A', 'Y'],
    ['M', 'O', 'R', 'N', 'I', 'N', 'G', 'L', 'E', 'M', 'O', 'N'],
    ['R', 'A', 'D', 'I', 'O', 'O', 'C', 'E', 'A', 'N', 'G', 'O'],
    ['W', 'E', 'A', 'T', 'H', 'E', 'R', 'S', 'U', 'N', 'N', 'Y'],
    ['P', 'E', 'N', 'C', 'I', 'L', 'B', 'O', 'T', 'T', 'L', 'E'],
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X']
];

export const useGame = (initialDifficulty = 'normal') => {
    const [language, setLanguageState] = useState(() => {
        return localStorage.getItem('crush_lang') || 'tr';
    });
    const [difficulty, setDifficultyState] = useState(() => {
        return localStorage.getItem('crush_difficulty') || initialDifficulty;
    });
    const [gameMode, setGameMode] = useState('arcade'); // 'arcade', 'timeBattle', or 'zen'

    // Orientation & Mobile detection for responsive grid
    const [orientation, setOrientation] = useState(() => {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    });
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [levelGoals, setLevelGoals] = useState([]);
    const [cloudLevels, setCloudLevels] = useState([]);
    const [isLoadingLevels, setIsLoadingLevels] = useState(false);

    // Time Battle state
    const [timeBattleElapsed, setTimeBattleElapsed] = useState(0);
    const [timeBattleToolRewards, setTimeBattleToolRewards] = useState([]);
    const [nextToolRewardAt, setNextToolRewardAt] = useState(TIME_BATTLE_TOOL_REWARDS.firstAt);
    const [timeBattleInitialDuration, setTimeBattleInitialDuration] = useState(0);
    const [pendingToolReward, setPendingToolReward] = useState(null); // { toolId, timestamp }
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
    const [celebration, setCelebration] = useState(null); // { text, level, duration }
    const [activeEvents, setActiveEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [currentEventId, setCurrentEventId] = useState(null);
    const [hasAwardedXP, setHasAwardedXP] = useState(false);

    // Rank & Mastery State (v8.0.0)
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [masteryPoints, setMasteryPoints] = useState(0);
    const [perks, setPerks] = useState({});
    const [sessionXP, setSessionXP] = useState(0);
    const [unlimitedEnergyUntil, setUnlimitedEnergyUntil] = useState(null); // ISO Date string

    // Mod bazlı en iyi skorlar (Leaderboard için)
    const [bestScoreAdventure, setBestScoreAdventure] = useState(0);
    const [bestScoreTimeArena, setBestScoreTimeArena] = useState(0);

    // Günlük Görevler (v10.3.0)
    const [dailyMissions, setDailyMissions] = useState(() => {
        const saved = localStorage.getItem('crush_daily_missions');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const today = new Date().toISOString().split('T')[0];
                if (parsed.date === today) return parsed;
            } catch (e) { console.error("Error parsing daily missions", e); }
        }
        return {
            date: new Date().toISOString().split('T')[0],
            tasks: [
                { id: "use_tool", target: 5, current: 0, claimed: false, reward: 100, type: "coins", label_tr: "5 Yardımcı Araç Kullan", label_en: "Use 5 Tools" },
                { id: "find_word", target: 30, current: 0, claimed: false, reward: 150, type: "coins", label_tr: "30 Kelime Bul", label_en: "Find 30 Words" },
                { id: "play_game", target: 3, "current": 0, "claimed": false, "reward": 250, "type": "xp", "label_tr": "3 Oyun Seansı Tamamla", "label_en": "Complete 3 Game Sessions" }
            ]
        };
    });

    // Seviye atlamak için gereken XP hesaplama
    const getNextLevelXp = useCallback((lvl) => {
        return Math.floor(2500 * Math.pow(1.20, lvl - 1));
    }, []);

    // XP Ekleme ve Seviye Kontrolü
    const addXP = useCallback(async (amount) => {
        if (!user) return; // Misafirler XP kazanmaz (opsiyonel, şimdilik böyle)

        setXp(currentXp => {
            const newXp = currentXp + amount;
            let currentLevel = level;
            let newLevel = currentLevel;
            let currentMasteryPoints = masteryPoints;

            // Seviye atlama kontrolü (Döngü ile birden fazla seviye atlama ihtimaline karşı)
            while (newXp >= getNextLevelXp(newLevel)) {
                newLevel++;
                currentMasteryPoints++;
                // Sound effect tetiklenebilir: soundManager.playSound('levelup');
                console.log(`TEBRİKLER! Seviye Atladın: ${newLevel}`);
            }

            if (newLevel !== currentLevel) {
                setLevel(newLevel);
                setMasteryPoints(currentMasteryPoints);
                // Veritabanını güncelle
                SupabaseService.updateProfile(user.id, {
                    xp: newXp,
                    level: newLevel,
                    mastery_points: currentMasteryPoints
                });
            } else {
                // Sadece XP güncelle
                SupabaseService.updateProfile(user.id, { xp: newXp });
            }

            return newXp;
        });
    }, [user, level, masteryPoints, getNextLevelXp]);

    // Kelime uzunluğuna göre XP hesaplama (GAME_LEVEL_STRATEGY tabanlı)
    const calculateWordXP = useCallback((wordLength) => {
        if (wordLength < 3) return 0;
        if (wordLength === 3) return 5;
        if (wordLength === 4) return 10;
        // 5+ harf: 25 + (5 * ekstra her harf)
        return 25 + (Math.max(0, wordLength - 5) * 5);
    }, []);

    const addCoins = useCallback((amount) => setCoins(c => c + amount), []);
    const addTool = useCallback((toolId, amount = 1) => setTools(t => ({ ...t, [toolId]: (t[toolId] || 0) + amount })), []);

    const updateMissionProgress = useCallback((taskId, amount = 1) => {
        setDailyMissions(prev => {
            const today = new Date().toISOString().split('T')[0];
            // Tarih kontrolü, gün değiştiyse sıfırla
            let base = prev;
            if (prev.date !== today) {
                base = {
                    date: today,
                    tasks: prev.tasks.map(t => ({ ...t, current: 0, claimed: false }))
                };
            }

            const newMissions = {
                ...base,
                tasks: base.tasks.map(t =>
                    t.id === taskId ? { ...t, current: Math.min(t.target, t.current + amount) } : t
                )
            };

            localStorage.setItem('crush_daily_missions', JSON.stringify(newMissions));
            return newMissions;
        });
    }, []);

    const claimMissionReward = useCallback(async (taskId) => {
        const mission = dailyMissions.tasks.find(t => t.id === taskId);
        if (!mission || mission.claimed || mission.current < mission.target) return false;

        const updatedMissions = {
            ...dailyMissions,
            tasks: dailyMissions.tasks.map(t =>
                t.id === taskId ? { ...t, claimed: true } : t
            )
        };

        setDailyMissions(updatedMissions);
        localStorage.setItem('crush_daily_missions', JSON.stringify(updatedMissions));

        if (mission.type === 'coins') {
            addCoins(mission.reward);
        } else if (mission.type === 'xp') {
            addXP(mission.reward);
        }

        if (user) {
            await SupabaseService.updateProfile(user.id, { daily_missions: updatedMissions });
        }
        return true;
    }, [dailyMissions, user, addCoins, addXP]);

    // Dynamic Level Loader (disabled - levels replaced by Time Battle)
    // useEffect(() => { ... }, []);

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
            if (data.xp !== undefined) setXp(data.xp);
            if (data.level !== undefined) setLevel(data.level);
            if (data.mastery_points !== undefined) setMasteryPoints(data.mastery_points);
            if (data.perks_json) setPerks(data.perks_json);
            if (data.unlimited_energy_until) setUnlimitedEnergyUntil(data.unlimited_energy_until);
            if (data.best_score_adventure) setBestScoreAdventure(data.best_score_adventure);
            if (data.best_score_time_arena) setBestScoreTimeArena(data.best_score_time_arena);
            if (data.daily_missions) {
                const today = new Date().toISOString().split('T')[0];
                if (data.daily_missions.date === today) {
                    setDailyMissions(data.daily_missions);
                    localStorage.setItem('crush_daily_missions', JSON.stringify(data.daily_missions));
                }
            }
            localStorage.setItem('crush_completed_levels', (data.current_level_index || 0).toString());
        }
        setIsLoadingProfile(false);
        fetchActiveEvents();
    };

    const fetchActiveEvents = async () => {
        setIsLoadingEvents(true);
        const events = await SupabaseService.getActiveEvents();
        setActiveEvents(events || []);
        setIsLoadingEvents(false);
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

    // Orientation & isMobile listener
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            const orient = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
            setIsMobile(mobile);
            setOrientation(orient);
        };
        window.addEventListener('resize', handleResize);
        // Also listen orientation change for mobile browsers
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 100); // Small delay for new dimensions
        });
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    // --- Onboarding / Tutorial Logic (v10.4.1) ---
    const [isTutorial, setIsTutorial] = useState(() => {
        // First priority: user has never completed tutorial
        const tutorialCompleted = localStorage.getItem('crush_tutorial_completed') === 'true';
        // Second priority: combined with levels check (initial game state)
        return !tutorialCompleted && completedLevels === 0;
    });

    const [engine, setEngine] = useState(() => {
        const { rows, cols } = getGridSize(initialDifficulty, window.innerWidth < 768, window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
        const settings = DIFFICULTY_SETTINGS[initialDifficulty];
        return new GameEngine(rows, cols, settings.vowelBonus, language);
    });

    const [grid, setGrid] = useState(() => {
        const board = isTutorial ? (language === 'tr' ? LOCAL_LOCAL_TUTORIAL_BOARD_TR : LOCAL_LOCAL_TUTORIAL_BOARD_EN) : null;
        return engine.initGrid(board);
    });

    const [selectedPath, setSelectedPath] = useState([]);
    const [animatingCells, setAnimatingCells] = useState([]);
    const [score, setScore] = useState(0);
    const [createdSpecial, setCreatedSpecial] = useState(null);
    const [moves, setMoves] = useState(DIFFICULTY_SETTINGS[initialDifficulty].moves);
    const [isDictionaryLoaded, setIsDictionaryLoaded] = useState(false);
    const [foundWords, setFoundWords] = useState([]);
    const [gameState, setGameState] = useState('playing'); // 'playing', 'gameover', 'victory'

    const [activeTool, setActiveTool] = useState(null);

    const [tutorialStep, setTutorialStep] = useState(0);
    const [tutorialHint, setTutorialHint] = useState([]);

    // Sync isTutorial with completedLevels initially
    useEffect(() => {
        if (completedLevels > 0 && isTutorial) {
            setIsTutorial(false);
            localStorage.setItem('crush_tutorial_completed', 'true');
        }
    }, [completedLevels]);

    // Tutorial Hint Logic - Must be after gameState
    useEffect(() => {
        if (isTutorial && gameState === 'playing') {
            const hint = language === 'tr'
                ? [{ r: 4, c: 0 }, { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 }, { r: 4, c: 5 }] // KELİME
                : [{ r: 4, c: 0 }, { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 }]; // WORDS
            setTutorialHint(hint);
        } else {
            setTutorialHint([]);
        }
    }, [isTutorial, gameState, language]);
    const [swapSelection, setSwapSelection] = useState(null);
    const [coins, setCoins] = useState(() => {
        return parseInt(localStorage.getItem('crush_coins') || "500");
    });

    const [tools, setTools] = useState({
        bomb: 1, swap: 2, row: 1, col: 1, cell: 3, xbomb: 0, nuclear: 0
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
                    avatar_id: avatarId,
                    best_score_adventure: bestScoreAdventure,
                    best_score_time_arena: bestScoreTimeArena
                });
            }, 2000); // 2 saniye debounce
            return () => clearTimeout(timeoutId);
        }
    }, [coins, tools, user, completedLevels, language, energy, lastEnergyRefill, totalScore, wordsFoundCount, gamesPlayed, highScore, avatarId, bestScoreAdventure, bestScoreTimeArena]);

    // Oyun sonu: Mod bazlı en iyi skor güncelle
    useEffect(() => {
        if (gameState === 'gameover' || gameState === 'victory') {
            if (gameMode === 'arcade' && score > bestScoreAdventure) {
                setBestScoreAdventure(score);
            } else if (gameMode === 'timeBattle' && score > bestScoreTimeArena) {
                setBestScoreTimeArena(score);
            }
        }
    }, [gameState]);

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

    // Yerel Bildirim Zamanlama (Enerji Dolduğunda)
    useEffect(() => {
        if (energy < 5 && !isPro && !isEnergyUnlimited) {
            const refillTimeLeftSeconds = (5 - energy) * 20 * 60; // Kalan toplam saniye (her enerji için 20 dk)
            const secondsToFull = refillTimeLeftSeconds - Math.floor((Date.now() - lastEnergyRefill) / 1000);

            if (secondsToFull > 0) {
                NotificationService.scheduleEnergyFullNotification(secondsToFull, language);
            }
        } else {
            // Enerji tam ise veya sınırsız ise bekleyen bildirimleri iptal et
            NotificationService.cancelEnergyNotifications();
        }
    }, [energy, lastEnergyRefill, isPro, isEnergyUnlimited, language]);

    // Arcade & Event Timer Logic (for time modes or events with duration_limit)
    useEffect(() => {
        let timer;
        const isTimeEvent = currentEventId && timeLeft > 0;
        const isArcadeTime = gameMode === 'arcade' && arcadeSubMode === 'time' && timeLeft > 0;

        if (gameState === 'playing' && (isTimeEvent || isArcadeTime)) {
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
    }, [gameState, gameMode, arcadeSubMode, timeLeft, currentEventId]);

    // Time Battle Timer Logic
    useEffect(() => {
        let timer;
        const activeEvent = currentEventId ? activeEvents?.find(e => e.id === currentEventId) : null;
        // Eğer bir etkinlikteysek ve süre sınırı 0 (sınırsız) ise timeBattle'da süre bitişini engelle
        const isInfiniteTimeEvent = currentEventId && activeEvent && (parseInt(activeEvent.duration_limit) || 0) === 0;

        if (gameState === 'playing' && gameMode === 'timeBattle' && (timeLeft > 0 || isInfiniteTimeEvent)) {
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    setTimeLeft(prev => {
                        if (prev <= 1) {
                            if (!isInfiniteTimeEvent) {
                                setGameState('gameover');
                                soundManager.play('error');
                                return 0;
                            }
                            return 0; // Infinite time event but let it stay at 0
                        }
                        return prev - 1;
                    });
                }
                setTimeBattleElapsed(prev => prev + 1);
            }, 1000);
        } else if (gameState === 'playing' && gameMode === 'timeBattle' && timeLeft <= 0 && currentEventId && !activeEvent) {
            // Wait for event data to load before ending based on time
            return () => clearInterval(timer);
        } else if (gameState === 'playing' && gameMode === 'timeBattle' && timeLeft <= 0 && !isInfiniteTimeEvent) {
            setGameState('gameover');
            soundManager.play('error');
        }
        return () => clearInterval(timer);
    }, [gameState, gameMode, timeLeft, currentEventId, activeEvents]);

    // Time Battle: Tool Reward Check
    useEffect(() => {
        if (gameMode !== 'timeBattle' || gameState !== 'playing') return;
        if (timeBattleElapsed >= nextToolRewardAt) {
            // Award random tool
            const randomTool = TIME_BATTLE_REWARD_POOL[Math.floor(Math.random() * TIME_BATTLE_REWARD_POOL.length)];
            setTools(prev => ({ ...prev, [randomTool]: (prev[randomTool] || 0) + 1 }));
            setTimeBattleToolRewards(prev => [...prev, { toolId: randomTool, at: timeBattleElapsed }]);
            setPendingToolReward({ toolId: randomTool, timestamp: Date.now() });
            soundManager.play('powerup');
            // Set next reward time
            setNextToolRewardAt(timeBattleElapsed + TIME_BATTLE_TOOL_REWARDS.subsequentEvery);
        }
    }, [timeBattleElapsed, nextToolRewardAt, gameMode, gameState]);

    // Clear pending tool reward after animation
    useEffect(() => {
        if (pendingToolReward) {
            const timer = setTimeout(() => setPendingToolReward(null), 2500);
            return () => clearTimeout(timer);
        }
    }, [pendingToolReward]);

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

    // Session Statistics & Event Scoring Recording
    useEffect(() => {
        if (gameState !== 'playing' && gameState !== 'initial' && user) {
            const saveStats = async () => {
                const sessionStats = {
                    words: foundWords.length,
                    moves: totalMovesMade,
                    duration: gameMode === 'zen' ? zenDuration : (gameMode === 'timeBattle' ? timeBattleElapsed : (gameMode === 'arcade' && arcadeSubMode === 'time' ? (arcadeValue - timeLeft) : totalMovesMade * 3))
                };
                await SupabaseService.updateModeStats(user.id, gameMode, sessionStats);

                // Event Scoring: Record if we are in a specific event
                if (score > 0 && currentEventId) {
                    await SupabaseService.updateEventScore(currentEventId, user.id, score);
                    // Refresh data to show in leaderboard
                    fetchActiveEvents();
                }
            };
            saveStats();
        }
    }, [gameState]);

    // Re-create grid when orientation changes during gameplay
    useEffect(() => {
        if (gameState !== 'playing') return;
        const currentDiff = difficulty;
        const settings = DIFFICULTY_SETTINGS[currentDiff];
        const { rows, cols } = getGridSize(currentDiff, isMobile, orientation);

        // Only recreate if grid dimensions actually changed
        const currentRows = grid?.length || 0;
        const currentCols = grid?.[0]?.length || 0;
        if (rows === currentRows && cols === currentCols) return;

        const newEngine = new GameEngine(rows, cols, settings.vowelBonus, language);
        newEngine.setLanguage(language);
        setEngine(newEngine);

        let newGrid;
        if (isTutorial) {
            const board = language === 'tr' ? LOCAL_LOCAL_TUTORIAL_BOARD_TR : LOCAL_LOCAL_TUTORIAL_BOARD_EN;
            newGrid = newEngine.initGrid(board);
        } else {
            newGrid = newEngine.initGrid();
        }

        setGrid(newGrid);
        setSelectedPath([]);
        setAnimatingCells([]);
    }, [orientation, isMobile, isTutorial, language]);

    useEffect(() => {
        const dictFile = language === 'tr' ? './sozluk.json' : './sozluk_en.json';

        // Only show preloader if NOT in cache
        if (!dictionary.caches.has(dictFile)) {
            setIsDictionaryLoaded(false);
        }

        if (engine) engine.setLanguage(language);
        dictionary.load(dictFile).then(() => setIsDictionaryLoaded(true));
    }, [language]);

    // Time Battle Mode Initialization
    const startTimeBattle = useCallback((duration, selectedBoosters = {}, eventId = null) => {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        const { rows, cols } = getGridSize(difficulty, isMobile, orientation);
        const newEngine = new GameEngine(rows, cols, settings.vowelBonus, language);

        setGameMode('timeBattle');
        setTimeLeft(duration);
        setTimeBattleInitialDuration(duration);
        setTimeBattleElapsed(0);
        setTimeBattleToolRewards([]);
        setNextToolRewardAt(TIME_BATTLE_TOOL_REWARDS.firstAt);
        setPendingToolReward(null);
        setCurrentEventId(eventId);
        newEngine.setLanguage(language);
        setEngine(newEngine);

        const board = (isTutorial) ? (language === 'tr' ? LOCAL_TUTORIAL_BOARD_TR : LOCAL_TUTORIAL_BOARD_EN) : null;
        const newGrid = newEngine.initGrid(board);

        setGrid(newGrid);
        setMoves(999); // Unlimited moves
        setScore(0);
        setFoundWords([]);
        setSelectedPath([]);
        setGameState('playing');
        setActiveTool(null);
        setTotalMovesMade(0);

        // Consume and Place selected boosters
        if (selectedBoosters) {
            const consumed = {};
            Object.entries(selectedBoosters).forEach(([type, isSelected]) => {
                if (isSelected && tools[type] > 0) {
                    consumed[type] = 1;
                    const engineType = type === 'row' ? 'row_blast' : type === 'col' ? 'col_blast' : 'bomb';
                    const r = Math.floor(Math.random() * rows);
                    const c = Math.floor(Math.random() * cols);
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
    }, [difficulty, isMobile, orientation, language, tools]);

    // Calculate Time Battle gold reward based on elapsed time
    const calculateTimeBattleGold = useCallback((elapsed) => {
        const tier = TIME_BATTLE_GOLD_TIERS.find(t => elapsed >= t.minSeconds && elapsed < t.maxSeconds);
        return tier ? tier.gold : 200;
    }, []);

    // Get rank based on elapsed time
    const getTimeBattleRank = useCallback((elapsed) => {
        let rank = TIME_BATTLE_RANKS[0];
        for (const r of TIME_BATTLE_RANKS) {
            if (elapsed >= r.minSeconds) rank = r;
        }
        return rank;
    }, []);

    const changeDifficulty = useCallback((newDiff) => {
        const settings = DIFFICULTY_SETTINGS[newDiff];
        const { rows, cols } = getGridSize(newDiff, isMobile, orientation);
        const newEngine = new GameEngine(rows, cols, settings.vowelBonus, language);
        setGameMode('arcade');
        setDifficultyState(newDiff);
        localStorage.setItem('crush_difficulty', newDiff);
        newEngine.setLanguage(language);
        setEngine(newEngine);

        const board = (isTutorial) ? (language === 'tr' ? LOCAL_TUTORIAL_BOARD_TR : LOCAL_TUTORIAL_BOARD_EN) : null;
        const newGrid = newEngine.initGrid(board);

        setGrid(newGrid);
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
            case 'xbomb': result = { ...engine.removeSingle(r, c), blasted: [] }; engine.triggerSpecialCell(r, c, 'dynamite', result.blasted); break;
            case 'nuclear': result = { ...engine.removeSingle(r, c), blasted: [] }; engine.triggerSpecialCell(r, c, 'nuclear', result.blasted); break;
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
            updateMissionProgress('use_tool', 1);
            setActiveTool(null);
            soundManager.play('powerup');
            // updateGoals removed - mission mode replaced by timeBattle
        }
    }, [activeTool, tools, engine, swapSelection]);

    const selectCell = useCallback((r, c) => {
        if (gameState !== 'playing' || (moves <= 0 && gameMode !== 'timeBattle')) return;
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
                    if (gameMode === 'timeBattle') return m;
                    return m - 1;
                });
                setTotalMovesMade(prev => prev + 1);
                soundManager.play('bomb_blast');
                setSelectedPath([]);
                // updateGoals removed - mission mode replaced by timeBattle
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

            // Bonus points from blasted cells (half value — reward for chain reactions)
            const blastedBonus = (blasted || []).reduce((sum, b) => {
                return sum + Math.floor(engine.getLetterPoint(b.letter || 'A') * 0.5);
            }, 0);

            const allRemoved = [
                ...selectedPath.map(p => ({ ...p, type: 'match' })),
                ...(blasted || [])
            ];

            setAnimatingCells(allRemoved);
            setTimeout(() => setAnimatingCells([]), 600);

            setGrid([...newGrid]);
            setScore(s => s + turnScore + blastedBonus);

            // Rank & Mastery: Accumulate XP for found word (display at end of game)
            // Zen mode penalty: 50% XP and soft cap of 500 XP per session (v8.0.2)
            let wordXP = calculateWordXP(word.length);
            if (gameMode === 'zen') {
                wordXP = Math.floor(wordXP * 0.5);
            }

            if (wordXP > 0) {
                setSessionXP(prev => {
                    const nextXP = prev + wordXP;
                    if (gameMode === 'zen' && nextXP > 500) return 500; // soft cap
                    return nextXP;
                });
            }

            if (gameMode === 'zen') {
                if (word.length >= 7) setGardenState(prev => ({ ...prev, flowers: prev.flowers + 1 }));
                else if (word.length >= 5) setGardenState(prev => ({ ...prev, stones: prev.stones + 1 }));
                else if (word.length >= 3) setGardenState(prev => ({ ...prev, ripples: prev.ripples + 1 }));
            }

            // Time Battle: add time for found word (half of word length, rounded up)
            if (gameMode === 'timeBattle') {
                const bonusSeconds = Math.ceil(word.length / 2);
                setTimeLeft(prev => prev + bonusSeconds);
            }

            setMoves(m => {
                if (gameMode === 'arcade' && arcadeSubMode === 'time') return m;
                if (gameMode === 'zen') return m;
                if (gameMode === 'timeBattle') return m;
                return m - 1;
            });
            setTotalMovesMade(prev => prev + 1);
            if (newSpecial) {
                setCreatedSpecial(newSpecial);
                setTimeout(() => setCreatedSpecial(null), 100);
            }
            setFoundWords(prev => [word, ...prev].slice(0, 50));

            // Tutorial Completion
            if (isTutorial) {
                setIsTutorial(false);
                setTutorialHint([]);
                localStorage.setItem('crush_tutorial_completed', 'true');
            }

            setSelectedPath([]);

            // Trigger celebration for 5+ letter words
            if (word.length >= 5) {
                const celebrationLevel = word.length >= 8 ? 5 : word.length >= 7 ? 4 : word.length >= 6 ? 3 : 2;
                const durations = { 1: 1200, 2: 1400, 3: 1600, 4: 1800, 5: 2200 };
                setCelebration({ level: celebrationLevel, wordLength: word.length, duration: durations[celebrationLevel] });
                soundManager.play(celebrationLevel >= 3 ? 'cheer_big' : 'cheer_small');
                setTimeout(() => setCelebration(null), durations[celebrationLevel]);
            }
            // Award coins for word
            const coinReward = Math.max(0, word.length - 3) * 2;
            if (gameMode !== 'zen') {
                setCoins(c => c + coinReward);
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
        // Penalty: 3+ letter invalid attempts cost 1 move (except time-based modes)
        if (selectedPath.length >= 3) {
            setMoves(m => {
                if (gameMode === 'arcade' && arcadeSubMode === 'time') return m;
                if (gameMode === 'zen') return m;
                if (gameMode === 'timeBattle') return m;
                return m - 1;
            });
            setTotalMovesMade(prev => prev + 1);
        }
        setSelectedPath([]);
        return false;
    }, [selectedPath, grid, engine, gameMode]);

    const shuffle = useCallback(() => {
        if (gameState !== 'playing' || moves < 5) return;
        const result = engine.shuffleGrid();
        setGrid([...result.grid]);
        setMoves(m => {
            if (gameMode === 'arcade' && arcadeSubMode === 'time') return m;
            if (gameMode === 'zen') return m;
            if (gameMode === 'timeBattle') return m;
            return m - 5;
        });
        setTotalMovesMade(prev => prev + 5);
        soundManager.play('swap');
    }, [engine, moves, gameState]);

    const resetGame = useCallback((selectedBoosters = {}, mode = null, subMode = 'moves', subValue = 30, targetDifficulty = null, eventId = null) => {
        const targetMode = mode || gameMode;
        const currentDiff = targetDifficulty || difficulty;

        if (targetMode === 'timeBattle') {
            startTimeBattle(subValue, selectedBoosters, eventId);
            return;
        }

        // Ensure Mode
        setGameMode(targetMode);
        setArcadeSubMode(subMode);
        setArcadeValue(subValue);
        setTotalMovesMade(0);
        setZenDuration(0);
        setGardenState({ flowers: 0, stones: 0, ripples: 0 });
        setCurrentEventId(eventId);

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

        // --- HİBRİT ETKİNLİK LİMİTLERİ OVERRIDE ---
        const activeEvent = eventId ? activeEvents?.find(e => e.id === eventId) : null;
        if (activeEvent) {
            const eTime = parseInt(activeEvent.duration_limit) || 0;
            const eMoves = parseInt(activeEvent.moves_limit) || 0;

            setTimeLeft(eTime > 0 ? eTime : 0);
            setMoves(eMoves > 0 ? eMoves : 999);
        }

        const settings = DIFFICULTY_SETTINGS[currentDiff];
        const { rows, cols } = getGridSize(currentDiff, isMobile, orientation);
        const newEngine = new GameEngine(rows, cols, settings.vowelBonus, language);
        newEngine.setLanguage(language);
        setEngine(newEngine);

        const board = (isTutorial) ? (language === 'tr' ? LOCAL_LOCAL_TUTORIAL_BOARD_TR : LOCAL_LOCAL_TUTORIAL_BOARD_EN) : null;
        const initialGrid = newEngine.initGrid(board);
        setGrid(initialGrid);

        setScore(0);
        setSessionXP(0);
        setFoundWords([]);
        setSelectedPath([]);
        setGameState('playing');
        setHasAwardedXP(false);
        setActiveTool(null);
        setAnimatingCells([]);

        // Consume and Place selected boosters
        if (selectedBoosters) {
            const consumed = {};
            Object.entries(selectedBoosters).forEach(([type, isSelected]) => {
                if (isSelected && tools[type] > 0) {
                    consumed[type] = 1;
                    const engineType = type === 'row' ? 'row_blast' : type === 'col' ? 'col_blast' : 'bomb';
                    const r = Math.floor(Math.random() * rows);
                    const c = Math.floor(Math.random() * cols);
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
    }, [engine, difficulty, gameMode, startTimeBattle, language, tools, activeEvents]);

    // Game Over / Victory: Update highScore based on final session score
    useEffect(() => {
        if (score > 0 && gameMode !== 'zen') {
            setHighScore(prev => Math.max(prev, score));
        }
        if (gameState === 'playing') {
            // Check Victory for Event
            const activeEvent = currentEventId ? activeEvents?.find(e => e.id === currentEventId) : null;
            if (activeEvent && activeEvent.target_score > 0 && score >= activeEvent.target_score) {
                setGameState('victory');
            } else {
                const isEventMovesOut = currentEventId && activeEvent?.moves_limit > 0 && moves <= 0;
                if (isEventMovesOut || (moves <= 0 && !currentEventId && gameMode !== 'zen' && gameMode !== 'timeBattle')) {
                    setGameState('gameover');
                } else if (timeLeft <= 0) {
                    const isArcadeTime = gameMode === 'arcade' && arcadeSubMode === 'time';
                    const isTimeEvent = currentEventId && activeEvent?.duration_limit > 0;

                    if (currentEventId && !activeEvent) {
                        // Wait for event data to load
                        return;
                    }

                    if (isArcadeTime || isTimeEvent) {
                        setGameState('gameover');
                    }
                }
            }
        }
        // timeBattle gameover is handled by the timeBattle timer effect

        // Time Battle: award gold on game end
        if (gameState === 'gameover' && gameMode === 'timeBattle' && timeBattleElapsed > 0) {
            const goldReward = calculateTimeBattleGold(timeBattleElapsed);
            setCoins(c => c + goldReward);
        }
        if (gameState !== 'playing' && !hasAwardedXP) {
            const completionXP = gameMode === 'arcade' ? 150 : gameMode === 'timeBattle' ? 300 : 75;
            const totalSessionXP = sessionXP + completionXP;
            addXP(totalSessionXP);
            setHasAwardedXP(true);

            // Günlük Görevleri Güncelle
            updateMissionProgress('play_game', 1);
            if (wordsFoundCount > 0) {
                updateMissionProgress('find_word', wordsFoundCount);
            }
        }

        // Sync score to event if active
        if (currentEventId && user && (gameState === 'victory' || gameState === 'gameover')) {
            SupabaseService.updateEventScore(currentEventId, user.id, score);
        }
    }, [moves, timeLeft, gameState, score, gameMode, arcadeSubMode, timeBattleElapsed, currentEventId, activeEvents, hasAwardedXP, addXP, sessionXP, updateMissionProgress, wordsFoundCount]);

    const buyTool = useCallback((toolId, price) => {
        if (coins >= price) {
            setCoins(c => c - price);
            if (toolId === 'energy') {
                setEnergy(e => Math.min(5, e + 1));
            } else {
                setTools(t => ({ ...t, [toolId]: (t[toolId] || 0) + 1 }));
            }
            soundManager.play('powerup');
            return true;
        }
        soundManager.play('error');
        return false;
    }, [coins]);



    return {
        grid, selectedPath, animatingCells, score, moves, level, difficulty, foundWords,
        gameState, resetGame, swapSelection, createdSpecial,
        tools, activeTool, setActiveTool, changeDifficulty, selectCell,
        finishTurn, shuffle, isDictionaryLoaded,
        gameMode, currentLevelIndex, levelGoals, startTimeBattle,
        coins, buyTool, addCoins, addTool,
        cloudLevels, isLoadingLevels,
        user, profile, isLoadingProfile, fetchProfile, completedLevels,
        language, setLanguage, t,
        energy, nextEnergyIn, setEnergy, setLastEnergyRefill,
        totalScore, wordsFoundCount, gamesPlayed, highScore, avatarId, setAvatarId,
        arcadeSubMode, arcadeValue, timeLeft, totalMovesMade, zenDuration,
        gardenState, setGameState,
        celebration,
        // Rank & Mastery exports
        xp, level, masteryPoints, sessionXP, getNextLevelXp,
        // Time Battle exports
        timeBattleElapsed, timeBattleToolRewards, pendingToolReward,
        timeBattleInitialDuration, calculateTimeBattleGold, getTimeBattleRank, nextToolRewardAt,
        // Event exports
        activeEvents, isLoadingEvents, fetchActiveEvents, currentEventId,
        isMobile, orientation,
        isTutorial, tutorialHint,
        dailyMissions, claimMissionReward, updateMissionProgress
    };
};
