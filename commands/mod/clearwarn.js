const { Permissions, MessageEmbed } = require("discord.js")
const { cwarn } = require("../../handleMongoDB");

module.exports = {
    name: "clearwarn",
    aliases: ["cwarn"],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.reply("You don't have permission to do this!");
        if (args[0] == null) return message.reply("Usage: -cwarn <user>");

        if (message.mentions.members.first()) {
            clwarn(message.mentions.members.first());
        }
        else {
            try {
                let user = await message.guild.members.fetch(args[0])
                clwarn(user);
            }
            catch {
                message.channel.send('Please enter a valid member id!');
            }
        }

        async function clwarn(member) {
            let value = await cwarn(member.guild.id, member.id);

            if (value != null) {
                message.reply({ embeds: [new MessageEmbed().setColor('GREEN').setDescription(`Successfully cleared the warns for: <@${value}>`)] })
            }
            else {
                message.reply("There is an error while executing this command, please try again!");
            }
        }
    }
}