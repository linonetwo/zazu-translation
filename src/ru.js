// german <-> italian translation @see ./translate.js
const translate = require('./utils/translation');
const mapTranslationItem = require('./utils/mapTranslationItem');

module.exports = (pluginContext) => query => translate(query, 'ru', pluginContext).then(results => results.map(mapTranslationItem));
