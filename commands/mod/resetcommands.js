const { MessageEmbed } = require("discord.js");
const { resetCommand } = require("../../handleMongoDB");
const { update } = require("../../disabledCommands");

module.exports = {
  name: "resetcommand",
  aliases: ["rc"],
  run: async (client, message) => {
    if (message.author.id != message.guild.ownerId) return message.reply("Only the server owner can use this command!");
    await resetCommand(message.guild.id);
    update();
    message.reply({ embeds: [new MessageEmbed().setColor('GREEN').setTitle("Successfully reseted the commands (Allowed all commands)")] });
  }
}