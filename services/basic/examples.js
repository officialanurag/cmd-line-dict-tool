/**
 * Word Examples
 * @description Display examples of usage of a given word in a sentence. 
 */

const api = require('./../../api');
const printConsole = require('./../../printConsole');

module.exports = function (word) {
    api({ api: 'ex', word: word }).then(
        data => {
            if (data.error) return console.log('-- Word not found!\n');
            
            if (Array.isArray(data.examples)) {
                console.log(`Found ${data.examples.length} examples of ${word}: `);
                console.log('=============================================\n');
                printConsole(data, 'examples', 'text');
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