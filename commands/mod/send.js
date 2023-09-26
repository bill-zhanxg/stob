module.exports = {
    name: "send",
    aliases: [],
    run: async (client, message, args) => {
        if (message.author.id != "768367429973704714") return message.channel.send("Only the owner of this bot can user this command!");
        let channelid = args[0];
        if (args[1] == null) return message.reply("-send <channelID> <message>");
        let msg = args.slice(1).join(' ');

        let channel = await client.channels.cache.get(channelid);
        if (channel) {
            channel.send(msg);
            message.reply('Sent!');
        }
        else {
            message.reply('Can not find the channel');
        }
    }
}