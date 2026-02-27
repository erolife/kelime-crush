const CHALLENGE_GRID_SIZE = 10;

export const DIFFICULTY_SETTINGS = {
    easy: {
        moves: 40,
        scoreTarget: 200,
        vowelBonus: 1.8,
        rows: 9,
        cols: 11,
        label: 'Kolay'
    },
    normal: {
        moves: 30,
        scoreTarget: 300,
        vowelBonus: 1.0,
        rows: 9,
        cols: 11,
        label: 'Zor'
    },
    pro: {
        moves: 20,
        scoreTarget: 500,
        vowelBonus: 0.6,
        rows: 9,
        cols: 11,
        label: 'Profesör'
    }
};

export const BASE_LETTER_WEIGHTS = {
    'A': 25, 'E': 22, 'İ': 18, 'I': 12, 'O': 10, 'Ö': 8, 'U': 10, 'Ü': 8,
    'K': 12, 'L': 12, 'M': 10, 'N': 12, 'R': 12, 'S': 10, 'T': 10, 'Y': 10,
    'B': 6, 'C': 5, 'Ç': 5, 'D': 8, 'G': 5, 'Ğ': 3, 'H': 5, 'P': 5, 'Ş': 5, 'V': 4, 'Z': 5,
    'F': 2, 'J': 1
};

export const LETTER_POINTS = {
    'A': 1, 'E': 1, 'İ': 1, 'K': 1, 'L': 1, 'M': 1, 'N': 1, 'R': 1, 'S': 1, 'T': 1,
    'B': 2, 'D': 2, 'O': 2, 'U': 2,
    'G': 3, 'Ş': 3, 'Z': 3, 'I': 3,
    'Ç': 4, 'P': 4, 'V': 4,
    'Ö': 5, 'Ü': 5, 'H': 5,
    'C': 7,
    'F': 8,
    'J': 10, 'Ğ': 10
};

export const VOWELS = ['A', 'E', 'İ', 'I', 'O', 'Ö', 'U', 'Ü'];

export const MAX_ENERGY = 5;
export const ENERGY_REGEN_TIME = 20 * 60 * 1000; // 20 minutes
