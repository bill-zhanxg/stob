const { Permissions } = require("discord.js")
const { resetPrefix } = require("../../handleMongoDB");
const { update } = require('../../prefix');

module.exports = {
    name: "resetprefix",
    aliases: ["rp"],
    run: async (client, message) => {
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply("You don't have permission to do this!");

        let value = await resetPrefix(message.guild.id);
        update();
        if (value != null) {
            message.reply(`Successfully reset the prefix for this server! Prefix: \`-\``);
        }
        else {
            message.reply(`There is an error while resetting the prefix, please try again!`);
        }
    }
}