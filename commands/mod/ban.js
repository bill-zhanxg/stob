const { Permissions } = require("discord.js")

module.exports = {
    name: "ban",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply("You don't have permission to do this!");
        if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.channel.send("I do not have permission to ban members!");
        if (args[0] == null) return message.reply("Usage: -ban <user> {reason}");
        let usermsg = args[1] == null ? "No reason provide" : args.splice(1).join(" ");

        if (message.mentions.members.first()) {
            ban(message.mentions.members.first(), usermsg);
        }
        else {
            try {
                let user = await message.guild.members.fetch(args[0])
                ban(user, usermsg);
            }
            catch {
                message.channel.send('Please enter a valid member id!');
            }
        }

        async function ban(member, reason) {
            if(!member.bannable) return message.channel.send("I don't have permission to ban that member, maybe it's because that member got a higher permission than me!");

            let dm = "& sent a dm";

            await member.send(`You have being banned from **${message.guild.name}**. Reason: ${reason}`).catch(() => dm = "but fail sending dm to the member");
            member.ban({ days: 7, reason: reason }).then(() => {
                message.channel.send(`Successfully banned user: **${member.user.username}** ${dm}. Reason: ${reason}`)
            }).catch(() => message.channel.send("Failed banning user!"));
        }
    }
}