const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "autoplay",
    aliases: ["ap"],
    run: async (client, message, args) => {
        if (!args[0]) return message.reply("Usage: -ap <on/off>");
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

        let embed = new MessageEmbed()
            .setColor("BLUE")
        let arg = args[0].toLowerCase();
        if (arg == "on") {
            if (client.distube.toggleAutoplay(message) == false) {
                client.distube.toggleAutoplay(message);
                return message.reply("Autoplay is already on!");
            }
            embed.setTitle(`Turned on autoplay`);
        }
        else if (arg == "off") {
            if (client.distube.toggleAutoplay(message) == true) {
                client.distube.toggleAutoplay(message);
                return message.reply("Autoplay is already off!");
            }
            embed.setTitle(`Turned off autoplay`);
        }
        else {
            return message.reply("Usage: -ap <on/off>");
        }

        message.channel.send({ embeds: [embed] });
    }
}