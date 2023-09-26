const { Permissions } = require("discord.js")

module.exports = {
    name: "kick",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.reply("You don't have permission to do this!");
        if (!message.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.channel.send("I do not have permission to kick members!");
        if (args[0] == null) return message.reply("Usage: -kick <user> {reason}");
        let usermsg = args[1] == null ? "No reason provide" : args.splice(1).join(" ");

        if (message.mentions.members.first()) {
            kick(message.mentions.members.first(), usermsg);
        }
        else {
            try {
                let user = await message.guild.members.fetch(args[0])
                kick(user, usermsg);
            }
            catch {
                message.channel.send('Please enter a valid member id!');
            }
        }

        async function kick(member, reason) {
            if(!member.kickable) return message.channel.send("I don't have permission to kick that member, maybe it's because that member got a higher permission than me!");

            let dm = "& sent a dm";

            await member.send(`You have being kicked from **${message.guild.name}**. Reason: ${reason}`).catch(() => dm = "but fail sending dm to the member");
            member.kick(reason).then(() => {
                message.channel.send(`Successfully kicked user: **${member.user.username}** ${dm}. Reason: ${reason}`)
            }).catch(() => message.channel.send("Failed kicking user!"));
        }
    }
}