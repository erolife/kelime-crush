export const GOAL_TYPES = {
    WORD_COUNT: 'wordCount',       // Toplam kelime sayısı
    WORD_LENGTH: 'wordLength',     // Belirli uzunlukta kelime
    SCORE: 'score',                 // Toplam puan
    USE_TOOL: 'useTool',           // Belirli bir aracı kullanma
    SPECIFIC_LETTER: 'specificLetter' // Belirli bir harfi içeren kelime
};

export const LEVELS = [
    {
        id: 1,
        title: "Acemi Avcı",
        description: "Kelime avcılığına küçük adımlarla başla.",
        moves: 12,
        difficulty: 'easy',
        goals: [
            {
                type: GOAL_TYPES.WORD_LENGTH,
                value: 4,
                count: 2,
                current: 0,
                text: "4 Harfli 2 Kelime"
            }
        ],
        rewards: {
            tools: { bomb: 1 },
            coins: 100
        }
    },
    {
        id: 2,
        title: "Hızlı Düşünür",
        description: "Biraz daha uzun kelimelere odaklanalım.",
        moves: 15,
        difficulty: 'easy',
        goals: [
            {
                type: GOAL_TYPES.WORD_LENGTH,
                value: 5,
                count: 1,
                current: 0,
                text: "5 Harfli 1 Kelime"
            },
            {
                type: GOAL_TYPES.SCORE,
                value: 200,
                current: 0,
                text: "200 Puan Topla"
            }
        ],
        rewards: {
            tools: { swap: 1 },
            coins: 100
        }
    },
    {
        id: 3,
        title: "Bomba Uzmanı",
        description: "Patlayıcıları kullanma vakti.",
        moves: 20,
        difficulty: 'normal',
        goals: [
            {
                type: GOAL_TYPES.USE_TOOL,
                value: 'bomb',
                count: 1,
                current: 0,
                text: "1 Bomba Patlat"
            },
            {
                type: GOAL_TYPES.WORD_COUNT,
                value: null,
                count: 5,
                current: 0,
                text: "Toplam 5 Kelime Bul"
            }
        ],
        rewards: {
            tools: { bomb: 1, cell: 1 },
            coins: 250
        }
    }
];
