/**
 * Word Definitions
 * @description Display definitions of a given word.
 */

const api = require('./../../api');
const printConsole = require('./../../printConsole');

module.exports = function (word) {
    api({ api: 'defn', word: word }).then(
        data => {
            if (data.error) return console.log('-- Word not found!\n');

            if (Array.isArray(data)) {
                console.log(`Found ${data.length} definitions of ${word}: `);
                console.log('=============================================\n');
                printConsole(data, null, 'text');
                console.log('\n\n');
            }
        }
    ).catch(
        err => {
            console.log('Found error:: ', err.message);
            console.log('Please try again.');
        }
    );
}