const translate = require('./utils/translation');
const mapTranslationItem = require('./utils/mapTranslationItem');

module.exports = (pluginContext) => query => translate(query, 'en', pluginContext).then(results => results.map(mapTranslationItem));
