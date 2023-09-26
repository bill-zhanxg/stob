const { MessageEmbed } = require("discord.js")
let functions = require('../functions')

module.exports = {
    name: "serverinvite",
    aliases: [],
    run: async (client, message) => {
        functions.serverInvite(message);
    }
}