const translate = require("../lib/dict/translate");
const mapTranslationItem = require("./utils/mapTranslationItem");


module.exports = (pluginContext) => { // eslint-disable-line

    /**
     * @async
     * @param  {String} query   - query inserted in bar i.e. dict key => query: "key"
     * @param  {Options} env    - lang option, which may be set through 'variables' in `.zazurc.json`
     * @return {Array} list of translation results
     */
    return (query, env = {}) => translate(query, env.lang || "en")
        .then((results) => results.map(mapTranslationItem));
};
