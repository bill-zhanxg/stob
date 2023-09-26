const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "serverinfo",
    aliases: [],
    run: async (client, message) => {
        let { name, id, maximumMembers, memberCount } = message.guild;
        let rolesCount = message.guild.roles.cache.size;
        let channelsCount = message.guild.channels.cache.size;
        let { user } = await message.guild.fetchOwner();

        let embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`${name}'s Info:`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: `Owner:`, value: `${user.tag}` },
                { name: `Owner ID:`, value: `${user.id}` },
                { name: `Server Name:`, value: `${name}` },
                { name: `Server ID:`, value: `${id}` },
                { name: `Maximum Members:`, value: `${maximumMembers}` },
                { name: `Members Count:`, value: `${memberCount}` },
                { name: `Roles Count:`, value: `${rolesCount}` },
                { name: `Channels Count:`, value: `${channelsCount}` },
            )

        message.channel.send({ embeds: [embed] });
    }
}