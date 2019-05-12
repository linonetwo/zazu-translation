// german <-> italian translation @see ./translate.js
const translate = require('./utils/translation');
const mapTranslationItem = require('./utils/mapTranslationItem');

module.exports = () => query => translate(query, 'it').then(results => results.map(mapTranslationItem));
