const { MessageEmbed, Permissions } = require("discord.js")
const functions = require('../functions');

module.exports = {
    name: "viewtimeouts",
    aliases: [],
    run: async (client, message) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return message.reply("You don't have permission to do this!");

        let timeoutedMembers = await message.guild.members.fetch().then(member => member.filter(m => m.communicationDisabledUntilTimestamp != null));
        let text = ''
        for (const user of timeoutedMembers) {
            let time = functions.secondsToDhms((user[1].communicationDisabledUntilTimestamp - Date.now()) / 1000);
            if (time != '') {
                text += `<@${user[0]}>\n*${time}*\n`;
            }
        }

        if (text == '') text = 'No user have being timeouted in this server!';
        if (text.length > 1990) text = text.slice(0, 1980) + '\nAnd More...';

        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor('GREEN')
                .setTitle('Here is all the people have being timeouted')
                .setDescription(text)
                .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            ]
        })
    }
}