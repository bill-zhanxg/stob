const { MessageEmbed, Permissions } = require("discord.js")
const functions = require('../functions');

module.exports = {
    name: "timeout",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return message.reply("You don't have permission to do this!");
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return message.channel.send("I do not have permission to timeout members!");
        if (args[0] == null) return message.reply("Usage: -timeout <user> <time(1d, 1h, 1m, 1s)> {reason}");

        let userId = args[0];
        args.splice(0, 1);

        let time = 0;
        
        for (const t of args) {
            try {
                let which = t.slice(-1).toLowerCase();
                if (which == 'd') {
                    let ti = t.slice(0, -1);
                    time += parseInt(ti * 86400);
                }
                else if (which == 'h') {
                    let ti = t.slice(0, -1);
                    time += parseInt(ti * 3600);
                }
                else if (which == 'm') {
                    let ti = t.slice(0, -1);
                    time += parseInt(ti * 60);
                }
                else if (which == 's') {
                    let ti = t.slice(0, -1);
                    time += parseInt(ti);
                }
                else {
                    args.splice(0, args.indexOf(t));
                    break;
                }
            }
            catch (e) {
                return message.reply(`I'm sure you typed something wrong. Error: \`\`\`${e.message}\`\`\``);
            }
        }

        if (time > 2419199) return message.reply("Discord only allow timeout for 27 Days, 23 Hours, 59 Minutes, 59 Seconds! Please try again with a shorter time.");
        
        let usermsg = args.join(' ');

        if (message.mentions.members.first()) {
            timeout(message.mentions.members.first(), time, usermsg);
        }
        else {
            try {
                let user = await message.guild.members.fetch(userId);
                timeout(user, time, usermsg);
            }
            catch {
                message.channel.send('Please enter a valid member id!');
            }
        }

        async function timeout(member, time, reason) {
            if (!member.moderatable) return message.channel.send("I do not have permission to timeout that user!");
            member.timeout(time * 1000, reason)
                .then(message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`Successfully timeout <@${member.id}> for ${functions.secondsToDhms(time) == '' ? '0 Second' : functions.secondsToDhms(time)}. Reason: ${reason}`)
                    ]
                }))
                .catch(error => message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`❌ ERROR | An error occurred`)
                        .setDescription(`\`\`\`${error.message}\`\`\``)]
                }));
        }
    }
}