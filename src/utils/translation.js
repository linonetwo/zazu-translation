const googleTranslate = require('@vitalets/google-translate-api');
const baiduTranslate = require('baidu-translate-api');
const { timeout, TimeoutError } = require('promise-timeout');

module.exports = function translation(query, to = 'en', pluginContext) {
  pluginContext.console.log('warn', 'start translation', {
    query,
    to,
  });

  return timeout(
    Promise.race([
      googleTranslate(query, { to: to.replace('cn', 'zh-CN').replace('tw', 'zh-TW') }).then(result => {
        pluginContext.console.log('warn', 'finish translation', {
          raw: query,
          result: result.text,
          from: result.from.language.iso.replace('zh-CN', 'cn').replace('zh-TW', 'tw'),
          to,
        });
        return [{ raw: query, result: result.text, from: result.from.language.iso, to }];
      }),
      baiduTranslate(query, { to: to.replace('cn', 'zh').replace('tw', 'cht') }).then(result => {
        pluginContext.console.log('warn', 'finish translation', {
          raw: query,
          result: result.trans_result.dst,
          from: result.from,
          to,
        });
        return [
          {
            raw: query,
            result: result.trans_result.dst,
            from: result.from.replace('zh', 'cn').replace('cht', 'tw'),
            to,
          },
        ];
      }),
    ]),
    3000,
  ).catch(error => {
    pluginContext.console.log('error', 'failed translation', {
      error,
    });
    if (error instanceof TimeoutError) {
      return [{ to, raw: query, result: 'timeout after 3s' }];
    }
    return [{ to, raw: query, result: String(error) }];
  });
};
