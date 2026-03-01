// Safe Turkish Uppercase function
const safeTurkishUpper = (str) => {
    if (!str) return "";
    return str
        .replace(/i/g, "İ")
        .replace(/ı/g, "I")
        .toUpperCase();
};

export class Dictionary {
    constructor() {
        this.caches = new Map(); // Store word sets by URL
        this.words = new Set();
        this.isLoaded = false;
        this.currentUrl = null;
    }

    async load(url = './sozluk.json') {
        // If already in cache, just switch pointers
        if (this.caches.has(url)) {
            this.words = this.caches.get(url);
            this.currentUrl = url;
            this.isLoaded = true;
            console.log("Dictionary switched from cache for:", url);
            return true;
        }

        try {
            console.log("Dictionary loading from:", url);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            let wordList = [];
            if (Array.isArray(data)) {
                wordList = data;
            } else if (data.words && Array.isArray(data.words)) {
                wordList = data.words;
            } else if (typeof data === 'object') {
                wordList = Object.keys(data);
            }

            const newSet = new Set(wordList.map(w => safeTurkishUpper(String(w)).trim()));
            this.caches.set(url, newSet); // Store in cache
            this.words = newSet;
            this.isLoaded = true;
            this.currentUrl = url;
            console.log(`Dictionary success! Total words: ${this.words.size} (Stored in cache)`);

            return true;
        } catch (error) {
            console.error("Critical: Dictionary load FAILED:", error);
            return false;
        }
    }

    isValid(word) {
        if (!word || word.length < 3) return false;
        const upperWord = safeTurkishUpper(word);
        const exists = this.words.has(upperWord);

        // Detailed logging for debugging
        console.log(`Checking word: Original="${word}", Upper="${upperWord}", Exists=${exists}`);

        return exists;
    }

    getTeselliPuan(word) {
        if (word.length >= 3) return word.length;
        return 0;
    }
}

export const dictionary = new Dictionary();
