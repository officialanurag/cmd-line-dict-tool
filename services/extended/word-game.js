/**
 * Word Game
 * @description The command should display a definition, a synonym or an antonym and ask the user to guess the word. 
 */

const api = require('./../../api');
const printConsole = require('./../../printConsole');
const randomWord = require('./../basic/random-word');


// Globals
let CURRENT_DEF_INDEX = 0;
let CURRENT_SYN_INDEX = 0;
let CURRENT_ANT_INDEX = 0;

function getPuzzle (data) {
    let puzzle = ['defn', 'syn', 'ant'], text;
    let randomIndex = Math.floor(Math.random() * 3);

    let obj = {
        defn() {
            text = `Definition: ${data.defn[CURRENT_DEF_INDEX].text}\n`;
            CURRENT_DEF_INDEX = CURRENT_DEF_INDEX < data.defn.length ? CURRENT_DEF_INDEX + 1 : CURRENT_DEF_INDEX;
            return text;
        },
        syn() {
            text = `Synonym: ${data.syn[CURRENT_SYN_INDEX]}\n`;
            CURRENT_SYN_INDEX = CURRENT_SYN_INDEX < data.syn.length ? CURRENT_SYN_INDEX + 1 : CURRENT_SYN_INDEX;
            return text;
        },
        ant() {
            if (data.ant) {
                text = `Antonym: ${data.syn[CURRENT_ANT_INDEX]}\n`;
                CURRENT_ANT_INDEX = CURRENT_ANT_INDEX < data.ant.length ? CURRENT_ANT_INDEX + 1 : CURRENT_ANT_INDEX;
                return text;
            } else {
                return this.syn();
            }
            
        }
    };

    return (obj[puzzle[randomIndex]])();
}

function ask (data) {
    console.log(`Word Game`);
    console.log('=========\n');
    console.log(`Guess the word:`);
    console.log('---------------\n');
    console.log(getPuzzle(data));
    console.log('Enter input: ');
}

function jumbledWord (array) {
    array.sort(() => Math.random() - 0.5);
    return array;
}

function makeHint (data) {
    let puzzle = ['jumble', 'ask'];
    let hint = puzzle[Math.floor(Math.random() * 2)];
    
    console.log('Hint:');
    console.log('=====\n');
    console.log(hint == 'jumble' ? `Jumble Word: ${jumbledWord(data.word.split('')).join('')}\n` : getPuzzle(data));
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
                        errorThrown = false;
                    break;

                    case '3':
                        console.log(`\n\nWord of day is ${data.word.toUpperCase()}.`);
                        console.log('===========================\n\n')

                        console.log(`Found ${data.defn.length} definitions of ${data.word}: `);
                        console.log('=============================================\n');
                        printConsole(data.defn, null, 'text');
                        console.log('\n\n');

                        console.log(`Found ${data.syn.length} synonyms of ${data.word}: `);
                        console.log('=============================================\n');
                        printConsole(data.syn);
                        console.log('\n\n');

                        if (data.ant) {
                            console.log(`Found ${data.ant.length} antonyms of ${data.word}: `);
                            console.log('=============================================\n');
                            printConsole(data.ant);
                        } else {
                            console.log(`-- No antonyms for word ${data.word}.`);
                        }
                        console.log('\n\n');

                        data.ex.then(
                            exData => {
                                console.log(`Found ${exData.examples.length} examples of ${data.word}: `);
                                console.log('=============================================\n');
                                printConsole(exData, 'examples', 'text');
                                console.log('\n\n');
                                process.exit();
                            }
                        )
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
                ex: api({ api: 'ex', word: word })
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
                        syn: data.syn,
                        ant: data.ant,
                        ex: data.ex
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
                        ant: data.ant,
                        ex: data.ex
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
                        ex: data.ex
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