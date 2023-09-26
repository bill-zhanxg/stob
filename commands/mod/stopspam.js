const functions = require("../functions")

module.exports = {
    name: "stopspam",
    aliases: [],
    run: async (client, message) => {
        functions.sspam(message);
    }
}