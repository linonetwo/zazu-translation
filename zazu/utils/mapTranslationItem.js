const pointer = require("gson-pointer");

const FLAG_ICONS = {
    ch: "🇨🇳 ",
    de: "🇩🇪 ",
    en: "🇬🇧 ",
    es: "🇪🇸 ",
    fr: "🇫🇷 ",
    it: "🇮🇹 ",
    pl: "🇵🇱 ",
    pt: "🇵🇹 ",
    ru: "🇷🇺 ",
    "": ""
};

module.exports = (translation, index) => {
    const fromLang = pointer.get(translation, "#/type/from/lang") || "";
    const toLang = pointer.get(translation, "#/type/to/lang") || "";
    if (translation.to) {
        return {
            id: index,
            title: `${translation.to}`,
            value: translation.to,
            subtitle: `${FLAG_ICONS[fromLang]}${translation.from}`,
            icon: `./zazu/assets/${toLang || "x"}.svg`
        };
    }

    return {
        id: index,
        title: translation
    };
};
