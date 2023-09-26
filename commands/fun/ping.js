const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "ping",
    aliases: [],
    run: async (client, message) => {
        message.channel.send({ embeds: [new MessageEmbed().setColor("GREEN").setTitle("Pinging...")] }).then(m => {
            var ping = m.createdTimestamp - message.createdTimestamp;
            let APIping = Math.round(client.ws.ping);
            let embed = new MessageEmbed()
                .setTitle(`Expect ping is ${APIping}ms\nActual ping is ${ping}ms`);

            if (ping <= 200) {
                embed.color = 5763719;
            }
            else if (ping > 200 && ping < 500) {
                embed.color = 16705372;
            }
            else {
                embed.color = 15548997;
            }

            m.edit({ embeds: [embed] });
        });
    }
}