const { MessageEmbed, WebhookClient } = require("discord.js")
const { webHooks } = require("../../config.json");

module.exports = {
    name: "feedback",
    aliases: [],
    run: async (client, message, args) => {
        if (args[0] == null) return message.reply("Usage: -feedback <feedback>")
        let feedback = args.join(" ");
        if (feedback.lenght > 2000) return message.reply("You can only send up to 2000 letters feedback")
        const webhookClient = new WebhookClient({ url: webHooks.feedback });

        let embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`From server: **${message.guild.name}**`)
            .setDescription(`\`\`\`${feedback}\`\`\``)
            .setFooter({ text: `Feedback sent by ${message.author.tag}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })

        webhookClient.send({
            embeds: [embed],
        }).then(() => {
            message.reply({
                embeds: [new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle(`✅ Successfully submitted the feedback`)]
            });
        }).catch((e) => {
            console.log(`There is an error while ${message.author.tag} trying to send feedback, content: ${feedback}. Error: ${e}`);
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`❌ ERROR | An error occurred while trying to send the feedback`)
                    .setDescription(`I'll fix it as soon as I can`)]
            });
        });
    }
}