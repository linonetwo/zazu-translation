const fetch = require('node-fetch');

module.exports = pluginContext => {
  return (value, env = {}) => {
    if (!env.anki) return Promise.resolve();

    const { raw, result } = JSON.parse(value);
    const getFields = () => ({
      [env.fields.raw]: raw,
      [env.fields.result]: result,
    });
    const params = {
      note: {
        deckName: env.deckName || 'Default',
        modelName: env.modelName || 'Basic',
        fields: env.fields
          ? getFields()
          : {
              Front: raw,
              Back: result,
            },
        options: {
          allowDuplicate: false,
        },
        tags: env.tags || [],
        // audio: {
        //   url: 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=猫&kana=ねこ',
        //   filename: 'yomichan_ねこ_猫.mp3',
        //   skipHash: '7e2c2f954ef6051373ba916f000168dc',
        //   fields: ['Front'],
        // },
      },
    };
    pluginContext.console.log('warn', 'adding to anki', params);
    return fetch(`http://localhost:${env.ankiPort || 8765}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'addNote', version: 6, params }),
    }).catch(error => {
      pluginContext.console.log('error', 'failed adding to anki', { error, errorString: String(error) });
    });
  };
};
