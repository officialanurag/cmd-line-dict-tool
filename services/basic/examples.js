/**
 * Word Examples
 * @description Display examples of usage of a given word in a sentence. 
 */

const api = require('./../../api');

module.exports = function (word) {
    api({ api: 'ex', word: word }).then(
        data => {
            if (Array.isArray(data.examples)) {
                console.log(`Found ${data.examples.length} examples of ${word}: `);
                console.log('=============================================\n')
                data.examples.forEach(function (elem, index) {
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
    );
}