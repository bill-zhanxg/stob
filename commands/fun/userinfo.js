const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "userinfo",
    aliases: [],
    run: async (client, message, args) => {
        if (args[0] == null) return message.reply("Usage: -userinfo <user>");

        if (message.mentions.members.first()) {
            userinfo(message.mentions.members.first());
        }
        else {
            try {
                let user = await message.guild.members.fetch(args[0])
                userinfo(user);
            }
            catch {
                message.channel.send('Please enter a valid member id!');
            }
        }

        function userinfo(member) {
            let embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`${member.user.tag}'s Info:`)
                .setDescription(`<@${member.user.id}>`)
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
                .addFields(
                    { name: `Name:`, value: `${member.user.username}` },
                    { name: `ID:`, value: `${member.user.id}` },
                    { name: `Account Joined at:`, value: `${member.joinedAt}\n**Timestamp:**\n${member.joinedTimestamp}` },
                    { name: `Account created at:`, value: `${member.user.createdAt}\n**Timestamp:**\n${member.user.createdTimestamp}` },
                    { name: `Has Roles:`, value: member.roles.cache.map(role => `<@&${role.id}>`).join(' ') },
                    { name: `Has Permissions:`, value: `\`\`\`${member.permissions.toArray().join('\n').toLowerCase().replaceAll('_', ' ')}\`\`\`` },
                    { name: `Nick Name:`, value: `${member.nickname == null ? 'No Nickname' : member.nickname}` },
                    { name: `Is Bot:`, value: `${member.user.bot ? 'Yes' : 'No'}` },
                )

            message.channel.send({ embeds: [embed] });
        }
    }
}