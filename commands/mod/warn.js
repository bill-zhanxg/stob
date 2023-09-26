const { Permissions, MessageEmbed } = require("discord.js")
const { warn } = require("../../handleMongoDB");

module.exports = {
    name: "warn",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.reply("You don't have permission to do this!");
        if (args[0] == null) return message.reply("Usage: -warn <user>");

        if (message.mentions.members.first()) {
            Warn(message.mentions.members.first());
        }
        else {
            try {
                let user = await message.guild.members.fetch(args[0])
                Warn(user);
            }
            catch {
                message.channel.send('Please enter a valid member id!');
            }
        }

        async function Warn(member) {
            let value = await warn(member.guild.id, member.id);

            if (value != false) {
                message.reply({ embeds: [new MessageEmbed().setColor('GREEN').setDescription(`Successfully warned user <@${value.userId}>, they now have ${value.WarnCounts} warnings!`)] })
            }
            else {
                message.reply("There is an error while executing this command, please try again!");
            }
        }
    }
}