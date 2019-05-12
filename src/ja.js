const translate = require('./utils/translation');
const mapTranslationItem = require('./utils/mapTranslationItem');

module.exports = (pluginContext) => query => translate(query, 'ja', pluginContext).then(results => results.map(mapTranslationItem));
