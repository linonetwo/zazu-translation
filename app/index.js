#! /usr/bin/env node
const program = require("commander");
const translate = require("../lib/dict/translate");
const synonyms = require("../lib/dict/synonyms");

program
    .command("t <word>")
    .description("get word translations")
    .option("-l, --lang <targetLanguage>", "targetLanguage for translation")
    .action((search, options) => translate(search, options.lang || "en", 50)
        .then((results) => {
            if (results.length === 0) {
                console.log("no results found for \033\[0;34m'search'\033\[0m. It may be of wrong language"); // eslint-disable-line
            } else {
                results.forEach((trans, index) => {
                    if (trans.from) {
                        process.stdout.write(`${trans.from} -> ${trans.to}\n`);
                    } else {
                        process.stdout.write(`${trans}\n`);
                    }
                });
            }
        })
    );

program
    .command("s <word>")
    .description("get synonyms to word")
    .option("-l, --lang <targetLanguage>", "targetLanguage for translation")
    .action((search, options) => synonyms(search, options.lang || "en", 50)
        .then((results) => {
            if (results.length === 0) {
                console.log("no results found for \033\[0;34m'search'\033\[0m. It may be of wrong language"); // eslint-disable-line
            } else {
                results.forEach((trans, index) => process.stdout.write(`${trans}\n`));
            }
        })
    );


if (process.argv.slice(2).length === 0) {
    program.outputHelp();
} else {
    program.parse(process.argv);
}
