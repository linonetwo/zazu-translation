// german <-> chinese translation @see ./translate.js
const translate = require('./utils/translation');
const mapTranslationItem = require('./utils/mapTranslationItem');

module.exports = (pluginContext) => query => {
  return translate(query, 'zh-TW', pluginContext).then(results => results.map(mapTranslationItem));
};
