const synonyms = require("../lib/dict/synonyms");


module.exports = (pluginContext) => { // eslint-disable-line

    /**
     * @async
     * @param  {String} query   - query inserted in bar i.e. dict key => query: "key"
     * @return {Array} list of synonyms
     */
    return (query) => synonyms(query)
        .then((results) => results.map((synonym, index) => ({
            id: index,
            title: synonym,
            value: synonym
        })));
};
