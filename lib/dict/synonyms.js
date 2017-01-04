const request = require("./request");
const transform = require("./transformLeoResponse");


module.exports = function (search, lang = "en", maxResults = 50) {
    return request(search, lang, maxResults)
        .then(transform)
        .then((result) => result.synonyms)
        .catch((e) => {
            console.log(e.stack);
            throw e;
        });
};
