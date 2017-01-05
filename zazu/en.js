// german <-> english translation @see ./translate.js
const translate = require("../lib/dict/translate");
const mapTranslationItem = require("./utils/mapTranslationItem");
module.exports = () => (query) => translate(query, "en").then((results) => results.map(mapTranslationItem));
