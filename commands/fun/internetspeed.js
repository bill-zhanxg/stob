const { MessageEmbed } = require("discord.js")
const FastSpeedtest = require("fast-speedtest-api")

module.exports = {
    name: "internetspeed",
    aliases: ["interspd"],
    run: async (client, message) => {
        let msg = await message.channel.send({ embeds: [new MessageEmbed().setColor('GREEN').setTitle("Getting internet speed, please wait 10 seconds...")] })

        let speed = await fastnetApi();
        if (speed.message) return message.channel.send({ embeds: [new MessageEmbed().setColor('RED').setTitle(`There is an error while getting the internet speed`).setDescription(`\`\`\`${speed.message}\`\`\``)] })

        let embed = new MessageEmbed()
            .setTitle(`My host's internet speed is ${speed} Mbps`)

        if (speed > 30) {
            embed.setColor('GREEN');
        }
        else if (speed > 10) {
            embed.setColor('YELLOW');
        }
        else {
            embed.setColor('RED');
        }

        msg.edit({ embeds: [embed] }).catch(() => { });
    }
}

function fastnetApi() {

    let speedtest = new FastSpeedtest({
        token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm", //**** required
        verbose: false, // default: false
        timeout: 10000, // default: 5000
        https: true, // default: true
        urlCount: 5, // default: 5 
        bufferSize: 8, // default: 8 
        unit: FastSpeedtest.UNITS.Mbps // default: Bps
    });

    return speedtest.getSpeed().then(s => {
        return s;
    }).catch(e => {
        console.error(e.message);
        return e;
    });
}