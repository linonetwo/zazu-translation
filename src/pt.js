// german <-> portuguese translation @see ./translate.js
const translate = require('./utils/translation');
const mapTranslationItem = require('./utils/mapTranslationItem');

module.exports = (pluginContext) => query => translate(query, 'pt', pluginContext).then(results => results.map(mapTranslationItem));
