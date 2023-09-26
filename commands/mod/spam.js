const { Permissions } = require("discord.js")
const functions = require("../functions")

module.exports = {
    name: "spam",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply("You don't have permission to do this!");
        functions.spam(message, args);
    }
}