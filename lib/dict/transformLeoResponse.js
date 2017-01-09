const path = require("path");
const fs = require("fs");
const pointer = require("gson-pointer");
const gq = require("gson-query");
const render = require("../render");

const PRIMARY_TYPES = ["verb", "adjadv", "subst"];

const QUERY_SYNONYMS = "#/xml/ffsynlist/0/side/{{side}}/word";
const QUERY_SIMILARS = "#/xml/similar/0/side/{{side}}/word";


function getSynonyms(leoObj, side) {
    let synonyms = pointer.get(leoObj, render(QUERY_SYNONYMS, { side }));
    synonyms = Array.isArray(synonyms) ? synonyms : [synonyms];
    return synonyms.filter((item) => (typeof item === "string"));
}

function getSimilars(leoObj, side) {
    let similars = pointer.get(leoObj, render(QUERY_SIMILARS, side));
    similars = Array.isArray(similars) ? similars : [similars];
    return similars.filter((item) => (typeof item === "string"));
}

function getAsWord(obj, toWordPointer) {
    const word = pointer.get(obj, toWordPointer);
    if (Array.isArray(word)) {
        return getAsWord(word, "#/0");
    }
    if (word.word) {
        return getAsWord(word, "#/word");
    }
    if (word._) {
        return getAsWord(word, "#/_");
    }
    if (word.$t) {
        return getAsWord(word, "#/$t");
    }
    if (word.cc) {
        return getAsWord(word, "#/cc/0/cs");
    }
    return word;
}


function queryWords(leoObj, queryLocationPointer) {
    queryLocationPointer = pointer.join(queryLocationPointer, "**/*");
    const matches = [];
    gq.run(leoObj, queryLocationPointer, (value, key) => {
        if (typeof value === "string" && (key === "word" || isNaN(parseInt(key), 10) === false)) {
            matches.push(value);
        }
    });
    return matches;
}

function runTranslations(leoObj, cb) {
    // theres a hc entry in each side which tells about search direction
    const needle = pointer.get(leoObj, "#/xml/search/0/$/normalized");
    // const inputLang = pointer.get(leoObj, "#/xml/search/0/lang");
    const firstEntry = pointer.get(leoObj, "#/xml/sectionlist/0/section/0/entry/0/side/");
    if (firstEntry == null) {
        console.error("Unexpected input format in leo response");
        return;
    }
    const toLangIndex = parseInt(pointer.get(firstEntry, "#/1/$/hc"), 10) === 1 ? 0 : 1;
    const fromLangIndex = (1 + toLangIndex) % 2;

    const from = {
        index: fromLangIndex,
        lang: pointer.get(firstEntry, `/${fromLangIndex}/$/lang`)
    };

    const to = {
        index: toLangIndex,
        lang: pointer.get(firstEntry, `/${toLangIndex}/$/lang`)
    };

    process.env.DEBUG && console.log("FROM", from, "TO", to);

    gq.run(leoObj, "#/xml/sectionlist/0/section/*", (section) => {
        const meta = {
            id: pointer.get(section, "/$/sctName"),
            title: pointer.get(section, "/$/sctTitle"),
            needle,
            from,
            to
        };

        gq.run(section, "/entry/*/side", (sides) => {
            const searchFrom = pointer.get(sides[from.index], "/search/0/word/0");
            cb({
                type: "from",
                word: getAsWord(sides[from.index], "/words/0/word"),
                search: searchFrom
            }, {
                type: "to",
                word: getAsWord(sides[to.index], "/words/0/word")
            }, meta);
        });
    });
}

module.exports = function transformLeo(jsonResponse) {
    if (process.env.DEBUG) {
        const targetFile = path.join(__dirname, "..", "..", "response.json");
        fs.writeFileSync(targetFile, JSON.stringify(jsonResponse, null, 4), "utf8");
    }


    const needle = pointer.get(jsonResponse, "#/xml/search/0/$/normalized");
    const additional = [];
    const hits = [];
    let meta;
    runTranslations(jsonResponse, (from, to, type) => {
        const query = new RegExp(`^${needle}$`, "i");

        meta = type;
        if (PRIMARY_TYPES.indexOf(type.id) >= 0) {
            const result = { from: from.word, to: to.word, type };

            if (from.search.length === 1 && query.test(from.search[0])) {
                hits.push(result);
            } else {
                additional.push(result);
            }
        }
    });

    if (meta == null) {
        const similars = queryWords(jsonResponse, "#/xml/similar/0/side");
        return { hits: [], additional: [], synonyms: [], similars };
    }

    const hitcount = pointer.get(jsonResponse, "#/xml/search/0/$/hitcount"); // search results (without alternatives)
    const similars = getSimilars(jsonResponse, meta.from.index);
    const synonyms = getSynonyms(jsonResponse, meta.from.index); // similar words for both sides

    if (process.env.DEBUG) {
        console.log("similar to", JSON.stringify(similars));
        console.log("synonym to", JSON.stringify(synonyms));
        console.log("hits", hitcount);
    }

    return { hits, additional, synonyms, similars };
};
