const path = require("path");
const fs = require("fs");
const pointer = require("gson-pointer");
const gq = require("gson-query");

const TRANSLATION = "#/xml/0/sectionlist/0/section/*?sctName:subst/entry/*/side/{{SIDE}}/words/0/word";
const VALID_TYPES = ["verb", "adjadv", "subst"];

// leo returns result as a table with word-pairs like search:translation
const RIGHT_SIDE = 1;
const LEFT_SIDE = 0;

function getUniqueCount(list) {
    return unique(list).length;
}

function unique(list) {
    const uniqueList = [];
    list.forEach((item) => {
        if (uniqueList.indexOf(item) === -1) {
            uniqueList.push(item);
        }
    });
    return uniqueList;
}

function getTranslation(leoObj, side) {
    const translations = [];

    gq.run(leoObj, TRANSLATION.replace("{{SIDE}}", side), (value) => {
        if (Array.isArray(value)) {
            translations.push(...value);
        } else {
            translations.push(value);
        }
    });
    return translations;
}

function getSynonyms(leoObj, side) {
    let synonyms = pointer.get(leoObj, `#/xml/0/ffsynlist/0/side/${side}/word`);
    synonyms = Array.isArray(synonyms) ? synonyms : [synonyms];
    return synonyms.filter((item) => (typeof item === "string"));
}

function getSimilars(leoObj, side) {
    let similars = pointer.get(leoObj, `#/xml/0/similar/0/side/${side}/word`);
    similars = Array.isArray(similars) ? similars : [similars];
    return similars.filter((item) => (typeof item === "string"));
}

function runTranslations(leoObj, cb) {
    // theres a hc entry in each side which tells about search direction
    const needle = pointer.get(leoObj, "#/xml/0/search/0/normalized");
    const firstEntry = pointer.get(leoObj, "#/xml/0/sectionlist/0/section/0/entry/0/side/");
    const toLangIndex = parseInt(firstEntry[1].hc, 10) === 1 ? 0 : 1;
    const fromLangIndex = (1 + toLangIndex) % 2;

    const from = {
        index: fromLangIndex,
        lang: firstEntry[fromLangIndex].lang
    };

    const to = {
        index: toLangIndex,
        lang: firstEntry[toLangIndex].lang
    };

    process.env.DEBUG && console.log("FROM", from, "TO", to);

    gq.run(leoObj, "#/xml/0/sectionlist/0/section/*", (section) => {
        const meta = {
            id: section.sctName,
            title: section.sctTitle,
            needle,
            from,
            to
        };

        gq.run(section, "/entry/*/side", (sides) => {
            const fromWord = pointer.get(sides[from.index], "/words/0/word/0");
            const toWord = pointer.get(sides[to.index], "/words/0/word/0");
            const fromSearch = pointer.get(sides[from.index], "/search/0/word");
            // const toSearch = pointer.get(sides[to.index], "/search/0/word");

            cb(
                {
                    word: fromWord,
                    search: fromSearch
                },
                {
                    word: toWord
                },
                meta
            );
        });
    });
}

module.exports = function transformLeo(jsonResponse) {
    if (process.env.DEBUG) {
        const targetFile = path.join(__dirname, "..", "..", "response.json");
        fs.writeFileSync(targetFile, JSON.stringify(jsonResponse, null, 4), "utf8");
    }


    const needle = pointer.get(jsonResponse, "#/xml/0/search/0/normalized");
    const additional = [];
    const hits = [];
    let meta;
    runTranslations(jsonResponse, (from, to, type) => {
        meta = type;
        if (VALID_TYPES.indexOf(type.id) >= 0) {
            const result = { from: from.word, to: to.word, type };

            if (from.search.length === 1 && from.search[0] === needle) {
                hits.push(result);
            } else {
                additional.push(result);
            }
        }
    });

    const hitcount = pointer.get(jsonResponse, "#/xml/0/search/0/hitcount"); // search results (without alternatives)
    const similars = getSimilars(jsonResponse, meta.from.index);
    const synonyms = getSynonyms(jsonResponse, meta.from.index); // similar words for both sides

    if (process.env.DEBUG) {
        console.log("similar to", JSON.stringify(similars));
        console.log("synonym to", JSON.stringify(synonyms));
        console.log("hits", hitcount);
    }

    return { hits, additional, synonyms, similars };
};
