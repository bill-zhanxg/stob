const { MessageEmbed, Permissions } = require("discord.js")

module.exports = {
    name: "log",
    aliases: [],
    run: async (client, message, args) => {
        if (args[0] == null) return message.reply("Usage: -log <channel/off>");
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply("You don't have permission to do this!");
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS) || !message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.MANAGE_WEBHOOKS)) return message.channel.send("I do not have permission to manage webhooks!");

        if (args[0].toLowerCase() == 'off') {
            message.guild.fetchWebhooks()
                .then(webhooks => {
                    let re = webhooks.filter(webh => webh.name == 'Stob Logging')
                    if (re.size < 1) return message.channel.send({ embeds: [new MessageEmbed().setTitle('❌ There is no log in this server').setDescription("To create log use `-log <textChannel>`").setColor("RED")] })
                    for (const w of re) {
                        w[1].delete('No more logs');
                    }
                    message.channel.send({ embeds: [new MessageEmbed().setTitle('✅ Successfully turned off the logs').setColor("GREEN")] })
                })
                .catch(() => message.channel.send({ embeds: [new MessageEmbed().setTitle('❌ Error fetching webhooks').setColor("RED")] }));
        }
        else {
            if (!message.mentions.channels.first()) return message.channel.send({ embeds: [new MessageEmbed().setTitle("You didn't mention any channel").setColor("RED")] })
            let menChannel = message.mentions.channels.first();
            if (!menChannel.isText()) return message.channel.send({ embeds: [new MessageEmbed().setTitle("Please only mention text channels").setColor("RED")] })
            
            let check = await checkWebhokk(message.guild);
            if (check != null) {
                for (const del of check) {
                    del[1].delete('Too many loggings');
                }
            }

            menChannel.createWebhook('Stob Logging', {
                avatar: client.user.displayAvatarURL({ dynamic: true }),
                reason: 'For Stob Logging'
            }).then((webhook) => {
                message.channel.send({ embeds: [new MessageEmbed().setDescription(`✅ Successfully created webhook named **${webhook.name}** in <#${webhook.channelId}>, please do not remove/modify that webhook otherwise it may not work properly`).setColor("GREEN")] })
            }).catch(() => message.channel.send({ embeds: [new MessageEmbed().setTitle('❌ Error creating webhooks').setColor("RED")] }))
        }

        function checkWebhokk(guild) {
            return guild.fetchWebhooks()
                .then(webhooks => {
                    let re = webhooks.filter(webh => webh.name == 'Stob Logging')
                    if (re.size < 1) return null;
                    return re;
                })
                .catch(() => { message.channel.send({ embeds: [new MessageEmbed().setTitle('❌ Error fetching webhooks, so I just going to create one').setColor("RED")] }); return null; });
        }
    }
}