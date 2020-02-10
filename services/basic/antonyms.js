/**
 * Word Antonyms
 * @description Display antonyms of a given word.
 */

const api = require('./../../api');
const printConsole = require('./../../printConsole');

module.exports = function (word) {
    api({ api: 'ant', word: word }).then(
        data => {
            if (data.error) return console.log('-- Word not found!\n');

            if (Array.isArray(data)) {
                let haveAntonym = [
                    data[0] ? (data[0].relationshipType == 'antonym') : false, 
                    data[1] ? (data[1].relationshipType == 'antonym') : false
                ],
                antData = data[haveAntonym.indexOf(true)];

                if (haveAntonym.includes(true)) {
                    console.log(`Found ${antData.words.length} antonyms of ${word}: `);
                    console.log('=============================================\n');
                    printConsole(antData, 'words');
                } else {
                    console.log(`-- No antonyms for word ${word}.`);
                }

                console.log('\n');
            }
        }
    ).catch(
        err => {
            console.log('Found error:: ', err.message);
            console.log('Please try again.');
        }
    );
}