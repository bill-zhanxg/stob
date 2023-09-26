const { Permissions } = require("discord.js")

module.exports = {
    name: "unban",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply("You don't have permission to do this!");
        if (!message.guild.me.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send("I do not have permission to ban members!");
        if (args[0] == null) return message.reply("Usage: -unban <user id/name>");
        let user = args.join(" ");

        let check;
        await message.guild.bans.fetch().then(bans => {
            const banned = bans.find(ban => ban.user.id === user);
            const bannedName = bans.find(ban => ban.user.username === user);

            if (!banned && !bannedName) {
                check = true;
            }
        });
        if (check == true) {
            return message.reply("You sure that user is banned?");
        }

        let userwithname = await client.users.cache.find(users => users.username == user);
        await message.guild.members.unban(user).catch(() => {
            message.guild.members.unban(userwithname).catch(() => check = true)
        });
        if (check == true) {
            return message.channel.send("Failed unbanning! It's maybe because I don't have a common server with that user, try using they id!")
        }

        let dm = "& sent a dm";
        await message.member.send(`You have being unbanned from **${message.guild.name}**.`).catch(() => dm = "but fail sending dm to the member");
        message.channel.send(`Successfully unbanned user: **${user}** ${dm}.`);
    }
}