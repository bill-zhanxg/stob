const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "resume",
    aliases: ["r"],
    run: async (client, message) => {
        try {
            await client.distube.resume(message)
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(`▶ Resumed the music for you!`)]
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
                        .setTitle('❌ The song is already playing!')
                        .setDescription(`Please pause the song first`)
                    ]
                })
            }
        }
    }
}