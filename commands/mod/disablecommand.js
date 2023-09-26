const { MessageEmbed } = require("discord.js");
const { disableCommand } = require("../../handleMongoDB");
const { get, update } = require("../../disabledCommands");
const { notDisableCommands } = require("../../config.json");

module.exports = {
  name: "disablecommand",
  aliases: ["dc"],
  run: async (client, message, args) => {
    if (message.author.id != message.guild.ownerId) return message.reply("Only the server owner can use this command!");
    if (args[0] == null) return message.reply("Please enter what command you want to disable!");

    let disabledCommands = get(message.guild.id);
    let allCommands = client.commands.map(x => x.name);
    allCommands = allCommands.filter((el) => !notDisableCommands.includes(el)).filter((el) => !disabledCommands.includes(el));

    if (allCommands.indexOf(args[0]) == -1) {
      message.reply({ embeds: [new MessageEmbed().setColor('RED').setTitle(disabledCommands.indexOf(args[0]) == -1 ? "Command not found" : "Command already disabled").setDescription(`Here is all the command that you can disable: \`${allCommands.join('\`, \`')}\``)] });
    }
    else {
      await disableCommand(message.guild.id, args[0]);

      update();

      message.reply({ embeds: [new MessageEmbed().setColor('GREEN').setTitle(`Successfully disabled command: \`${args[0]}\` for this server!`)] });
    }
  }
}