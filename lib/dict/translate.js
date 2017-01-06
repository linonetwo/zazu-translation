const request = require("./request");
const transform = require("./transformLeoResponse");


module.exports = function (search, lang = "en", maxResults = 50) {
    return request(search, lang, maxResults)
        .then(transform)
        .then((result) => {
            if (result.hits.length !== 0) {
                return result.hits;
            }
            if (result.additional.length !== 0) {
                return result.additional;
            }
            if (result.similars.length !== 0) {
                return result.similars;
            }
            return [];
        })
        .catch((e) => {
            console.log(e.stack);
            throw e;
        });
};
