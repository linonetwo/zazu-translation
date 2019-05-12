const translate = require('@vitalets/google-translate-api');

module.exports = function translation(query, to = 'en', pluginContext) {
  pluginContext.console.log('Warn', 'start translation', {
    query,
    to,
  });
  return translate(query, { to })
    .then(result => {
      return [{ raw: query, result: result.text, from: result.from.language.iso, to }];
    })
    .catch(error => {
      console.error(error);
      return [{ raw: query, result: String(error) }];
    });
};
