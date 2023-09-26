const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "antiscam",
    aliases: ["antiphishing", "antiphish"],
    run: async (client, message) => {
        let embed = new MessageEmbed()
        .setTitle('Real Discord Nitro Gift')
        .setColor('GREEN')
        .setDescription("To identify phishing links, you first need to know what a real Discord nitro gift looks like, the link always begins with <https://discord.gift/>. And it will show a special embed with a button as the image shown below:")
        .setImage('https://support.discord.com/hc/article_attachments/360017626471/5_.jpg')

        let embed2 = new MessageEmbed()
        .setTitle('Fake Discord Nitro Gift')
        .setColor('RED')
        .setDescription("The scammers will create a lot of similar links as 'discord.gift', for a list of Discord nitro phishing links click [here](https://raw.githubusercontent.com/Discord-AntiScam/scam-links/main/list.txt). The image down below is an example of a fake nitro gift link:")
        .setImage('https://cdn.discordapp.com/attachments/935010666253799504/935011124343091340/unknown.png')

        let embed3 = new MessageEmbed()
        .setTitle('Stob Anti-scam')
        .setColor('BLUE')
        .setDescription("I added a new feature that will scan every message and check if it's is a phishing link or not, if it is a phishing link, it will reply to the message and warn other people. It will also check the similarity between the links too.")

        message.channel.send({embeds: [embed, embed2, embed3]});
    }
}