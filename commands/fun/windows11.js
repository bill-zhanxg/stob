const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "windows11",
    aliases: [],
    run: async (client, message) => {
        let embed = new MessageEmbed()
            .setColor("GREEN")
            .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
            .setTitle("Windows 11 released!!!!")
            .setDescription("Beginning 5/10/2021, Windows 11 is rolling out as an optional update to eligible devices!\n\nRead more about Windows 11 here:\nhttps://www.microsoft.com/en-gb/windows/windows-11\n\nFor more information on the upgrade, check out the blog post:\nhttps://blogs.windows.com/windowsexperience/2021/10/04/how-to-get-windows-11/\n\nYou can check to see if the update is available by going to Settings > Update & Security > Windows Update and clicking Check for updates. If you're offered the update and you're ready to make the switch, click Download and install.\n\nIf you want to download the ISO, Media Creation Tool or Installation Assistant, then visit this page:\nhttps://www.microsoft.com/en-us/software-download/windows11\n\n")

        message.channel.send({ embeds: [embed] });
    }
}