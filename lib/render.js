// Render data into template string
module.exports = function render(templateString, templateData) {
    return templateString.replace(/({{([^{]+)}})/g, (match, matchGroup1, matchGroup2) => {
        let value = templateData[matchGroup2];
        if (typeof value === "string") {
            value = value.replace(/"/g, "\"");
        }
        return value;
    });
}