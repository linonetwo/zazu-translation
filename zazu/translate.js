const fs = require("fs");
const translate = require("../lib/dict/translate");

module.exports = (pluginContext) => {
    fs.writeFileSync("/Users/Gott/tmp/pluginContext.json", JSON.stringify(pluginContext, null, 4));

    /**
     * @async
     * @param  {String} query   - query inserted in bar i.e. dict key => query: "key"
     * @return {Array} list of translation results
     */
    return (query, env = {}) => translate(query, env.lang || "en")
        .then((results) => {
            fs.writeFileSync("/Users/Gott/tmp/env.json", JSON.stringify(env, null, 4));
            return results.map((translation, index) => ({
                id: index,
                title: translation.to,
                value: translation.to,
                subtitle: translation.from + " -> " + translation.to
            }));
        });
};
