const { Permissions, MessageEmbed } = require("discord.js")

module.exports = {
    name: "play",
    aliases: ["pl"],
    run: async (client, message, args) => {
        //check member channel, the bot perms
        let vchannel = message.member.voice.channel;
        if (!vchannel) return message.channel.send({ embeds: [new MessageEmbed().setTitle("You need to be in a voice channel to play music!").setColor("RED")] });
        if (!vchannel.permissionsFor(message.guild.me).has(Permissions.FLAGS.CONNECT)) return message.channel.send({ embeds: [new MessageEmbed().setTitle("I cannot connect to your voice channel, make sure I have the proper permissions!").setColor("RED")] });
        if (args[0] == null) return message.reply({ embeds: [new MessageEmbed().setTitle('Usage: -pl <URL/Name>').setColor("RED")] });
        let song = args.join(" ");

        message.channel.send({
            embeds: [new MessageEmbed()
                .setTitle("Searching...🔍")]
        });

        client.distube.play(vchannel, song, { member: message.member, textChannel: message.channel, message: message });
    }
}