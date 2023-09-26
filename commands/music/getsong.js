const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { entersState, joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const axios = require("axios").default;
const prism = require('prism-media');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

let userIds = [];

module.exports = {
    name: "getsong",
    aliases: [],
    run: async (client, message) => {
        let embed = new MessageEmbed()
            .setColor('BLUE')
            .setImage('https://cdn.discordapp.com/attachments/920156268029673582/928922333597552640/unknown.png')
            .setTitle('Song Recogniser')
            .setDescription("Guide:\n**1.** Before you start recording, make sure you already turned off Noise suppression, otherwise, it will not detect anything.\n**2.** Turn your Input sensitivity to the lowest if you can. It's optional, you don't need to do it.\n**3.** Don't worry about other people talking, the bot will only listen to you.\n**4.** After you click \"Start listening\" you will only have 5 seconds to play the song you want it to detect, so make sure don't miss the timing")
            .setFooter({ text: 'Press `Start Listening` button to start' })

        let start = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('startRecording')
                    .setStyle('SUCCESS')
                    .setLabel('Start Listening')
            )

        let msg = await message.reply({ embeds: [embed], components: [start] });

        const filter = i => i.user.id == message.author.id && i.message.id == msg.id && i.customId == 'startRecording';
        const collector = message.channel.createMessageComponentCollector({ filter, time: 120000 })

        collector.on('collect', async interaction => {
            if (!interaction.member.voice.channel) return interaction.reply({ content: 'You need to be in a voice channel to let me start listening!', ephemeral: true })

            if (userIds.indexOf(message.author.id) != -1) return interaction.reply({ content: 'I am already listening to you!', ephemeral: true })

            let time = 5;

            function editMsg() {
                msg.edit({ embeds: [new MessageEmbed().setColor('GREEN').setTitle(`Listening...`).setDescription(`${time} seconds left`)] }).catch(() => { })
            }

            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                selfDeaf: false,
                selfMute: false,
                adapterCreator: message.channel.guild.voiceAdapterCreator,
            })

            await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
            const receiver = connection.receiver;
            userIds.push(message.author.id);
            const opusStream = receiver.subscribe(message.author.id);

            let convertedAudio = ffmpeg(opusStream.pipe(new prism.opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 })))
                .inputFormat('s32le')
                .audioFrequency(44100)
                .audioChannels(1)
                .audioCodec('pcm_s16le')
                .format('wav')
                .audioFilters('volume=6')
                .pipe()

            let bufs = []

            convertedAudio.on('data', (chunk) => {
                bufs.push(chunk)
            })

            interaction.deferReply().catch(() => { });
            interaction.deleteReply().catch(() => { });
            msg.edit({ components: [] }).catch(() => { })

            let interval = setInterval(async () => {
                if (time < 1) {
                    clearInterval(interval);
                    msg.edit({ embeds: [new MessageEmbed().setColor('BLUE').setTitle('Fetching data, please wait...')], components: [] })
                    opusStream.destroy();
                    userIds.splice(userIds.indexOf(message.author.id), 1);

                    const options = {
                        method: 'POST',
                        url: 'https://shazam.p.rapidapi.com/songs/detect',
                        headers: {
                            'content-type': 'text/plain',
                            'x-rapidapi-host': 'shazam.p.rapidapi.com',
                            'x-rapidapi-key': '636a8393damshed2bc0ca487c2c9p131cccjsnb25fa5add3b8'
                        },
                        data: Buffer.concat(bufs).toString('base64')
                    };

                    axios.request(options).then(function (response) {
                        let track = response.data.track;
                        if (track) {
                            let btn = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setStyle('LINK')
                                        .setLabel('Listen Here')
                                        .setEmoji('928931707380461578')
                                        .setURL(track.url)
                                )
                            msg.edit({
                                embeds: [new MessageEmbed().setColor('GREEN').setThumbnail(`${track.images.background}`).setTitle('I found a match!').addFields(
                                    { name: `Song Name:`, value: `${track.title}`, inline: true },
                                    { name: `Artists`, value: `${track.subtitle}`, inline: true },
                                    { name: `Song Type`, value: `${track.genres.primary}`, inline: true },
                                )], components: [btn]
                            })
                        }
                        else {
                            msg.edit({ embeds: [new MessageEmbed().setColor('RED').setTitle("I'm sorry but I didn't find any matches, maybe try another part of the song")] })
                        }
                    }).catch(function (error) {
                        console.error(error);
                        message.channel.send('There is an error while fetching data, I\'ll fix it as fast as I can')
                    });
                }
                else {
                    editMsg();
                }
                time--;
            }, 1000);
        })

        collector.on('end', collected => {
            if (collected.size < 1) msg.delete().catch(() => { });
        })

        /*
            Encoded base64 string of byte[] that generated from raw data less than 500KB (3-5 seconds sample are good enough for detection). The raw sound data must be 44100Hz, 1 channel (Mono), signed 16 bit PCM little endian. Other types of media are NOT supported, such as : mp3, wav, etc… or need to be converted to uncompressed raw data. If the result is empty, your request data must be in wrong format in most case.
            https://rapidapi.com/apidojo/api/shazam/
        */
    }
}