const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "playpre",
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
            await client.distube.previous(message);
            message.channel.send("Playing previous song...🔍");
        }
        catch {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setTitle('❌ There is no previous song!')
                ]
            });
        }
    }
}