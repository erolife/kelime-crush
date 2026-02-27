import { useState, useCallback, useEffect } from 'react';
import { GameEngine } from '../logic/GameEngine';
import { dictionary } from '../logic/Dictionary';
import { soundManager } from '../logic/SoundManager';
import { DIFFICULTY_SETTINGS } from '../logic/Constants';
import { LEVELS, GOAL_TYPES } from '../logic/Levels';

export const useGame = (initialDifficulty = 'normal') => {
    const [difficulty, setDifficultyState] = useState(initialDifficulty);
    const [gameMode, setGameMode] = useState('arcade'); // 'arcade' or 'mission'
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [levelGoals, setLevelGoals] = useState([]);

    const [engine, setEngine] = useState(() => {
        const settings = DIFFICULTY_SETTINGS[initialDifficulty];
        return new GameEngine(settings.rows, settings.cols, settings.vowelBonus);
    });

    const [grid, setGrid] = useState(() => engine.initGrid());
    const [selectedPath, setSelectedPath] = useState([]);
    const [animatingCells, setAnimatingCells] = useState([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(DIFFICULTY_SETTINGS[initialDifficulty].moves);
    const [level, setLevel] = useState(1);
    const [isDictionaryLoaded, setIsDictionaryLoaded] = useState(false);
    const [foundWords, setFoundWords] = useState([]);
    const [gameState, setGameState] = useState('playing'); // 'playing', 'gameover', 'victory'

    const [activeTool, setActiveTool] = useState(null);
    const [swapSelection, setSwapSelection] = useState(null);
    const [tools, setTools] = useState({
        bomb: 1, swap: 2, row: 1, col: 1, cell: 3
    });

    useEffect(() => {
        dictionary.load('./sozluk.json').then(() => setIsDictionaryLoaded(true));
    }, []);

    // Mission Mode Initialization
    const startMission = useCallback((index) => {
        const mission = LEVELS[index];
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
    }, []);

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
                // Give rewards
                const rewards = LEVELS[currentLevelIndex].rewards;
                if (rewards && rewards.tools) {
                    setTools(t => {
                        const newTools = { ...t };
                        Object.entries(rewards.tools).forEach(([id, amt]) => {
                            newTools[id] = (newTools[id] || 0) + amt;
                        });
                        return newTools;
                    });
                }
            }
            return next;
        });
    }, [gameMode, score, gameState, currentLevelIndex]);

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
            const { grid: newGrid, blasted } = engine.removeCells(selectedPath);

            const allRemoved = [
                ...selectedPath.map(p => ({ ...p, type: 'match' })),
                ...(blasted || [])
            ];

            setAnimatingCells(allRemoved);
            setTimeout(() => setAnimatingCells([]), 600);

            setGrid([...newGrid]);
            setScore(s => s + turnScore);
            setMoves(m => m - 1);
            setFoundWords(prev => [word, ...prev].slice(0, 50));
            setSelectedPath([]);

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

    const resetGame = useCallback(() => {
        if (gameMode === 'mission') {
            startMission(currentLevelIndex);
            return;
        }
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
    }, [engine, difficulty, gameMode, currentLevelIndex, startMission]);

    useEffect(() => {
        if (moves <= 0 && gameState === 'playing') {
            setGameState('gameover');
        }
    }, [moves, gameState]);

    return {
        grid, selectedPath, animatingCells, score, moves, level, difficulty, foundWords,
        gameState, resetGame, swapSelection,
        tools, activeTool, setActiveTool, changeDifficulty, selectCell,
        finishTurn, shuffle, isDictionaryLoaded,
        gameMode, currentLevelIndex, levelGoals, startMission
    };
};
