/**
 * Word Full Dict
 * @description Display Word Definitions, Word Synonyms, Word Antonyms & Word Examples for a given word.
 */

const definitions = require('./../basic/definitions');
const synonyms = require('./../basic/synonyms');
const antonyms = require('./../basic/antonyms');
const examples = require('./../basic/examples');

module.exports = function (word) {
    definitions(word);
    synonyms(word);
    antonyms(word);
    examples(word);
}