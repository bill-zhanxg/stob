const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const functions = require("../functions")

module.exports = {
    name: "invite",
    aliases: ["in"],
    run: async (client, message, args) => {
        try {
            if (args[0] == null) {
                let row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('bot')
                            .setLabel('Bot invite link')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('server')
                            .setLabel('Server invite link')
                            .setStyle('SUCCESS'),
                    )

                message.channel.send({ content: "Chose which invite link you want", components: [row] });
            }
            else if (args[0].toLowerCase() == "bot") {
                message.reply(`Here is the bot invite link:\nhttps://discord.com/api/oauth2/authorize?client_id=882068020153966663&permissions=8&scope=bot%20applications.commands`);
            }
            else if (args[0].toLowerCase() == "server") {
                let embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`Here is my discord server invite link:`)
                    .setDescription(`https://discord.com/invite/5F3EueB`);
    
                message.reply({ embeds: [embed] });
            }
            else {
                message.channel.send("Usage: -invite `bot/server`")
            }
        } catch (e) {
            message.channel.send("Error creating invite link. Error: " + e);
        }
    }
}