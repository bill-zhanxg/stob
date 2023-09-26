const { MessageEmbed } = require("discord.js");
const { get } = require("../../disabledCommands");

module.exports = {
    name: "viewdisabledcommand",
    aliases: ["vdc"],
    run: async (client, message) => {
        let commands = await get(message.guild.id);

        if (commands.length < 1) {
            message.reply({embeds: [new MessageEmbed().setColor('GREEN').setTitle("This server don't have any commands got disabled!")]});
        }
        else {
            message.reply({embeds: [new MessageEmbed().setColor('GREEN').setTitle(`Here is all the commands that got disabled in this server: \`${commands.join('\`, \`')}\``)]});
        }
    }
}