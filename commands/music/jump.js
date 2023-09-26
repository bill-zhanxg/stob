const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js")

module.exports = {
    name: "jump",
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

        try {
            await client.distube.resume(message);
        }
        catch { }

        let row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('jump')
                    .setPlaceholder('Select a song to jump to')
                    .addOptions([]),
            );
            
        let songs = client.distube.getQueue(message).songs.slice(0, 21);
        songs.map((song, index) => {
            if (index != 0) {
                let name = song.name
                row.components[0].options.push({
                    label: name,
                    value: index.toString(),
                    description: null,
                    emoji: null,
                    default: false
                });
            }
        })

        if (row.components[0].options.length < 1) {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setTitle('❌ There is only one song in queue!')
                    .setDescription(`Please add more songs to queue`)
                ]
            });
            return;
        }

        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`Please choose which song you want to jump to!`)],
            components: [row],
        });
    }
}