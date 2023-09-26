const { DiscordAPIError, MessageEmbed } = require("discord.js");

module.exports = {
  name: "distubestatus",
  aliases: ["ds", "isplaying"],
  run: async (client, message) => {
    if (message.author.id != "768367429973704714") return message.channel.send("Only the owner of this bot can use this command");
    let size = client.distube.queues.collection.size;

    message.reply({ embeds: [new MessageEmbed().setColor(size == 0 ? 'GREEN' : 'RED').setTitle(size == 0 ? 'Safe to shutdown' : 'There is still guilds using me').setDescription(`There are ${size} guilds are playing songs`)] }).catch(() => { });
  }
}