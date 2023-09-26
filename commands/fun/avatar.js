const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "avatar",
    aliases: ["avt"],
    run: async (client, message, args) => {
        if (args[0] == null) return message.reply("Usage: -avt <user>");

        if (message.mentions.members.first()) {
            avatar(message.mentions.members.first());
        }
        else {
            try {
                let user = await message.guild.members.fetch(args[0])
                avatar(user);
            }
            catch {
                message.channel.send('Please enter a valid member id!');
            }
        }

        function avatar(member) {
            let embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle("Here is the download links(Just right click + save image)")
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) },)
                .addFields(
                    { name: "PNG", value: `[[Click here](${member.displayAvatarURL({ format: 'png' })})]`, inline: true },
                    { name: "JPG", value: `[[Click here](${member.displayAvatarURL({ format: 'jpg' })})]`, inline: true },
                    { name: "JPEG", value: `[[Click here](${member.displayAvatarURL({ format: 'jpeg' })})]`, inline: true },
                    { name: "WEBP", value: `[[Click here](${member.displayAvatarURL({ format: 'webp' })})]`, inline: true },
                    { name: "GIF(if available)", value: `[[Click here](${member.displayAvatarURL({ dynamic: true })})]`, inline: true },
                )

            message.channel.send({ embeds: [embed] });
        }
    }
}