import { BASE_LETTER_WEIGHTS, VOWELS } from './Constants';

export class GameEngine {
    constructor(rows = 10, cols = 10, vowelBonus = 1.0) {
        this.rows = rows;
        this.cols = cols;
        this.vowelBonus = vowelBonus;
        this.grid = [];
    }

    createCell(r, c, letter) {
        return {
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
        const pool = [];
        for (let [letter, weight] of Object.entries(BASE_LETTER_WEIGHTS)) {
            let finalWeight = weight;
            if (VOWELS.includes(letter)) finalWeight = Math.round(weight * this.vowelBonus);
            for (let i = 0; i < finalWeight; i++) pool.push(letter);
        }
        return pool[Math.floor(Math.random() * pool.length)];
    }

    calculateScore(path) {
        return path.length * 15; // Simplified but generous
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
        return { grid: [...this.grid], changes };
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

        path.forEach((p, index) => {
            if (this.grid[p.r] && this.grid[p.r][p.c]) {
                if (index === 0 && wordLength >= 4) {
                    if (wordLength === 4) this.grid[p.r][p.c].type = Math.random() > 0.5 ? 'row_blast' : 'col_blast';
                    else if (wordLength >= 5) this.grid[p.r][p.c].type = 'bomb';
                } else {
                    this.grid[p.r][p.c] = null;
                }
            }
        });

        const result = this.applyGravity();
        return { ...result, blasted };
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

    areAdjacent(c1, c2) {
        const dr = Math.abs(c1.r - c2.r);
        const dc = Math.abs(c1.c - c2.c);
        return (dr <= 1 && dc <= 1) && !(dr === 0 && dc === 0);
    }
}
