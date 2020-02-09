/**
 * Random Word
 * @description Provides random word. 
 */

const api = require('./../../api');

module.exports = function () {
    return api({ api: 'randomWord' });
}