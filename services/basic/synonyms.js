/**
 * Word Synonyms
 * @description Display synonyms of a given word.
 */

const api = require('./../../api');
const printConsole = require('./../../printConsole');

module.exports = function (word) {
    api({ api: 'syn', word: word }).then(
        data => {
            if (data.error) return console.log('-- Word not found!\n');

            if (Array.isArray(data)) {
                let haveSynonym = [
                    data[0] ? (data[0].relationshipType == 'synonym') : false, 
                    data[1] ? (data[1].relationshipType == 'synonym') : false
                ],
                synData = data[haveSynonym.indexOf(true)];

                if (haveSynonym.includes(true)) {
                    console.log(`Found ${synData.words.length} synonyms of ${word}: `);
                    console.log('=============================================\n');
                    printConsole(synData, 'words');
                } else {
                    console.log(`-- No synonyms for word ${word}.`);
                }

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