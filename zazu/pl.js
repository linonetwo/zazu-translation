// german <-> polish translation @see ./translate.js
const translate = require("../lib/dict/translate");
const mapTranslationItem = require("./utils/mapTranslationItem");
module.exports = () => (query) => translate(query, "pl").then((results) => results.map(mapTranslationItem));
