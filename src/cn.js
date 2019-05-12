// german <-> chinese translation @see ./translate.js
const translate = require('./utils/translation');
const mapTranslationItem = require('./utils/mapTranslationItem');

module.exports = pluginContext => query => {
  pluginContext.console.log('warn', 'hello world', {
    ping: 'pong',
  });
  return translate(query, 'cn', pluginContext).then(results => results.map(mapTranslationItem));
};
