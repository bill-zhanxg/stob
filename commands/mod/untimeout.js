const { MessageEmbed, Permissions } = require("discord.js")

module.exports = {
    name: "untimeout",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return message.reply("You don't have permission to do this!");
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return message.channel.send("I do not have permission to untimeout members!");
        if (args[0] == null) return message.reply("Usage: -untimeout <user>");

        if (message.mentions.members.first()) {
            untimeout(message.mentions.members.first());
        }
        else {
            try {
                let user = await message.guild.members.fetch(args[0])
                untimeout(user);
            }
            catch {
                message.channel.send('Please enter a valid member id!');
            }
        }

        async function untimeout(member) {
            member.timeout(null)
                .then(message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`Successfully untimeout <@${member.id}>`)
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