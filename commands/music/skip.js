const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "skip",
    aliases: ["sk"],
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

        client.distube.skip(message).then(() => {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(`⏭️ Skipped!`)]
            });
        }).catch(() => message.reply({ embeds: [new MessageEmbed().setTitle('There is no up next song').setColor("RED")] }));
    }
}