const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js")

module.exports = {
    name: "filter",
    aliases: [],
    run: async (client, message, args) => {
        if (args[0] == null) {
            let embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Please select a filter")

            let row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('singleFilter')
                        .setPlaceholder('Select the filter you want to apply')
                        .addOptions([
                            {
                                label: 'Clear',
                                description: 'Remove all filters',
                                value: 'clear',
                            },
                            {
                                label: 'Weird',
                                description: 'The filter that trolls your friends',
                                value: 'funny',
                            },
                            {
                                label: 'Reverse',
                                description: 'The coolest filter BUT MAY TAKE MINUTES TO LOAD',
                                value: 'reverse',
                            },
                            {
                                label: '3d',
                                value: '3d',
                            },
                            {
                                label: 'Bass Boost',
                                value: 'bassboost',
                            },
                            {
                                label: 'Surround',
                                value: 'surround',
                            },
                            {
                                label: 'Nightcore',
                                value: 'nightcore',
                            },
                            {
                                label: 'Echo',
                                value: 'echo',
                            },
                            {
                                label: 'Karaoke',
                                value: 'karaoke',
                            },
                            {
                                label: 'Vaporwave',
                                value: 'vaporwave',
                            },
                            {
                                label: 'Flanger',
                                value: 'flanger',
                            },
                            {
                                label: 'Gate',
                                value: 'gate',
                            },
                            {
                                label: 'Haas',
                                value: 'haas',
                            },
                            {
                                label: 'Mcompand',
                                value: 'mcompand',
                            },
                            {
                                label: 'Phaser',
                                value: 'phaser',
                            },
                            {
                                label: 'Tremolo',
                                value: 'tremolo',
                            },
                            {
                                label: 'Earwax',
                                value: 'earwax',
                            },
                        ]),
                );

            message.channel.send({ embeds: [embed], components: [row] });
        }
        else if (args[0].toLowerCase() == 'multi') {
            let embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Please select at least two filters")

            let row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('multiFilter')
                        .setMinValues(2)
                        .setMaxValues(5)
                        .setPlaceholder('Select the filters you want to apply')
                        .addOptions([
                            {
                                label: 'Weird',
                                description: 'The filter that trolls your friends',
                                value: 'funny',
                            },
                            {
                                label: '3d',
                                value: '3d',
                            },
                            {
                                label: 'Bass Boost',
                                value: 'bassboost',
                            },
                            {
                                label: 'Surround',
                                value: 'surround',
                            },
                            {
                                label: 'Nightcore',
                                value: 'nightcore',
                            },
                            {
                                label: 'Echo',
                                value: 'echo',
                            },
                            {
                                label: 'Karaoke',
                                value: 'karaoke',
                            },
                            {
                                label: 'Vaporwave',
                                value: 'vaporwave',
                            },
                            {
                                label: 'Flanger',
                                value: 'flanger',
                            },
                            {
                                label: 'Gate',
                                value: 'gate',
                            },
                            {
                                label: 'Haas',
                                value: 'haas',
                            },
                            {
                                label: 'Mcompand',
                                value: 'mcompand',
                            },
                            {
                                label: 'Phaser',
                                value: 'phaser',
                            },
                            {
                                label: 'Tremolo',
                                value: 'tremolo',
                            },
                            {
                                label: 'Earwax',
                                value: 'earwax',
                            },
                        ]),
                );

            message.channel.send({ embeds: [embed], components: [row] });
        }
        else {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setTitle('Here is how to use -filter:')
                    .setDescription("**To apply only one filter use:**\n`-filter`\n**To apply nultiple filter use:**\n`-filter multi`")
                ]
            });
        }
    }
}