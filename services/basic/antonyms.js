/**
 * Word Antonyms
 * @description Display antonyms of a given word.
 */

const api = require('./../../api');

module.exports = function (word) {
    api({ api: 'ant', word: word }).then(
        data => {
            if (Array.isArray(data)) {
                data.forEach((elem) => {
                    if (elem.relationshipType == 'antonym') {
                        console.log(`Found ${elem.words.length} antonym of ${word}: `);
                        console.log('=============================================\n')
                        elem.words.forEach((elem, index) => {
                            console.log(`${index + 1}.`, elem);
                        });
                    }
                });

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