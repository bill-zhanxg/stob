const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "announce",
    aliases: ["anno"],
    run: async (client, message, args) => {
        if (message.author.id != '768367429973704714') return message.reply('Only the owner of me can use this!');
        if (args[0] == null) return message.reply("You didn't enter any text to announce!");
        let annoText = args.join(' ');
        let embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Announcement from Stob')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Announced by ${message.author.tag}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(annoText);

        let allGuild = client.guilds.cache.filter(c => c.systemChannel != null);
        for (const guild of allGuild) {
            let sendChannel = guild[1].systemChannel;
            if (sendChannel) sendChannel.send({ embeds: [embed] }).catch(() => { });
        }

        message.channel.send({ embeds: [new MessageEmbed().setTitle('Announced!').setColor("GREEN")] });
    }
}