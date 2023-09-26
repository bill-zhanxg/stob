const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const { createBar } = require("../../functions");
const lyricsParse = require('../../lyrics');

let channelIds = [];

module.exports = {
    name: "song",
    aliases: [],
    run: async (client, message) => {
        if (client.silent.indexOf(message.guild.id) == -1) client.silent.push(message.guild.id);
        let c = channelIds.filter(check => check.id == message.channel.id)
        if (c.length != 0) for (const del of c) del.msg.delete().catch(() => { })
        update(client, message)
    },
    loopClicked: (client, message) => {
        let queue = client.distube.getQueue(message);
        if (!queue) {
            return 'There is nothing playing!';
        }
        let loopType = queue.repeatMode;
        try {
            loopType == 0 ? client.distube.setRepeatMode(message, 2) : loopType == 1 ? client.distube.setRepeatMode(message, 0) : client.distube.setRepeatMode(message, 1);
            return null
        }
        catch {
            return 'An error occurred';
        }
    },
    preClicked: (client, message) => {
        if (!client.distube.getQueue(message)) {
            return 'There is nothing playing!';
        }
        return client.distube.previous(message).then(() => {
            return null;
        }).catch(() => {
            return 'There is no previous song!';
        });
    },
    pauseClicked: (client, message) => {
        let queue = client.distube.getQueue(message);
        if (!queue) {
            return 'There is nothing playing!';
        }
        let isPaused = queue.paused;
        try {
            isPaused == true ? client.distube.resume(message) : client.distube.pause(message);
            return null
        }
        catch {
            return 'An error occurred';
        }
    },
    nextClicked: (client, message) => {
        if (!client.distube.getQueue(message)) {
            return 'There is nothing playing!';
        }
        return client.distube.skip(message).then(() => {
            return null;
        }).catch(() => { return 'There is no up next song' });
    },
    shffleClicked: (client, message) => {
        if (!client.distube.getQueue(message)) {
            return 'There is nothing playing!';
        }
        try {
            client.distube.shuffle(message)
            return null
        }
        catch {
            return 'An error occurred';
        }
    },
    silentClicked: (client, message) => {
        let isSilent = client.silent.indexOf(message.guild.id) == -1 ? false : true;
        isSilent ? client.silent.splice(client.silent.indexOf(message.guild.id), 1) : client.silent.push(message.guild.id);
    },
    leaveClicked: (client, message) => {
        if (!client.distube.getQueue(message)) {
            return 'There is nothing playing!';
        }
        client.distube.stop(message)
        return null;
    },
    queueClicked: async (client, message, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        let queue = client.distube.getQueue(message);
        if (!queue) {
            return interaction.editReply({ embeds: [new MessageEmbed().setTitle(`❌ There is nothing playing!`).setColor("RED")], ephemeral: true });
        }

        let embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`Queue for: ${message.guild.name}`)

        let counter = 0;
        for (i = 0; i < queue.songs.length; i += 20) {
            let k = queue.songs;
            let songs = k.slice(i, i + 20);
            counter == 0 ? interaction.followUp({ embeds: [embed.setDescription(songs.map((song, index) => `**${index + 1 + counter * 20}.** [${song.name}](${song.url}) - ${song.formattedDuration}`).join("\n"))], ephemeral: true }) : interaction.followUp({ embeds: [embed.setDescription(songs.map((song, index) => `**${index + 1 + counter * 20}.** [${song.name}](${song.url}) - ${song.formattedDuration}`).join("\n"))], ephemeral: true })
            counter++;
        }
    },
    volumeClicked: (client, message) => {
        queue = client.distube.getQueue(message);
        if (!queue) {
            return 'There is nothing playing!';
        }
        queue.volume < 10 ? client.distube.setVolume(message, 10) : queue.volume < 50 ? client.distube.setVolume(message, 50) : queue.volume < 100 ? client.distube.setVolume(message, 100) : client.distube.setVolume(message, 10)
        return null;
    },
    lyricClicked: async (client, message, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        let queue = client.distube.getQueue(message);
        if (!queue) {
            return interaction.editReply({ embeds: [new MessageEmbed().setTitle(`❌ There is nothing playing!`).setColor("RED")], ephemeral: true });
        }
        let song = queue.songs[0];

        const lyrics = await lyricsParse(song.name);
        if (lyrics) {
            let embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`🎶 Here is the lyric for ${song.name}`)
                .setDescription(`\`\`\`${lyrics.slice(0, 1990)}\`\`\``)

            interaction.editReply({ embeds: [embed], ephemeral: true })
        }
        else {
            interaction.editReply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setTitle('❌ No Lyrics Found for this song!')]
            })
        }
    },
}

