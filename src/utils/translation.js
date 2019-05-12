const googleTranslate = require('@vitalets/google-translate-api');
const baiduTranslate = require('baidu-translate-api');
const { timeout, TimeoutError } = require('promise-timeout');

const TIME_OUT = 3000;
module.exports = function translation(query, to = 'en', pluginContext) {
  pluginContext.console.log('warn', 'start translation', {
    query,
    to,
  });

  const googlePromise = timeout(
    googleTranslate(query, { to: to.replace('cn', 'zh-CN').replace('tw', 'zh-TW') }).then(result => {
      pluginContext.console.log('warn', 'finish translation', {
        raw: query,
        result: result.text,
        from: result.from.language.iso.replace('zh-CN', 'cn').replace('zh-TW', 'tw'),
        to,
      });
      return { service: 'google', raw: query, result: result.text, from: result.from.language.iso, to };
    }),
    TIME_OUT,
  ).catch(error => {
    pluginContext.console.log('error', 'failed google translation', {
      error,
    });
    if (error instanceof TimeoutError) {
      return { service: 'google', failed: true, to, raw: query, result: 'timeout after 3s' };
    }
    return { service: 'google', failed: true, to, raw: query, result: `error: ${String(error)}` };
  });

  const baiduPromise = timeout(
    baiduTranslate(query.toLowerCase(), { to: to.replace('cn', 'zh').replace('tw', 'cht') }).then(result => {
      pluginContext.console.log('warn', 'finish translation', {
        raw: query,
        result: result.trans_result.dst,
        from: result.from,
        to,
      });
      return {
        service: 'baidu',
        raw: query,
        result: result.trans_result.dst,
        from: result.from.replace('zh', 'cn').replace('cht', 'tw'),
        to,
      };
    }),
    TIME_OUT,
  ).catch(error => {
    pluginContext.console.log('error', 'failed baidu translation', {
      error,
    });
    if (error instanceof TimeoutError) {
      return { service: 'baidu', failed: true, to, raw: query, result: 'timeout after 3s' };
    }
    return { service: 'baidu', failed: true, to, raw: query, result: `error code: ${error.error}` };
  });

  return Promise.all([googlePromise, baiduPromise]).then(resultList => {
    const notFailedResult = resultList.filter(({ failed }) => !failed);
    if (notFailedResult.length > 0) {
      return notFailedResult;
    }
    return resultList;
  });
};
