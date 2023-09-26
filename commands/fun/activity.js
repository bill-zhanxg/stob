const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js")
const functions = require("../functions")

module.exports = {
    name: "activity",
    aliases: [],
    run: async (client, message) => {
        return message.reply('Sorry but this command got disabled because not working, may reopen it soon!');
        let embed = new MessageEmbed()
            .setColor('GREEN')
            .setAuthor({ name: 'Activities', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTitle('Choose an Activity!')
            .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

        let row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('activity')
                    .setPlaceholder('Select an activity!')
                    .addOptions([
                        {
                            label: 'Watch Together',
                            description: 'Watch YouTube with your friends (Unlimited participants)',
                            emoji: '934930065534373998',
                            value: 'watch_together',
                        },
                        {
                            label: 'Fishington.io',
                            description: 'Unlimited participants',
                            emoji: '924449745794109461',
                            value: 'fishington',
                        },
                        {
                            label: 'Betrayal.io',
                            description: 'Unlimited participants',
                            emoji: '924449746104487966',
                            value: 'betrayal',
                        },
                        {
                            label: 'Sketch Heads',
                            description: 'Up to 16 participants',
                            emoji: '934930066318704760',
                            value: 'sketch_heads',
                        },
                        {
                            label: 'Word Snacks',
                            description: 'Up to 8 participants',
                            emoji: '934930066100588544',
                            value: 'wordsnacks',
                        },
                        {
                            label: 'Chess In The Park',
                            description: 'Unlimited participants (Require 1 Server Boost)',
                            emoji: '934930065932828793',
                            value: 'chess_in_the_park',
                        },
                        {
                            label: 'Letter League',
                            description: 'Up to 8 participants (Require 1 Server Boost)',
                            emoji: '934930065966366800',
                            value: 'letter_league',
                        },
                        {
                            label: 'Poker Night',
                            description: 'Up to 25 participants (Require 1 Server Boost)',
                            emoji: '934930065521795082',
                            value: 'poker_night',
                        },
                        {
                            label: 'SpellCast',
                            description: 'Up to 100 participants (Require 1 Server Boost)',
                            emoji: '934930066654244874',
                            value: 'spellcast',
                        },
                        {
                            label: 'Checkers In The Park',
                            description: 'Unlimited participants (Require 1 Server Boost)',
                            emoji: '934930065802805268',
                            value: 'checkers_in_the_park',
                        },
                        {
                            label: 'Ocho',
                            description: 'Up to 8 participants (Require 1 Server Boost)',
                            emoji: '935289576556216390',
                            value: 'ocho',
                        },
                    ]),
            );

        message.channel.send({ embeds: [embed], components: [row] });
    }
}