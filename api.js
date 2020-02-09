const request = require('request');
const API_KEY = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164';

const apiPath = function (api, word) {
    const apiHost = 'http://fourtytwowords.herokuapp.com';
    return ({
        defn: `${apiHost}/word/${word}/definitions?api_key=${API_KEY}`,
        syn: `${apiHost}/word/${word}/relatedWords?api_key=${API_KEY}`,
        ant: `${apiHost}/word/${word}/relatedWords?api_key=${API_KEY}`,        
        ex: `${apiHost}/word/${word}/examples?api_key=${API_KEY}`,
        randomWord: `${apiHost}/words/randomWord/?api_key=${API_KEY}`
    })[api];
}

module.exports = function (arguments) {
    const {api, word} = arguments;
    let path = apiPath(api, word);

    return new Promise(function (resolve, reject) {
        request(path, { json: true }, function (err, response, body) {
            if (err) return reject(err);
            
            resolve(body);
        });
    });
}