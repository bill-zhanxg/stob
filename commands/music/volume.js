const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "volume",
    aliases: ["v"],
    run: async (client, message, args) => {
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

        if (!args[0]) return message.reply("Usage: -v <0-300>");
        if (isNaN(args[0])) return message.reply("Please enter a valid number!");
        let num = parseInt(args[0]);
        if (num < 0 || num > 300) return message.reply("Usage: -v **<0-300>**");
        let vol = Math.round(num);

        client.distube.setVolume(message, vol);
        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`🔊 I set the volume to: \`${vol}%\``)]
        }
        );
    }
}