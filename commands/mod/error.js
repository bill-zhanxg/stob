const { DiscordAPIError } = require("discord.js");

module.exports = {
  name: "error",
  aliases: [],
  run: async (client, message) => {
    if (message.author.id != "768367429973704714") return message.channel.send("Only the owner of this bot can use this command");

    message.reply("Causing error, stopping the bot...")
    throw new DiscordAPIError();
  }
}