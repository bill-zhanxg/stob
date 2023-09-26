const { MessageEmbed } = require("discord.js")
const { format } = require("../../functions");

module.exports = {
    name: "settime",
    aliases: [],
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

        if (!args[0]) return message.reply("Usage: -fw <Seconds>");
        if (isNaN(args[0])) return message.reply("Please enter a valid number!");
        let num = Math.round(parseInt(args[0]));
        if (num < 0) return message.reply("Please enter a number bigger than 0!");
        let queue = client.distube.getQueue(message);
        if (num >= queue.songs[0].duration) num = queue.songs[0].duration;

        client.distube.seek(message, num);
        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`🕙 Set the time to: ${format(num * 1000)}`)
                .setDescription("Please wait a few seconds to let the bot process")]
        }
        );
    }
}