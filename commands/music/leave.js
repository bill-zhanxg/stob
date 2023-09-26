const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "leave",
    aliases: ["stop"],
    run: async (client, message) => {
        try {
            client.distube.stop(message).then(() => {
                message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor("BLUE")
                        .setTitle(`🚪 Left!`)]
                });
            })
        }
        catch {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setTitle('❌ There is nothing playing!')
                    .setDescription(`The Queue is empty`)
                ]
            })
        }
    }
}