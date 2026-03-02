import {
    TR_LETTER_WEIGHTS, EN_LETTER_WEIGHTS,
    TR_LETTER_POINTS, EN_LETTER_POINTS,
    TR_VOWELS, EN_VOWELS
} from './Constants';

export class GameEngine {
    constructor(rows = 10, cols = 10, vowelBonus = 1.0, language = 'tr') {
        this.rows = rows;
        this.cols = cols;
        this.vowelBonus = vowelBonus;
        this.language = language;
        this.grid = [];
    }

    setLanguage(lang) {
        this.language = lang;
    }

    createCell(r, c, letter) {
        return {
            id: 'c-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            letter: letter || this.getRandomLetter(),
            r: r,
            c: c,
            type: 'normal'
        };
    }

    initGrid() {
        this.grid = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => this.createCell(0, 0))
        );
        this.updateCoords();
        return this.grid;
    }

    updateCoords() {
        this.grid.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell) {
                    cell.r = r;
                    cell.c = c;
                }
            });
        });
    }

    getRandomLetter() {
        const weights = this.language === 'tr' ? TR_LETTER_WEIGHTS : EN_LETTER_WEIGHTS;
        const vowels = this.language === 'tr' ? TR_VOWELS : EN_VOWELS;

        const pool = [];
        for (let [letter, weight] of Object.entries(weights)) {
            let finalWeight = weight;
            if (vowels.includes(letter)) finalWeight = Math.round(weight * this.vowelBonus);
            for (let i = 0; i < finalWeight; i++) pool.push(letter);
        }
        return pool[Math.floor(Math.random() * pool.length)];
    }

    getLetterPoint(letter) {
        const points = this.language === 'tr' ? TR_LETTER_POINTS : EN_LETTER_POINTS;
        return points[letter] || 1;
    }

    calculateScore(path) {
        // Letter-based scoring: sum of individual letter points + length bonus
        const letterTotal = path.reduce((sum, p) => sum + this.getLetterPoint(p.letter), 0);
        const lengthBonus = path.length * 10;
        return letterTotal + lengthBonus;
    }

    applyGravity() {
        const changes = [];
        for (let c = 0; c < this.cols; c++) {
            let emptySpaces = 0;
            for (let r = this.rows - 1; r >= 0; r--) {
                if (this.grid[r][c] === null) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    const cell = this.grid[r][c];
                    this.grid[r + emptySpaces][c] = cell;
                    this.grid[r][c] = null;
                    cell.r = r + emptySpaces;
                    changes.push({ from: { r, c }, to: { r: r + emptySpaces, c } });
                }
            }
            for (let r = 0; r < emptySpaces; r++) {
                this.grid[r][c] = this.createCell(r, c);
            }
        }
        this.updateCoords();
        return { grid: this.grid.map(row => [...row]), changes };
    }

    removeCells(path) {
        const wordLength = path.length;
        const blasted = [];

        path.forEach(p => {
            const cell = this.grid[p.r][p.c];
            if (cell && cell.type !== 'normal') {
                this.triggerSpecialCell(p.r, p.c, cell.type, blasted);
            }
        });

        let createdSpecial = null;
        path.forEach((p, index) => {
            if (this.grid[p.r] && this.grid[p.r][p.c]) {
                if (index === 0 && wordLength >= 4) {
                    const cell = this.grid[p.r][p.c];
                    if (wordLength === 4) cell.type = Math.random() > 0.5 ? 'row_blast' : 'col_blast';
                    else if (wordLength === 5) cell.type = 'bomb';
                    else if (wordLength === 6) cell.type = 'dynamite';
                    else if (wordLength >= 7) cell.type = 'nuclear';
                    createdSpecial = { r: p.r, c: p.c, type: cell.type };
                } else {
                    this.grid[p.r][p.c] = null;
                }
            }
        });

        const result = this.applyGravity();
        return { ...result, blasted, createdSpecial };
    }

    triggerSpecialCell(r, c, type, blasted = []) {
        // Avoid infinite recursion if cells are already null
        if (!this.grid[r] || !this.grid[r][c]) return;

        blasted.push({ r, c, type });
        this.grid[r][c] = null;

        if (type === 'row_blast') {
            for (let i = 0; i < this.cols; i++) {
                const target = this.grid[r][i];
                if (target) {
                    const tType = target.type;
                    if (tType !== 'normal') this.triggerSpecialCell(r, i, tType, blasted);
                    else {
                        blasted.push({ r, c: i, type: 'normal' });
                        this.grid[r][i] = null;
                    }
                }
            }
        } else if (type === 'col_blast') {
            for (let i = 0; i < this.rows; i++) {
                const target = this.grid[i][c];
                if (target) {
                    const tType = target.type;
                    if (tType !== 'normal') this.triggerSpecialCell(i, c, tType, blasted);
                    else {
                        blasted.push({ r: i, c, type: 'normal' });
                        this.grid[i][c] = null;
                    }
                }
            }
        } else if (type === 'bomb') {
            for (let i = r - 1; i <= r + 1; i++) {
                for (let j = c - 1; j <= c + 1; j++) {
                    if (this.grid[i] && this.grid[i][j]) {
                        const target = this.grid[i][j];
                        const tType = target.type;
                        if (tType !== 'normal') this.triggerSpecialCell(i, j, tType, blasted);
                        else {
                            blasted.push({ r: i, c: j, type: 'normal' });
                            this.grid[i][j] = null;
                        }
                    }
                }
            }
        } else if (type === 'dynamite') {
            // Diagonal cross (X) — all 4 diagonal directions from center
            const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
            for (const [dr, dc] of directions) {
                let i = r + dr;
                let j = c + dc;
                while (i >= 0 && i < this.rows && j >= 0 && j < this.cols) {
                    if (this.grid[i] && this.grid[i][j]) {
                        const target = this.grid[i][j];
                        const tType = target.type;
                        if (tType !== 'normal') this.triggerSpecialCell(i, j, tType, blasted);
                        else {
                            blasted.push({ r: i, c: j, type: 'normal' });
                            this.grid[i][j] = null;
                        }
                    }
                    i += dr;
                    j += dc;
                }
            }
        } else if (type === 'nuclear') {
            // Clear entire grid
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    if (this.grid[i] && this.grid[i][j]) {
                        const target = this.grid[i][j];
                        const tType = target.type;
                        if (tType !== 'normal') this.triggerSpecialCell(i, j, tType, blasted);
                        else {
                            blasted.push({ r: i, c: j, type: 'normal' });
                            this.grid[i][j] = null;
                        }
                    }
                }
            }
        }
    }

    removeRow(r) {
        const blasted = [];
        if (this.grid[r]) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.grid[r][c];
                if (cell) {
                    if (cell.type !== 'normal') this.triggerSpecialCell(r, c, cell.type, blasted);
                    else {
                        blasted.push({ r, c, type: 'normal' });
                        this.grid[r][c] = null;
                    }
                }
            }
        }
        return { ...this.applyGravity(), blasted };
    }

    removeCol(c) {
        const blasted = [];
        for (let r = 0; r < this.rows; r++) {
            const cell = this.grid[r][c];
            if (cell) {
                if (cell.type !== 'normal') this.triggerSpecialCell(r, c, cell.type, blasted);
                else {
                    blasted.push({ r, c, type: 'normal' });
                    this.grid[r][c] = null;
                }
            }
        }
        return { ...this.applyGravity(), blasted };
    }

    removeSingle(r, c) {
        const blasted = [];
        const cell = this.grid[r][c];
        if (cell) {
            if (cell.type !== 'normal') this.triggerSpecialCell(r, c, cell.type, blasted);
            else {
                blasted.push({ r, c, type: 'normal' });
                this.grid[r][c] = null;
            }
        }
        return { ...this.applyGravity(), blasted };
    }

    removeArea(r, c, size = 1) {
        const blasted = [];
        for (let i = r - size; i <= r + size; i++) {
            for (let j = c - size; j <= c + size; j++) {
                if (this.grid[i] && this.grid[i][j]) {
                    const cell = this.grid[i][j];
                    if (cell.type !== 'normal') this.triggerSpecialCell(i, j, cell.type, blasted);
                    else {
                        blasted.push({ r: i, c: j, type: 'normal' });
                        this.grid[i][j] = null;
                    }
                }
            }
        }
        return { ...this.applyGravity(), blasted };
    }

    swapCells(p1, p2) {
        if (!this.grid[p1.r] || !this.grid[p2.r]) return null;
        const c1 = this.grid[p1.r][p1.c];
        const c2 = this.grid[p2.r][p2.c];
        this.grid[p1.r][p1.c] = c2;
        if (c2) { c2.r = p1.r; c2.c = p1.c; }
        this.grid[p2.r][p2.c] = c1;
        if (c1) { c1.r = p2.r; c1.c = p2.c; }
        return { grid: [...this.grid] };
    }

    shuffleGrid() {
        const pool = [];
        // Collect all existing cell objects
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c]) {
                    pool.push(this.grid[r][c]);
                }
            }
        }

        // Fisher-Yates Shuffle the objects
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        // Put objects back into grid and update their internal r/c
        let poolIndex = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (poolIndex < pool.length) {
                    const cell = pool[poolIndex++];
                    this.grid[r][c] = cell;
                    cell.r = r;
                    cell.c = c;
                } else {
                    this.grid[r][c] = null;
                }
            }
        }
        this.updateCoords();
        return { grid: this.grid.map(row => [...row]) };
    }

    areAdjacent(c1, c2) {
        const dr = Math.abs(c1.r - c2.r);
        const dc = Math.abs(c1.c - c2.c);
        return (dr <= 1 && dc <= 1) && !(dr === 0 && dc === 0);
    }
}
