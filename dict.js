/**
 * Command Line Dictionary Tool
 * @description Command line tool for word definitions, synonyms, antonyms,
 * examples. It provide full dictonary for a particular word. You can also play 
 * game using `play` api.
 * 
 * Author: Anurag Gupta
 * Phone: +91-9041212660
 * Email: officialanurag1995@gmail.com
 */

// Word Services 
const definition = require('./services/basic/definitions');
const synonyms = require('./services/basic/synonyms');
const antonyms = require('./services/basic/antonyms');
const examples = require('./services/basic/examples');
const wordDict = require('./services/extended/word-dict');
const wordOfDay = require('./services/extended/word-of-day');
const wordGame = require('./services/extended/word-game');

// Quick access services
const services = {
    defn: definition,
    syn: synonyms,
    ant: antonyms,
    ex: examples
}

/**
 * Arguments from console.
 * `arg1` is api in case of [defn, syn, ant, ex, play]
 * `arg2` is word in case of [defn, syn, ant, ex]
 * `arg1` is word in case of Word Dict.
 */
const [arg1, arg2] = process.argv.slice(2);

// Conditional chunk for loading service
if (['defn', 'syn', 'ant', 'ex'].includes(arg1)) {
    if (arg2) {
        services[arg1](arg2);
    } else {
        console.log('--Word is missing. Please provide the word.\n');
    }
} else if (arg1 == 'play') {
    wordGame();
} else {
    if (arg1) {
        wordDict(arg1);
    } else {
        wordOfDay();
    }
}