const { Permissions, MessageEmbed } = require("discord.js")
const { vwarn } = require("../../handleMongoDB");

module.exports = {
    name: "viewwarn",
    aliases: ["vwarn"],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.reply("You don't have permission to do this!");
        if (args[0] == null) return message.reply("Usage: -vwarn <user>");

        if (message.mentions.members.first()) {
            vewarn(message.mentions.members.first());
        }
        else {
            try {
                let user = await message.guild.members.fetch(args[0])
                vewarn(user);
            }
            catch {
                message.channel.send('Please enter a valid member id!');
            }
        }

        async function vewarn(member) {
            let value = await vwarn(member.guild.id, member.id);

            if (value == null) {
                message.reply("There is an error while executing this command, please try again!");
            }
            else if (value == false) {
                message.reply("That user don't have any warns yet!");
            }
            else {
                message.reply({ embeds: [new MessageEmbed().setColor('GREEN').setDescription(`User <@${value.userId}> have ${value.warns} warnings!`)] })
            }
        }
    }
}