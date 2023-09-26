const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const { get } = require("../../prefix");

module.exports = {
  name: "help",
  aliases: ["h"],
  run: async (client, message) => {
    let prefix = get(message.guild.id);

    let help = new MessageEmbed()
      .setAuthor({ name: "Stob commands:", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setColor("BLUE")
      .addFields(
        { name: '**Send this message**', value: `\`${prefix}h\`` },
        { name: '**View the bot ping**', value: `\`${prefix}ping\`` },
        { name: '**View the host internet speed**', value: `\`${prefix}interspd\`` },
        { name: '**Give feedback**', value: `\`${prefix}feedback <feedback>\`` },
        { name: '**Send the invite for this bot/my server**', value: `\`${prefix}invite <bot/server>\`` },
        { name: '**How to identify Discord Nitro Phishing Links**', value: `\`${prefix}antiscam\`` },
      )

    let row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setURL('https://discord.com/api/oauth2/authorize?client_id=978893903346434069&permissions=3164160&scope=bot%20applications.commands')
          .setLabel('Music')
          .setStyle('LINK'),
      )
      .addComponents(
        new MessageButton()
          .setCustomId('mod')
          .setLabel('Mods commands')
          .setStyle('DANGER'),
      )
      .addComponents(
        new MessageButton()
          .setCustomId('fun')
          .setLabel('Fun commands')
          .setStyle('SUCCESS'),
      )
      .addComponents(
        new MessageButton()
          .setCustomId('slashcommands')
          .setLabel('Slash commands')
          .setStyle('PRIMARY'),
      );

    message.channel.send({ embeds: [help], components: [row] });
  }
}