const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "addrs",
    aliases: [],
    run: async (client, message) => {
        if (!client.distube.getQueue(message)) {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setTitle('❌ There is nothing playing!')
                    .setDescription(`The Queue is empty`)
                ]
            });
            return;
        }

        client.distube.addRelatedSong(message).then((song) => {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setTitle("Added :thumbsup: " + song.name)
                    .setURL(song.url)
                    .setColor("BLUE")
                    .addField("Song Duration", `\`${song.formattedDuration}\``)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Requested by: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })]
            });
        }).catch(() => { });
    }
}