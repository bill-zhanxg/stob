const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "serveravatar",
    aliases: ["serveravt"],
    run: async (client, message) => {
        let guild = message.guild;

        let embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle("Here is the download links(Just right click + save image)")
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: "PNG", value: `[[Click here](${guild.iconURL({ format: 'png' })})]`, inline: true },
                { name: "JPG", value: `[[Click here](${guild.iconURL({ format: 'jpg' })})]`, inline: true },
                { name: "JPEG", value: `[[Click here](${guild.iconURL({ format: 'jpeg' })})]`, inline: true },
                { name: "WEBP", value: `[[Click here](${guild.iconURL({ format: 'webp' })})]`, inline: true },
                { name: "GIF(if available)", value: `[[Click here](${guild.iconURL({ dynamic: true })})]`, inline: true },
            )

        message.channel.send({ embeds: [embed] });
    }
}