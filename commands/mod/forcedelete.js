const { Permissions } = require('discord.js');

module.exports = {
    name: "forcedelete",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.channel.permissionsFor(message.member).has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply("You don't have permission to do this!");
        if (!message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply("I don't have permission to delete messages");

        if (isNaN(args[0])) return message.reply("Please enter a valid number!");
        if (args[0] > 100) return message.reply("The number is too big! The max is 100");
        var Num = parseInt(args[0]);
        if (Num < 1) return message.reply("Please enter a number greater then 0!");

        await message.delete().catch(() => { });

        let allMessages = await message.channel.messages.fetch({ limit: Num });

        let deleted = 0;
        for (let msg of allMessages) {
            await msg[1].delete().then(() => {
                deleted++;
            }).catch(() => {});
        }

        message.channel.send(`I have deleted ${deleted} messages`).then(m => { setTimeout(() => m.delete().catch(() => { }), 2000) });
    }
}