/**
 * Word Game
 * @description The command should display a definition, a synonym or an antonym and ask the user to guess the word. 
 */

const api = require('./../../api');
const randomWord = require('./../basic/random-word');

// Globals
let CURRENT_DEF_INDEX = 0;
let CURRENT_SYN_INDEX = 0;
let CURRENT_ANT_INDEX = 0;

function getPuzzle (data) {
    let puzzle = ['defn', 'syn', 'ant'];
    let randomIndex = Math.floor(Math.random() * 3);

    let obj = {
        defn() {
            CURRENT_DEF_INDEX = CURRENT_DEF_INDEX < data.defn.length ? CURRENT_DEF_INDEX++ : CURRENT_DEF_INDEX;
            return `Definition: ${data.defn[CURRENT_DEF_INDEX].text}\n`;
        },
        syn() {
            CURRENT_SYN_INDEX = CURRENT_SYN_INDEX < data.syn.length ? CURRENT_SYN_INDEX++ : CURRENT_SYN_INDEX;
            return `Synonym: ${data.syn[CURRENT_SYN_INDEX]}\n`;
        },
        ant() {
            if (data.ant[CURRENT_ANT_INDEX]) {
                CURRENT_ANT_INDEX = CURRENT_ANT_INDEX < data.ant.length ? CURRENT_ANT_INDEX++ : CURRENT_ANT_INDEX;
                return `Antonym: ${data.syn[CURRENT_ANT_INDEX]}\n`;
            } else {
                this.syn();
            }
            
        }
    };

    return (obj[puzzle[randomIndex]])();
}

function ask (data) {
    console.log(data.word, data.syn);

    console.log(`Word Game`);
    console.log('=========\n');
    console.log(`Guess the word:`);
    console.log('---------------\n');
    console.log(getPuzzle(data));
    console.log('Enter input: ');
}

function makeHint (data) {
    console.log('Hint:');
    console.log('=====\n');
    console.log(getPuzzle(data));
    console.log('Enter input: ');
}

function startGame (data) {
    let isAnsCorrent = null, errorThrown = false;

    ask(data);

    process.stdin.on('data', function (input) {
        
        input = input.toString().replace(/(\r\n|\n|\r)/gm, '');

        if (input == data.word || data.syn.indexOf(input) != -1 && !isAnsCorrent) {
            isAnsCorrent = true;
            console.log('\nSuccess: Correct Answer\n');
            process.exit();
        } else {
            isAnsCorrent = false;
            if (!errorThrown) {
                errorThrown = true;
                console.log('\nFailed: Incorrect Answer\n');
                console.log('Choose one option:');
                console.log('(1) Try again');
                console.log('(2) Hint');
                console.log('(3) Quit\n');
                console.log('Enter input: ');
            }

            if (errorThrown) {
                switch (input) {
                    case '1': 
                        console.clear();
                        errorThrown = false;
                        ask(data);
                    break;

                    case '2':
                        makeHint(data);
                    break;

                    case '3':
                        process.exit();
                    break;
                }
            }
        }
    });
}

module.exports = function () {
    randomWord().then(
        data => {
            let word = data.word;
            return {
                word: word,
                defn: api({ api: 'defn', word: word }),
                syn: api({ api: 'syn', word: word }),
                ant: api({ api: 'ant', word: word }),
            };
        }
    ).then(
        data => {
            // Resolving definition
            return data.defn.then(
                defnData => {
                    return {
                        word: data.word,
                        defn: defnData,
                        syn: api({ api: 'syn', word: data.word }),
                        ant: api({ api: 'ant', word: data.word }),
                    }
                }
            )
        }
    ).then(
        data => {
            return data.syn.then(
                synData => {
                    let synWord;

                    synData.forEach(function (elem) {
                        if (elem.relationshipType == 'synonym') {
                            synWord = elem.words;
                        }
                    })

                    return {
                        word: data.word,
                        defn: data.defn,
                        syn: synWord,
                        ant: api({ api: 'ant', word: data.word }),
                    }
                }
            )
        }
    ).then(
        data => {
            return data.ant.then(
                antData => {
                    let antWord;

                    antData.forEach(function (elem) {
                        if (elem.relationshipType == 'antonym') {
                            antWord = elem.words;
                        }
                    })

                    return {
                        word: data.word,
                        defn: data.defn,
                        syn: data.syn,
                        ant: antWord,
                    }
                }
            )
        }
    ).then(
        data => startGame(data)
    ).catch(
        err => {
            console.log('Found error:: ', err.message);
            console.log('Please try again.');
        }
    )
}