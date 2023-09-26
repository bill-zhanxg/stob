const { MessageEmbed } = require("discord.js");
const lyricsParse = require('../../lyrics');

module.exports = {
    name: "lyric",
    aliases: [],
    run: async (client, message, args) => {
        let song = args.join(" ");

        const lyrics = await lyricsParse(song);
        if (lyrics) {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(`🎶 Here is the lyric for ${song}`)
                    .setDescription(`\`\`\`${lyrics.slice(0, 1990)}\`\`\``)
                ]
            });
        }
        else {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setTitle('❌ No Lyrics Found!')
                    .setDescription(`Please try search something else`)
                ]
            });
        }
    }
}