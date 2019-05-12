const translate = require('./utils/translation');
const mapTranslationItem = require('./utils/mapTranslationItem');

module.exports = (pluginContext) => query => {
  return translate(query, 'cn', pluginContext).then(results => results.map(mapTranslationItem));
};
