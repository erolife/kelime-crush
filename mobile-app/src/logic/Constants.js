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

export const TR_LETTER_WEIGHTS = {
    'A': 25, 'E': 22, 'İ': 18, 'I': 12, 'O': 10, 'Ö': 8, 'U': 10, 'Ü': 8,
    'K': 12, 'L': 12, 'M': 10, 'N': 12, 'R': 12, 'S': 10, 'T': 10, 'Y': 10,
    'B': 6, 'C': 5, 'Ç': 5, 'D': 8, 'G': 5, 'Ğ': 3, 'H': 5, 'P': 5, 'Ş': 5, 'V': 4, 'Z': 5,
    'F': 2, 'J': 1
};

export const EN_LETTER_WEIGHTS = {
    'E': 25, 'T': 20, 'A': 18, 'O': 16, 'I': 16, 'N': 15, 'S': 15, 'R': 14, 'H': 12, 'D': 10,
    'L': 10, 'U': 8, 'C': 8, 'M': 7, 'F': 6, 'Y': 6, 'W': 6, 'G': 5, 'P': 5, 'B': 5,
    'V': 3, 'K': 2, 'X': 2, 'J': 2, 'Q': 2, 'Z': 2
};

export const BASE_LETTER_WEIGHTS = TR_LETTER_WEIGHTS; // Fallback

export const TR_LETTER_POINTS = {
    'A': 1, 'E': 1, 'İ': 1, 'K': 1, 'L': 1, 'M': 1, 'N': 1, 'R': 1, 'S': 1, 'T': 1,
    'B': 2, 'D': 2, 'O': 2, 'U': 2,
    'G': 3, 'Ş': 3, 'Z': 3, 'I': 3,
    'Ç': 4, 'P': 4, 'V': 4,
    'Ö': 5, 'Ü': 5, 'H': 5,
    'C': 7,
    'F': 8,
    'J': 10, 'Ğ': 10
};

export const EN_LETTER_POINTS = {
    'E': 1, 'T': 1, 'A': 1, 'O': 1, 'I': 1, 'N': 1, 'S': 1, 'R': 1,
    'H': 2, 'D': 2, 'L': 2, 'U': 2,
    'C': 3, 'M': 3, 'P': 3, 'G': 3,
    'F': 4, 'Y': 4, 'W': 4, 'B': 4, 'V': 4,
    'K': 5,
    'X': 8, 'J': 8,
    'Q': 10, 'Z': 10
};

export const LETTER_POINTS = TR_LETTER_POINTS; // Fallback

export const TR_VOWELS = ['A', 'E', 'İ', 'I', 'O', 'Ö', 'U', 'Ü'];
export const EN_VOWELS = ['A', 'E', 'I', 'O', 'U'];
export const VOWELS = TR_VOWELS; // Fallback

// Mobile grid overrides by orientation (used when screen width < 768px)
export const GRID_OVERRIDES = {
    portrait: { rows: 11, cols: 8 },   // Mobil dikey: daha az kolon, daha fazla satır
    landscape: { rows: 7, cols: 13 },  // Mobil yatay: daha fazla kolon, daha az satır
};

// Helper: returns { rows, cols } based on device and orientation
export const getGridSize = (difficulty, isMobile = false, orientation = 'portrait') => {
    const settings = DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.normal;
    if (isMobile) {
        const override = GRID_OVERRIDES[orientation] || GRID_OVERRIDES.portrait;
        return { rows: override.rows, cols: override.cols };
    }
    return { rows: settings.rows, cols: settings.cols };
};

export const MAX_ENERGY = 5;
export const ENERGY_REGEN_TIME = 20 * 60 * 1000; // 20 minutes

// ===== TIME BATTLE MODE =====
export const TIME_BATTLE_OPTIONS = [60, 180, 300]; // 1dk, 3dk, 5dk (saniye)

// Kademeli altın ödülleri (toplam dayanma süresine göre)
export const TIME_BATTLE_GOLD_TIERS = [
    { minSeconds: 0, maxSeconds: 60, gold: 10 },
    { minSeconds: 60, maxSeconds: 180, gold: 30 },
    { minSeconds: 180, maxSeconds: 300, gold: 60 },
    { minSeconds: 300, maxSeconds: 600, gold: 120 },
    { minSeconds: 600, maxSeconds: Infinity, gold: 200 },
];

// Rütbe eşikleri (toplam dayanma süresine göre)
export const TIME_BATTLE_RANKS = [
    { id: 'bronze', minSeconds: 0, label_tr: 'Bronz Savaşçı', label_en: 'Bronze Warrior' },
    { id: 'silver', minSeconds: 300, label_tr: 'Gümüş Savaşçı', label_en: 'Silver Warrior' },
    { id: 'gold', minSeconds: 900, label_tr: 'Altın Savaşçı', label_en: 'Gold Warrior' },
];

// Araç ödülü aralıkları (saniye)
export const TIME_BATTLE_TOOL_REWARDS = {
    firstAt: 60,       // İlk ödül: 1 dakikada
    subsequentEvery: 120, // Sonrakiler: her 2 dakikada
};

// Kazanılabilecek araç havuzu (rastgele)
export const TIME_BATTLE_REWARD_POOL = ['bomb', 'swap', 'row', 'col', 'cell'];