let emojis = { loop1: '🔁', loop2: '🔂', back: '⏮️', pause: '⏸', play: '▶️', next: '⏭️', shuffle: '🔀', bell: '🔔', noBell: '🔕', leave: '🚪', queue: '🎶', lyric: '📄', lowVolume: '🔈', mediumVolume: '🔉', highVolume: '🔊' }
async function update(client, message) {
    let queue = client.distube.getQueue(message);
    if (!queue) return message.reply({ embeds: [new MessageEmbed().setTitle('There is nothing playing').setColor("RED")] });
    let song = queue.songs[0];
    let loopType = queue.repeatMode
    let isPaused = queue.paused;
    let isSilent = client.silent.indexOf(message.guild.id) == -1 ? false : true;
    const status = `Volume: \`${queue.volume}%\` | Filters: \`${queue.filters.join(', ') || "Clear"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

    let embed = new MessageEmbed()
        .setColor("BLUE")
        .setTitle(`Now Playing: ${song.name}`)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .setDescription(createBar(song.duration * 1000, queue.currentTime * 1000))
        .addField("Status: ", status)

    let row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('loop')
                .setEmoji(loopType == 1 ? emojis.loop2 : emojis.loop1)
                .setStyle(loopType == 0 ? 'DANGER' : 'SUCCESS'),
        )
        .addComponents(
            new MessageButton()
                .setCustomId('presong')
                .setEmoji(emojis.back)
                .setStyle('SECONDARY'),
        )
        .addComponents(
            new MessageButton()
                .setCustomId('pause')
                .setEmoji(isPaused == true ? emojis.play : emojis.pause)
                .setStyle('SUCCESS'),
        )
        .addComponents(
            new MessageButton()
                .setCustomId('nextsong')
                .setEmoji(emojis.next)
                .setStyle('SECONDARY'),
        )
        .addComponents(
            new MessageButton()
                .setCustomId('shuffle')
                .setEmoji(emojis.shuffle)
                .setStyle('SECONDARY'),
        );
    let row2 = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('volume')
                .setStyle('SUCCESS')
                .setEmoji(queue.volume <= 10 ? emojis.lowVolume : queue.volume <= 50 ? emojis.mediumVolume : emojis.highVolume)
        )
        .addComponents(
            new MessageButton()
                .setCustomId('lyric')
                .setStyle('SECONDARY')
                .setEmoji(emojis.lyric)
        )
        .addComponents(
            new MessageButton()
                .setCustomId('queue')
                .setStyle('SECONDARY')
                .setEmoji(emojis.queue)
        )
        .addComponents(
            new MessageButton()
                .setCustomId('leave')
                .setStyle('SECONDARY')
                .setEmoji(emojis.leave)
        )
        .addComponents(
            new MessageButton()
                .setCustomId('silent')
                .setEmoji(isSilent == true ? emojis.noBell : emojis.bell)
                .setStyle('SUCCESS'),
        )
    let jumpRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('jumpNoD')
                .setPlaceholder('Jump to a song')
                .addOptions([]),
        );
    let filterRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('filter')
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

    let songs = queue.songs.slice(0, 11);
    songs.map((song, index) => {
        let name = song.name
        jumpRow.components[0].options.push({
            label: name,
            value: index.toString(),
            description: null,
            emoji: null,
            default: false
        });
    })

    let msg = await message.channel.send({ embeds: [embed], components: [row, row2, jumpRow, filterRow] });

    let noEdit = false;
    let Interval = setInterval(() => {
        if (noEdit == true) return;
        let queue = client.distube.getQueue(message);
        if (!queue) {
            msg.delete().catch(() => { });
            clearInterval(Interval);
            return;
        }
        let allTimeouts = client.timeouts;
        let myTimeout = allTimeouts.filter(o => o.channel == message.channel.id)[0];
        if (myTimeout) {
            noEdit = true;
            allTimeouts.splice(allTimeouts.indexOf(myTimeout), 1);
            msg.edit({ embeds: [new MessageEmbed().setColor('RED').setTitle('I got rate limited, please wait 1 minute or use this command in another channel!')] }).catch(() => { });
            setTimeout(() => {
                let needRemove = allTimeouts.filter(o => o.channel == message.channel.id)[0];
                while (needRemove) {
                    allTimeouts.splice(allTimeouts.indexOf(needRemove), 1);
                    needRemove = allTimeouts.filter(o => o.channel == message.channel.id)[0];
                }
                noEdit = false;
            }, 60000);
        }

        if (noEdit == false) {
            let song = queue.songs[0];
            let loopType = queue.repeatMode
            let isPaused = queue.paused;
            let isSilent = client.silent.indexOf(message.guild.id) == -1 ? false : true;
            const status = `Volume: \`${queue.volume}%\` | Filters: \`${queue.filters.join(', ') || "Clear"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

            let embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle(`Now Playing: ${song?.name}`)
                .setURL(song?.url)
                .setThumbnail(song?.thumbnail)
                .setDescription(createBar(song?.duration * 1000, queue?.currentTime * 1000))
                .addField("Status: ", status)
            let jumpRow = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('jumpNoD')
                        .setPlaceholder('Jump to a song')
                        .addOptions([]),
                );

            row.components[0].setStyle(loopType == 0 ? 'DANGER' : 'SUCCESS').setEmoji(loopType == 1 ? emojis.loop2 : emojis.loop1)
            row.components[2].setEmoji(isPaused == true ? emojis.play : emojis.pause)
            row2.components[4].setEmoji(isSilent == true ? emojis.noBell : emojis.bell)
            row2.components[0].setEmoji(queue.volume <= 10 ? emojis.lowVolume : queue.volume <= 50 ? emojis.mediumVolume : emojis.highVolume)
            let songs = queue.songs.slice(0, 11);
            songs.map((song, index) => {
                let name = song.name
                jumpRow.components[0].options.push({
                    label: name,
                    value: index.toString(),
                    description: null,
                    emoji: null,
                    default: false
                });
            })

            if (msg.components[0].components[2].emoji.name == emojis.play && isPaused == true) return;

            msg.edit({ embeds: [embed], components: [row, row2, jumpRow, filterRow] }).catch(() => msg.delete().catch(() => clearInterval(Interval)));
        }
    }, 2000);

    channelIds.push({ id: message.channel.id, msg: msg });
}