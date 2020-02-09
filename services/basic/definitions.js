/**
 * Word Definitions
 * @description Display definitions of a given word.
 */

const api = require('./../../api');

module.exports = function (word) {
    api({ api: 'defn', word: word }).then(
        data => {
            if (Array.isArray(data)) {
                console.log(`Found ${data.length} definitions of ${word}: `);
                console.log('=============================================\n')
                data.forEach(function (elem, index) {
                    console.log(`${index + 1}.`, elem.text);
                })

                console.log('\n\n');
            }
        }
    ).catch(
        err => {
            console.log('Found error:: ', err.message);
            console.log('Please try again.');
        }
    )
}