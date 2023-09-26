const { Permissions } = require('discord.js');

module.exports = {
    name: "delete",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.channel.permissionsFor(message.member).has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply("You don't have permission to do this!");
        if (!message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply("I don't have permission to delete messages");

        if (isNaN(args[0])) return message.reply("Please enter a valid number!");
        if (args[0] > 10000) return message.reply("The number is too big! The max is 10000");
        var Num = parseInt(args[0]);
        if (Num < 1) return message.reply("Please enter a number greater then 0!");

        await message.delete().catch(() => { });
        if (Num > 100) {
            let times = Math.trunc(Num / 100);
            let left = Num % 100;
            let messageCount = 0;
            let needBreak = false;

            for (i = 0; i < times; i++) {
                await message.channel.bulkDelete(100).then(messagecount => {
                    messageCount += messagecount.size;
                    if (messagecount.size <= 0) {
                        needBreak = true;
                    }
                }).catch((e) => { message.channel.send("Some messages may not being deleted! Error: " + e); needBreak = true; });
                if (needBreak == true) {
                    break;
                }
            }

            if (needBreak == false && left > 0) {
                message.channel.bulkDelete(left).then(messages => message.channel.send(`I have deleted ${messages.size + messageCount + 1} messages`)).then(d => { setTimeout(() => d.delete().catch(() => { }), 2000) }).catch((e) => message.channel.send("Fail deleteing some messages, maybe try a smaller number! Error: " + e));
            }
            else {
                message.channel.send(`I have deleted ${messageCount} messages`).then(d => { setTimeout(() => d.delete().catch(() => { }), 2000) });
            }
        }
        else {
            message.channel.bulkDelete(Num).then(messages => message.channel.send(`I have deleted ${messages.size} messages`)).then(d => { setTimeout(() => d.delete().catch(() => { }), 2000) }).catch((e) => message.channel.send("Fail deleteing messages, maybe try a smaller number! Error: " + e));
        }
    }
}