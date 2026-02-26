import { useState, useCallback, useEffect } from 'react';
import { GameEngine } from '../logic/GameEngine';
import { dictionary } from '../logic/Dictionary';
import { soundManager } from '../logic/SoundManager';
import { DIFFICULTY_SETTINGS } from '../logic/Constants';

export const useGame = (initialDifficulty = 'normal') => {
    const [difficulty, setDifficultyState] = useState(initialDifficulty);
    const [engine, setEngine] = useState(() => {
        const settings = DIFFICULTY_SETTINGS[initialDifficulty];
        return new GameEngine(settings.rows, settings.cols, settings.vowelBonus);
    });

    const [grid, setGrid] = useState(() => engine.initGrid());
    const [selectedPath, setSelectedPath] = useState([]);
    const [animatingCells, setAnimatingCells] = useState([]); // Renamed for clarity
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(DIFFICULTY_SETTINGS[initialDifficulty].moves);
    const [level, setLevel] = useState(1);
    const [isDictionaryLoaded, setIsDictionaryLoaded] = useState(false);
    const [foundWords, setFoundWords] = useState([]);
    const [gameState, setGameState] = useState('playing'); // 'playing', 'gameover'

    const [activeTool, setActiveTool] = useState(null);
    const [swapSelection, setSwapSelection] = useState(null);
    const [tools, setTools] = useState({
        bomb: 1, swap: 2, row: 1, col: 1, cell: 3
    });

    useEffect(() => {
        dictionary.load('./sozluk.json').then(() => setIsDictionaryLoaded(true));
    }, []);

    const changeDifficulty = useCallback((newDiff) => {
        const settings = DIFFICULTY_SETTINGS[newDiff];
        const newEngine = new GameEngine(settings.rows, settings.cols, settings.vowelBonus);
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
                    // Prevent swapping same cell
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
        }
    }, [activeTool, tools, engine, swapSelection]);

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

            // Collect ALL removed cells for animation (Path + Blasted)
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
            // Match sound is triggered in PremiumCanvas UI logic
            return true;
        }
        soundManager.play('error');
        setSelectedPath([]);
        return false;
    }, [selectedPath, grid, engine]);

    const shuffle = useCallback(() => {
        if (gameState !== 'playing' || moves < 5) return;
        const result = engine.shuffleGrid();
        setGrid([...result.grid]);
        setMoves(m => m - 5);
        soundManager.play('swap');
    }, [engine, moves, gameState]);

    const resetGame = useCallback(() => {
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
    }, [engine, difficulty]);

    useEffect(() => {
        if (moves <= 0 && gameState === 'playing') {
            setGameState('gameover');
        }
    }, [moves, gameState]);

    return {
        grid, selectedPath, animatingCells, score, moves, level, difficulty, foundWords,
        gameState, resetGame, swapSelection,
        tools, activeTool, setActiveTool, changeDifficulty, selectCell,
        finishTurn, shuffle, isDictionaryLoaded
    };
};
