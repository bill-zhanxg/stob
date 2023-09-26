const prefix = require("../../prefix");

module.exports = {
    name: "replacelinebreak",
    aliases: ["multitooneline", "rlb", "linebreakto\\n"],
    run: async (client, message, args) => {
        if (args.length <= 0) return message.reply('Give me something to replace?');

        let content = message.content.substring(message.content.indexOf(' ')).slice(prefix.get(message.guild.id).length).trim().replaceAll('\n', '\\n');

        message.reply(content).catch(() => message.reply('There is an error replacing your text!'));
    }
}