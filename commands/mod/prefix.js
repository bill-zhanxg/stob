const { Permissions } = require("discord.js")
const { setPrefix } = require("../../handleMongoDB");
const { update } = require('../../prefix');

module.exports = {
    name: "prefix",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply("You don't have permission to do this!");
        let prefix = args[0];
        if (prefix == null) return message.reply("Usage: -prefix <prefix>");

        let value = await setPrefix(message.guild.id, prefix);

        update();

        if (value != null) {
            message.reply(`Successfully change the server prefix to \`${prefix}\``);
        }
        else {
            message.reply(`Something went wrong, please try again`);
        }
    }
}