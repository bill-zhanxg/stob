const { MessageEmbed } = require("discord.js");
const translate = require('@vitalets/google-translate-api');

module.exports = {
    name: "translate",
    aliases: [],
    run: async (client, message, args) => {
        if (args[0] == null) return message.reply('There is nothing to translate')
        let text = args.join(" ");

        translate(text, { to: 'en' }).then(res => {
            let embed = new MessageEmbed()
                .setTitle('Here is the texts after translate')
                .setColor('GREEN')
                .setDescription(`\`\`\`${res.text}\`\`\``)
            message.channel.send({ embeds: [embed] });
        }).catch(err => {
            message.reply('There is an error sry');
            console.error(err);
        });
    }
}