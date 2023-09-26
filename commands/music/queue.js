const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "queue",
    aliases: ["q"],
    run: async (client, message, args) => {
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

        let queue = client.distube.getQueue(message);
        let embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`Queue for: ${message.guild.name}`)
            .addField("Status: ", `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "Queue" : "Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\` | Filters: \`${queue.filters.join(', ') || "Clear"}\` | Duration: \`${queue.formattedDuration}\``)

        let counter = 0;
        for (i = 0; i < queue.songs.length; i += 20) {
            let k = queue.songs;
            let songs = k.slice(i, i + 20);
            message.channel.send({ embeds: [embed.setDescription(songs.map((song, index) => `**${index + 1 + counter * 20}.** [${song.name}](${song.url}) - ${song.formattedDuration}`).join("\n"))] });
            counter++;
        }
    }
}