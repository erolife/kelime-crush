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
        this.words = new Set();
        this.isLoaded = false;
        this.currentUrl = null;
    }

    async load(url = './sozluk.json') {
        if (this.isLoaded && this.currentUrl === url) {
            console.log("Dictionary already loaded for:", url);
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

            this.words = new Set(wordList.map(w => safeTurkishUpper(String(w)).trim()));
            this.isLoaded = true;
            this.currentUrl = url;
            console.log(`Dictionary success! Total words: ${this.words.size}`);

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
