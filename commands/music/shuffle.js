const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "shuffle",
    aliases: ["sh"],
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

        client.distube.shuffle(message);
        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`🔀 Shuffled the Queue!`)]
        });
    }
}