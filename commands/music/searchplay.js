const { MessageEmbed, Permissions, MessageActionRow, MessageSelectMenu } = require("discord.js")

module.exports = {
    name: "searchplay",
    aliases: [],
    run: async (client, message, args) => {
        //check member channel, the bot perms
        let vchannel = message.member.voice.channel;
        if (!vchannel) return message.channel.send({ embeds: [new MessageEmbed().setTitle("You need to be in a voice channel to play music!").setColor("RED")] });
        if (!vchannel.permissionsFor(message.guild.me).has(Permissions.FLAGS.CONNECT)) return message.channel.send({ embeds: [new MessageEmbed().setTitle("I cannot connect to your voice channel, make sure I have the proper permissions!").setColor("RED")] });
        if (args[0] == null) return message.reply({ embeds: [new MessageEmbed().setTitle('Usage: -searchplay <song>').setColor("RED")] });
        let song = args.join(" ");

        let row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('searchplay')
                    .setPlaceholder('Select the song you want to play')
                    .addOptions([]),
            );

        client.distube.search(song).then(async (result) => {
            for (const song of result) {
                row.components[0].options.push({
                    label: song.name,
                    value: song.url,
                    description: null,
                    emoji: null,
                    default: false
                });
            }

            let msg = await message.reply({
                embeds: [new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(`Please select the song you want to play!`)],
                components: [row],
            });

            let filter = i => i.message.id == msg.id && i.user.id == message.member.id;
            const collector = message.channel.createMessageComponentCollector({ time: 120000, filter, max: 1 });

            collector.on('collect', i => {
                if (i.customId == 'searchplay') {
                    let url = i.values[0];
                    try {
                        if (!message.member.voice.channel) return message.channel.send({ embeds: [new MessageEmbed().setTitle("Why did you leave the voice channel and want me to be in it?!").setColor("RED")] });
                        client.distube.play(message.member.voice.channel, url, { member: message.member, textChannel: message.channel, message: message })
                    }
                    catch {
                        msg.reply('There is an error while I try to play the song!')
                    }
                }
            });

            collector.on('end', collected => {
                msg.delete().catch(() => { });
            });
        }).catch(() => message.reply({ embeds: [new MessageEmbed().setTitle('No result found').setColor("RED")] }))
    }
}