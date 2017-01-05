const request = require("request");
const parser = require("xml2json");
const render = require("../render");

// eslint-disable-next-line max-len
const query = "lang={{lang}}de&rmWords=off&rmSearch=on&search={{search}}&resultOrder=basic&multiwordShowSingle=on&pos=0&sectLenMax={{maxResults}}&n=3&t={{time}}";
const url = "http://dict.leo.org/dictQuery/m-vocab/{{lang}}de/query.xml?";


module.exports = function sendRequest(search, lang = "en", maxResults = 16) {
    const requestData = { time: (new Date()).toISOString(), lang, search: encodeURIComponent(search), maxResults };
    const requestUrl = render(url, requestData) + render(query, requestData);

    process.env.DEBUG && console.log("request", requestData);

    return new Promise((resolve, reject) => {
        request(requestUrl, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }

            const response = parser.toJson(body, {
                object: true,
                arrayNotation: true
            });
            resolve(response);
        });
    });
};
