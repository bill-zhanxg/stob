const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "pause",
    aliases: ["pa"],
    run: async (client, message) => {
        try {
            await client.distube.pause(message)
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(`⏸ Paused the music for you!`)]
            });
        }
        catch {
            if (!client.distube.getQueue(message)) {
                message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor("RED")
                        .setTitle('❌ There is nothing playing!')
                        .setDescription(`The Queue is empty`)
                    ]
                })
            }
            else {
                message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor("RED")
                        .setTitle('❌ The song is already paused!')
                        .setDescription(`Please resume the song first`)
                    ]
                })
            }
        }
    }
}