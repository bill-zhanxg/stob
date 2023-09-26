const { MessageEmbed, Permissions } = require("discord.js")

module.exports = {
    name: "poll",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.ADD_REACTIONS)) return message.reply("I don't have permission to add reactions");
        if (args[0] == null) return message.reply('-poll example');
        if (args[0].toLowerCase() == 'example') {
            message.channel.send({ embeds: [new MessageEmbed().setColor('GREEN').setTitle("Usage: -poll {Question} [Answer1] [Answer2] [Answer3]").setDescription("**Example:**\n\`\`\`-poll {Which bot you like the most} [**Stob**] [`Carl-bot`] [**Dyno**]\`\`\`\n**Note: You can only type up to 10 answers**")] })
        }
        else {
            let emojis = { 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣', 10: '🔟' };
            let text = '';
            let input = args.join(' ');
            let question = input.match(new RegExp("{(.*)}"));
            let answers = getFromBetween.get(input, '[', ']');

            if (question == null) return message.reply("Please use `-poll example` to see how to use this command\n**Error, There isn't a question**");
            if (question[1].replace(/\s/g, '').length < 1 == true) return message.reply("Please use `-poll example` to see how to use this command\n**Error, The question can't be none or white space**");
            if (answers.length < 1) return message.reply("Please use `-poll example` to see how to use this command\n**Error, There isn't answers**");

            let num = 1;
            for (const a of answers) {
                if (num > 10) break;
                text += `${emojis[`${num}`]} ${answers[num - 1]}\n`
                num++;
            }

            let embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle(question[1])
                .setDescription(text)
                .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            let msg = await message.channel.send({ embeds: [embed] });

            for (i = 1; i < answers.length + 1; i++) {
                if (i > 10) break;
                msg.react(emojis[`${i}`]);
            }
        }
    }
}

var getFromBetween = {
    results: [],
    string: "",
    getFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1) + sub1.length;
        var string1 = this.string.substr(0, SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP, TP);
    },
    removeFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
        this.string = this.string.replace(removal, "");
    },
    getAllResults: function (sub1, sub2) {
        // first check to see if we do have both substrings
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1, sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1, sub2);

        // if there's more substrings
        if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1, sub2);
        }
        else return;
    },
    get: function (string, sub1, sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1, sub2);
        return this.results;
    }
};