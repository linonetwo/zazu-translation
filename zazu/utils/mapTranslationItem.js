module.exports = (translation, index) => {
    if (translation.to) {
        return {
            id: index,
            title: translation.to,
            value: translation.to,
            subtitle: `${translation.from}`
        };
    }

    return {
        id: index,
        title: translation
    };
};
