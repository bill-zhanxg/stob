const { Permissions, MessageEmbed } = require("discord.js")

module.exports = {
    name: "unmute",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.reply("You don't have permission to do this!");
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.channel.send("I do not have permission to mute members!");
        if (args[0] == null) return message.reply("Usage: -unmute <user>");

        if (message.mentions.members.first()) {
            unmute(message.mentions.members.first());
        }
        else {
            try {
                let user = await message.guild.members.fetch(args[0])
                unmute(user);
            }
            catch {
                message.channel.send('Please enter a valid member id!');
            }
        }

        async function unmute(member) {
            let role = await message.guild.roles.cache.find(role => role.name === "mute role for stob");
            if (role == undefined) {
                message.reply("There isn't even a mute role yet! Use -mute to mute a user")
            }
            else {
                if (!member.roles.cache.has(role.id)) return message.reply('Are you sure that member is muted?');
                member.roles.remove(role).then(() => {
                    let embed = new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle(`User ${member.user.tag} has been unmuted!`);
    
                    message.channel.send({ embeds: [embed] });
                }).catch(() => message.channel.send("Error removing the role"))
            }
        }
    }
}