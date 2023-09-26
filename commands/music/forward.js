const { MessageEmbed } = require("discord.js")
const { format } = require("../../functions");

module.exports = {
    name: "forward",
    aliases: ["fw"],
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
        if (num < 1) return message.reply("Please enter a number bigger than 0!");
        let queue = client.distube.getQueue(message);
        let time = queue.currentTime + num;
        if (time >= queue.songs[0].duration) time = queue.songs[0].duration;

        let fwtime = Math.round(time - queue.currentTime).toString();
        client.distube.seek(message, time);
        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`⏩ Forwarded for: \`${fwtime} seconds\` to: ${format(time * 1000)}`)
                .setDescription("Please wait a few seconds to let the bot process")]
        }
        );
    }
}