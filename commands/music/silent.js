const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "silent",
    aliases: [],
    run: async (client, message, args) => {
        if (args[0] == null) return message.reply("Usage: -silent <on/off>");
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

        let guildId = message.guild.id;
        let mode = args[0].toLowerCase();
        let isOn = client.silent.indexOf(guildId) == -1 ? false : true;
        if (mode == 'on') {
            if (isOn) return message.reply({ embeds: [new MessageEmbed().setTitle('Silent mode is already on!').setColor("RED")] });
            client.silent.push(guildId);
            message.channel.send({ embeds: [new MessageEmbed().setTitle('Turned on silent mode!').setColor("GREEN")] });
        }
        else if (mode == 'off') {
            if (!isOn) return message.reply({ embeds: [new MessageEmbed().setTitle('Silent mode is already off!').setColor("RED")] });
            client.silent.splice(client.silent.indexOf(guildId), 1);
            message.channel.send({ embeds: [new MessageEmbed().setTitle('Turned off silent mode!').setColor("GREEN")] });
        }
        else {
            return message.reply("Usage: -silent <on/off>");
        }
    }
}