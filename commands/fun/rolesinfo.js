const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "rolesinfo",
    aliases: [],
    run: async (client, message) => {
        let guild = message.guild;
        let allRoles = guild.roles.cache.map(role => `<@&${role.id}>`).join(' ')
        let AdminRoles = guild.roles.cache.map(role => role.permissions.toArray().indexOf('ADMINISTRATOR') != -1 ? `<@&${role.id}>` : '').join(' ')
        if (allRoles.length > 1010) allRoles = allRoles.slice(0, 1010) + 'And More...'
        if (AdminRoles.length > 1010) allRoles = AdminRoles.slice(0, 1010) + 'And More...'

        let embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`${guild.name}'s Roles:`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: `All Roles:`, value: allRoles },
                { name: `Roles with Administrator Permission:`, value: AdminRoles == undefined || AdminRoles.replace(/\s/g, '').length < 1 ? 'No Admin Role' : AdminRoles },
            )

        message.channel.send({ embeds: [embed] });
    }
}