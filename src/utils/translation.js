const translate = require('@vitalets/google-translate-api');
const { timeout, TimeoutError } = require('promise-timeout');

module.exports = function translation(query, to = 'en', pluginContext) {
  pluginContext.console.log('warn', 'start translation', {
    query,
    to,
  });
  return timeout(translate(query, { to }), 3000)
    .then(result => {
      pluginContext.console.log('warn', 'finish translation', {
        raw: query,
        result: result.text,
        from: result.from.language.iso,
        to,
      });
      return [{ raw: query, result: result.text, from: result.from.language.iso, to }];
    })
    .catch(error => {
      pluginContext.console.log('error', 'failed translation', {
        error,
      });
      if (error instanceof TimeoutError) {
        return [{ to, raw: query, result: 'timeout after 3s' }];
      }
      return [{ to, raw: query, result: String(error) }];
    });
};
