const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "loop",
    aliases: [],
    run: async (client, message, args) => {
        if (!args[0]) return message.reply("Usage: -loop <off/track/queue>");
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

        let arg = args[0].toLowerCase();
        if (arg == "off") {
            client.distube.setRepeatMode(message, 0);
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(`➿ Set repeat mode to: \`Off\``)]
            });
        }
        else if (arg == "track") {
            client.distube.setRepeatMode(message, 1);
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(`➿ Set repeat mode to: \`Song\``)]
            });
        }
        else if (arg == "queue") {
            client.distube.setRepeatMode(message, 2);
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(`➿ Set repeat mode to: \`Queue\``)]
            });
        }
        else {
            message.reply("Usage: -loop <off/track/queue>");
        }
    }
}