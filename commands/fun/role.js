const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "role",
    aliases: [],
    run: async (client, message, args) => {
        if (args[0] == null) return message.reply("Usage: -role <role>");
        let roleT = args.join(' ');
        let allRoles = message.guild.roles.cache.filter(role => role.name == roleT)
        let roleSize = allRoles.size;
        let selectedRole = allRoles.first();

        if (roleSize < 1) {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setTitle("❌ Can't find the role!")
                    .setDescription(`Please make sure you enter the role name correctly`)
                ]
            })
        }
        else {
            let hasPerms = selectedRole.permissions.toArray().join('\n').toLowerCase().replaceAll('_', ' ');
            let embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`${selectedRole.name}'s Info:`)
                .setDescription(`<@&${selectedRole.id}>`)
                .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
                .addFields(
                    { name: `Name:`, value: `${selectedRole.name}` },
                    { name: `ID:`, value: `${selectedRole.id}` },
                    { name: `Mentionable:`, value: `${selectedRole.mentionable ? 'Yes' : 'No'}` },
                    { name: `Raw Position:`, value: `${selectedRole.rawPosition}` },
                    { name: `Has Permissions:`, value: `\`\`\`${hasPerms}\`\`\`` },
                    { name: `Number of roles with the name *${roleT}*:`, value: `${roleSize}` },
                )

            message.channel.send({ embeds: [embed] });
        }
    }
}