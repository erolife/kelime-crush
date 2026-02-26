const fs = require('fs');
const data = fs.readFileSync('sozluk.json', 'utf8');
const wordsRaw = JSON.parse(data);
const turkishAlphabetRegex = /^[ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZÂÎÛ]+$/;
let words = new Set();

for (let w of wordsRaw) {
  if (w && w.length >= 3) {
    // Convert to Turkish Uppercase reliably
    let upperW = w.replace(/ı/g, 'I').replace(/i/g, 'İ').toUpperCase();
    if (turkishAlphabetRegex.test(upperW)) {
      words.add(upperW);
    }
  }
}

// Remove the shuffle and limit code so all words are available.
const selected = Array.from(words);
fs.writeFileSync('words.js', 'const WORD_SET = new Set(' + JSON.stringify(selected) + ');\n');
console.log('words.js created with ' + selected.length + ' words');
