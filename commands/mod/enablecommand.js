const { MessageEmbed } = require("discord.js");
const { enableCommand } = require("../../handleMongoDB");
const { get, update } = require("../../disabledCommands");

module.exports = {
  name: "enablecommand",
  aliases: ["ec"],
  run: async (client, message, args) => {
    if (message.author.id != message.guild.ownerId) return message.reply("Only the server owner can use this command!");
    if (args[0] == null) return message.reply("Please enter what command you want to enable!");

    let allCommands = get(message.guild.id);
    if (allCommands.length < 1) {
      message.reply({ embeds: [new MessageEmbed().setColor('GREEN').setTitle("You can't enable command when no command has got disabled yet?")] });
    }
    else if (allCommands.indexOf(args[0]) == -1) {
      message.reply({ embeds: [new MessageEmbed().setColor('RED').setTitle("Command not found").setDescription(`Here is all the command that you can enable: \`${allCommands.join('\`, \`')}\``)] });
    }
    else {
      await enableCommand(message.guild.id, args[0]);

      update();

      message.reply({ embeds: [new MessageEmbed().setColor('GREEN').setTitle(`Successfully enabled command: \`${args[0]}\` for this server!`)] });
    }
  }
}