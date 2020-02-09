/**
 * Word of the Day Full Dict
 * @description Display Word Definitions, Word Synonyms, Word Antonyms & Word Examples for a random word.
 */

const randomWord = require('./../basic/random-word');
const wordDict = require('./word-dict');

module.exports = function () {
    let word = randomWord();

    word.then(
        data => {
            console.log(`Word of day is ${data.word.toUpperCase()}.`);
            console.log('===========================\n\n')
            wordDict(data.word);
        }
    ).catch(
        err => {
            console.log('Found error:: ', err.message);
            console.log('Please try again.');
        }
    )
}