const { MessageEmbed, Permissions, Client } = require("discord.js")

let cooldown = [];

let x = module.exports = {
    serverInvite: (message) => {
        if (!message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.CREATE_INSTANT_INVITE)) return message.reply("I don't have permission to create invite in this channel!");
        message.channel.createInvite({
            maxAge: 1800, //30 mins
            maxUses: 10
        }).then(invite => {
            let embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`Server invite link expires in: ${invite.maxAge / 60} min, max users: ${invite.maxUses}.`)
                .setDescription(`https://discord.com/invite/${invite.code}`);

            message.reply({ embeds: [embed] });
        }).catch(error => { message.channel.send(`There is an error while creating the invite link: ${error}`) });
    },
    spam: async (message, args) => {
        return message.reply('This command has been disabled because it got abused byy people and I got IP banned by Discord');
        let id = message.guild.id;
        if (cooldown.indexOf(id) != -1) return message.reply('Please wait till this command finish processing to use this command again!');
        if (isNaN(args[0])) return message.reply("Please enter a valid number!");
        var msg = args.slice(1).join(' ');
        var times = args[0];
        if (times > 50) return message.reply("you can only spam 50 messages at a time");
        if (args[1] == null) return message.reply("I can't send empty messages!");
        cooldown.push(id);

        for (i = 0; i < times; i++) {
            if (cooldown.indexOf(id) != -1) {
                try {
                    await message.channel.send(msg);
                }
                catch {
                    break;
                }
            }
            else {
                break;
            }
        }

        cooldown.splice(cooldown.indexOf(id), 1);
    },
    sspam: (message) => {
        let guildID = message.guild.id;
        if (cooldown.indexOf(guildID) == -1) {
            message.reply("I'm not even spamming right now");
        }
        else {
            cooldown.splice(cooldown.indexOf(guildID), 1);
        }
    },
    activity: async (client, channel, type) => {
        return client.together.generateTogetherCode(channel, type).then(async invite => {
            return invite.code;
        }).catch(() => { return null });
    },
    secondsToDhms: (seconds) => {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);

        var dDisplay = d > 0 ? d + (d == 1 ? " Day, " : " Days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " Hour, " : " Hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " Minute, " : " Minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " Second" : " Seconds") : "";
        return (dDisplay + hDisplay + mDisplay + sDisplay).slice(0, -2);
    },
    formatText: (text, maxMessageLength = 2000, separator = "\n") => {
        text = text.replace(/\t/g, "    ");
        let longWords = text.match(new RegExp(`[^${separator.replace("\n", "\\n")}]{${maxMessageLength * (19/20)},}`, "gm"));
        if (longWords) for (let longWord of longWords) {
          let count1 = 0;
          let shortWords = [];
          longWord.split("").forEach(c => {
            if (shortWords[count1] && (shortWords[count1].length >= maxMessageLength * (19/20) || (c == "\n" && shortWords[count1].length >= maxMessageLength * (19/20) - 100))) count1++;
            shortWords[count1] = shortWords[count1] ? shortWords[count1] + c : c;
          });
          text = text.replace(longWord, shortWords.join(separator));
        }
        let messages = [];
        let count2 = 0;
        text.split(separator).forEach((word) => {
          if (messages[count2] && (messages[count2] + "" + word).length > maxMessageLength * (39/40)) count2++;
          messages[count2] = messages[count2] ? messages[count2] + separator + word : word;
        });
      
        let insertCodeBlock = null, insertCodeLine = null;
        for (let j = 0; j < messages.length; j++) {
          if (insertCodeBlock) {
            messages[j] = insertCodeBlock + messages[j];
            insertCodeBlock = null;
          }
          else if (insertCodeLine) {
            messages[j] = insertCodeLine + messages[j];
            insertCodeLine = null;
          }
      
          let codeBlocks = messages[j].match(/`{3,}[\S]*\n|`{3,}/gm);
          let codeLines = messages[j].match(/[^`]{0,1}`{1,2}[^`]|[^`]`{1,2}[^`]{0,1}/gm);
      
          if (codeBlocks && codeBlocks.length % 2 == 1) {
            messages[j] = messages[j] + "```";
            insertCodeBlock = codeBlocks[codeBlocks.length-1] + "\n";
          }
          else if (codeLines && codeLines.length % 2 == 1) {
            insertCodeLine = codeLines[codeLines.length-1].replace(/[^`]/g, "");
            messages[j] = messages[j] + insertCodeLine;
          }
        }
        return messages;
    },
    /**
     * 
     * @param {Client} client 
     */
    sendLogs: async (client) => {
        async function checkLog(guild, type) {
            if (!guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return null;
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: type,
            });

            if (fetchedLogs) return fetchedLogs.entries.first()
            return null;
        }
        /**
         * 
         * @param {Guild} guild 
         * @returns channel
         */
        function checkWebhokk(guild) {
            if (guild.me && !guild.me.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) return null;
            return guild.fetchWebhooks()
                .then(webhooks => {
                    let re = webhooks.filter(webh => webh.name == 'Stob Logging')
                    if (re.size < 1) return null;
                    return re.first().channel;
                })
                .catch(() => { return null });
        }
        function send(channel, embed) {
            channel.send({ embeds: [embed] }).catch(() => { });
        }
        function sendArray(channel, embeds) {
            channel.send({ embeds: embeds }).catch(() => { });
        }

        client
            //Channels
            .on('channelCreate', async channel => {
                let hook = await checkWebhokk(channel.guild);
                if (hook != null) {
                    let log = await checkLog(channel.guild, 'CHANNEL_CREATE');
                    if (log) {
                        send(hook, new MessageEmbed()
                            .setColor("GREEN")
                            .setAuthor({ name: `Channel created: ${channel?.name}`, iconURL: channel.guild.iconURL({ dynamic: true }) })
                            .setDescription(`<#${channel.id}>`)
                            .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: `Created by:`, value: `${log.executor.tag}` },
                                { name: `Category:`, value: `${channel.parent ? channel.parent.name : 'None'}` },
                                { name: `Channel ID:`, value: `${channel?.id}` },
                                { name: `Channel Type:`, value: `${channel?.type}` },
                                { name: `Created at:`, value: `${channel?.createdAt}` },
                                { name: `Position:`, value: `${channel?.position}` },
                                { name: `Permission Overwrites:`, value: `${checkPermission(channel.permissionOverwrites.cache)}` },
                            )
                        )
                    }
                }
            })
            .on('channelDelete', async channel => {
                if (channel.type == 'DM' || channel.type == 'GROUP_DM') return;
                let hook = await checkWebhokk(channel.guild);
                if (hook != null) {
                    let log = await checkLog(channel.guild, 'CHANNEL_DELETE');
                    if (log) {
                        send(hook, new MessageEmbed()
                            .setColor("RED")
                            .setAuthor({ name: `Channel delete: ${channel.name}`, iconURL: channel.guild.iconURL({ dynamic: true }) })
                            .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: `Deleted by:`, value: `${log.executor.tag}` },
                                { name: `Category:`, value: `${channel.parent ? channel.parent.name : 'None'}` },
                                { name: `Channel ID:`, value: `${channel.id}` },
                                { name: `Channel Type:`, value: `${channel.type}` },
                                { name: `Channel Created at:`, value: `${channel.createdAt}` },
                            )
                        )
                    }
                }
            })
            .on('channelUpdate', async (oldChannel, newChannel) => {
                if (newChannel.type == 'DM' || newChannel.type == 'GROUP_DM') return;
                let hook = await checkWebhokk(newChannel.guild);
                if (hook != null) {
                    let text = compareChannel(oldChannel, newChannel)
                    if (text != null) {
                        let log = await checkLog(newChannel.guild, null);
                        if (log) {
                            send(hook, new MessageEmbed()
                                .setColor("BLUE")
                                .setAuthor({ name: `Channel Updated: ${newChannel.name} by ${log.executor.tag}`, iconURL: newChannel.guild.iconURL({ dynamic: true }) })
                                .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                                .setDescription(`<#${newChannel.id}>\n${text}\n**New channel permission:**\n${checkPermission(newChannel.permissionOverwrites.cache)}`)
                            )
                        }
                    }
                }
            })
            //Emojis
            .on('emojiCreate', async emoji => {
                let hook = await checkWebhokk(emoji.guild);
                if (hook != null) {
                    let log = await checkLog(emoji.guild, 'EMOJI_CREATE');
                    if (log) {
                        send(hook, new MessageEmbed()
                            .setColor("GREEN")
                            .setAuthor({ name: `Emoji Added: ${emoji.name}`, iconURL: emoji.guild.iconURL({ dynamic: true }) })
                            .setDescription(`<:${emoji.name}:${emoji.id}>`)
                            .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: `Added by:`, value: `${log.executor.tag}` },
                                { name: `Name:`, value: `${emoji.name}` },
                                { name: `ID:`, value: `${emoji.id}` },
                                { name: `Animated:`, value: `${emoji.animated ? 'Yes' : 'No'}` },
                                { name: `Added at:`, value: `${emoji.createdAt}` },
                            )
                        )
                    }
                }
            })
            .on('emojiDelete', async emoji => {
                let hook = await checkWebhokk(emoji.guild);
                if (hook != null) {
                    let log = await checkLog(emoji.guild, 'EMOJI_DELETE');
                    if (log) {
                        send(hook, new MessageEmbed()
                            .setColor("RED")
                            .setAuthor({ name: `Emoji Deleted: ${emoji.name}`, iconURL: emoji.guild.iconURL({ dynamic: true }) })
                            .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: `Deleted by:`, value: `${log.executor.tag}` },
                                { name: `Name:`, value: `${emoji.name}` },
                                { name: `ID:`, value: `${emoji.id}` },
                                { name: `Animated:`, value: `${emoji.animated ? 'Yes' : 'No'}` },
                                { name: `Emoji Added at:`, value: `${emoji.createdAt}` },
                            )
                        )
                    }
                }
            })
            .on('emojiUpdate', async (oldEmoji, newEmoji) => {
                if (newEmoji.type == 'DM' || newEmoji.type == 'GROUP_DM') return;
                let hook = await checkWebhokk(newEmoji.guild);
                if (hook != null) {
                    let text = compareEmoji(oldEmoji, newEmoji)
                    if (text != null) {
                        let log = await checkLog(newEmoji.guild, 'EMOJI_UPDATE');
                        if (log) {
                            send(hook, new MessageEmbed()
                                .setColor("BLUE")
                                .setAuthor({ name: `Emoji Updated: ${newEmoji.name}`, iconURL: newEmoji.guild.iconURL({ dynamic: true }) })
                                .setDescription(`<:${newEmoji.name}:${newEmoji.id}>`)
                                .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                                .setDescription(text)
                            )
                        }
                    }
                }
            })
            //Bans
            .on('guildBanAdd', async ban => {
                let hook = await checkWebhokk(ban.guild);
                if (hook != null) {
                    let log = await checkLog(ban.guild, 'MEMBER_BAN_ADD');
                    if (log) {
                        send(hook, new MessageEmbed()
                            .setColor("RED")
                            .setAuthor({ name: `Banned Member: ${ban.user.tag}`, iconURL: ban.user.displayAvatarURL({ dynamic: true }) })
                            .setThumbnail(ban.guild.iconURL({ dynamic: true }))
                            .addFields(
                                { name: `Banned by:`, value: `${log.executor.tag}` },
                                { name: `Reason:`, value: `${log.reason == null ? 'No reason provided' : log.reason}` },
                                { name: `Name:`, value: `${ban.user.username}` },
                                { name: `Discriminator:`, value: `${ban.user.discriminator}` },
                                { name: `ID:`, value: `${ban.user.id}` },
                                { name: `Is Bot:`, value: `${ban.user.bot ? 'Yes' : 'No'}` },
                                { name: `Account Created at:`, value: `${ban.user.createdAt}` },
                            )
                        )
                    }
                }
            })
            .on('guildBanRemove', async ban => {
                let hook = await checkWebhokk(ban.guild);
                if (hook != null) {
                    let log = await checkLog(ban.guild, null);
                    if (log.action == 'MEMBER_BAN_REMOVE') {
                        send(hook, new MessageEmbed()
                            .setColor("GREEN")
                            .setAuthor({ name: `Unbanned Member: ${ban.user.tag}`, iconURL: ban.user.displayAvatarURL({ dynamic: true }) })
                            .setThumbnail(ban.guild.iconURL({ dynamic: true }))
                            .addFields(
                                { name: `Unbanned by:`, value: `${log.executor.tag}` },
                                { name: `Reason:`, value: `${log.reason == null ? 'No reason provided' : log.reason}` },
                                { name: `Name:`, value: `${ban.user.username}` },
                                { name: `Discriminator:`, value: `${ban.user.discriminator}` },
                                { name: `ID:`, value: `${ban.user.id}` },
                                { name: `Is Bot:`, value: `${ban.user.bot ? 'Yes' : 'No'}` },
                                { name: `Account Created at:`, value: `${ban.user.createdAt}` },
                            )
                        )
                    }
                    else {
                        send(hook, new MessageEmbed()
                            .setColor("GREEN")
                            .setAuthor({ name: `Member Ban removed: ${ban.user.tag}`, iconURL: ban.user.displayAvatarURL({ dynamic: true }) })
                            .setThumbnail(ban.guild.iconURL({ dynamic: true }))
                            .addFields(
                                { name: `Name:`, value: `${ban.user.username}` },
                                { name: `Discriminator:`, value: `${ban.user.discriminator}` },
                                { name: `ID:`, value: `${ban.user.id}` },
                                { name: `Is Bot:`, value: `${ban.user.bot ? 'Yes' : 'No'}` },
                                { name: `Account Created at:`, value: `${ban.user.createdAt}` },
                            )
                        )
                    }
                }
            })
            //Members
            .on('guildMemberAdd', async member => {
                let hook = await checkWebhokk(member.guild);
                if (hook != null) {
                    if (member.user.bot == true) {
                        let log = await checkLog(member.guild, 'BOT_ADD');
                        send(hook, new MessageEmbed()
                            .setColor("GREEN")
                            .setAuthor({ name: `Bot Joined: ${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                            .setThumbnail(member.guild.iconURL({ dynamic: true }))
                            .addFields(
                                { name: `Bot added by:`, value: `${log.executor.tag}` },
                                { name: `Name:`, value: `${member.user.username}` },
                                { name: `ID:`, value: `${member.user.id}` },
                                { name: `Account Created at:`, value: `${member.user.createdAt}` },
                            )
                        )
                    }
                    else {
                        if (!member.guild.me.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return;
                        member.guild.invites.fetch().then(guildInvites => { //get all guild invites
                            guildInvites.each(invite => { //basically a for loop over the invites
                                if (invite.uses != client.invites[invite.code]) { //if it doesn't match what we stored:
                                    send(hook, new MessageEmbed()
                                        .setColor("GREEN")
                                        .setAuthor({ name: `Member Joined: ${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                                        .setThumbnail(invite.inviter.displayAvatarURL({ dynamic: true }))
                                        .addFields(
                                            { name: `Invited by:`, value: `${invite.inviter.tag}` },
                                            { name: `Name:`, value: `${member.user.username}` },
                                            { name: `ID:`, value: `${member.user.id}` },
                                            { name: `Account Created at:`, value: `${member.user.createdAt}` },
                                        )
                                    )
                                    client.invites[invite.code] = invite.uses
                                }
                            })
                        })
                    }
                }
            })
            .on('guildMemberRemove', async member => {
                let hook = await checkWebhokk(member.guild);
                if (hook != null) {
                    let log = await checkLog(member.guild, null);
                    if (log.action == 'MEMBER_KICK') {
                        send(hook, new MessageEmbed()
                            .setColor("RED")
                            .setAuthor({ name: `Member Kicked: ${member.user.tag}`, iconURL: member.guild.iconURL({ dynamic: true }) })
                            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: `Kicked by:`, value: `${log.executor.tag}` },
                                { name: `Name:`, value: `${member.user.username}` },
                                { name: `Discriminator:`, value: `${member.user.discriminator}` },
                                { name: `ID:`, value: `${member.id}` },
                                { name: `Is Bot:`, value: `${member.user.bot ? 'Yes' : 'No'}` },
                                { name: `Join At:`, value: `${member.joinedAt}` },
                            )
                        )
                    }
                    else {
                        send(hook, new MessageEmbed()
                            .setColor("RED")
                            .setAuthor({ name: `Member Left: ${member.user.tag}`, iconURL: member.guild.iconURL({ dynamic: true }) })
                            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: `Name:`, value: `${member.user.username}` },
                                { name: `Discriminator:`, value: `${member.user.discriminator}` },
                                { name: `ID:`, value: `${member.id}` },
                                { name: `Is Bot:`, value: `${member.user.bot ? 'Yes' : 'No'}` },
                                { name: `Join At:`, value: `${member.joinedAt}` },
                            )
                        )
                    }
                }
            })
            .on('guildMemberUpdate', async (oldMember, newMember) => {
                let hook = await checkWebhokk(newMember.guild);
                if (hook != null) {
                    let log = await checkLog(newMember.guild, 'MemberUpdate');
                    if (log) {
                        if (oldMember.communicationDisabledUntilTimestamp != newMember.communicationDisabledUntilTimestamp) {
                            if (newMember.communicationDisabledUntilTimestamp == null) {
                                send(hook, new MessageEmbed()
                                    .setColor("GREEN")
                                    .setAuthor({ name: `Member Untimeouted: ${newMember.user.tag} by ${log.executor.tag}`, iconURL: newMember.guild.iconURL({ dynamic: true }) })
                                    .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
                                    .setDescription(`<@${newMember.id}>`)
                                )
                            }
                            else {
                                send(hook, new MessageEmbed()
                                    .setColor("RED")
                                    .setAuthor({ name: `Member Timeouted: ${newMember.user.tag} by ${log.executor.tag}`, iconURL: newMember.guild.iconURL({ dynamic: true }) })
                                    .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
                                    .setDescription(`<@${newMember.id}>`)
                                    .addField('Remaining timeout', `${x.secondsToDhms((newMember.communicationDisabledUntilTimestamp - Date.now()) / 1000) == '' ? '0 Second' : x.secondsToDhms((newMember.communicationDisabledUntilTimestamp - Date.now()) / 1000)}`)
                                )
                            }
                        }
                        else {
                            let text = compareGuildMember(oldMember, newMember)
                            if (text != null) {
                                send(hook, new MessageEmbed()
                                    .setColor("BLUE")
                                    .setAuthor({ name: `Member Updated: ${newMember.user.tag} by ${log.executor.tag}`, iconURL: newMember.guild.iconURL({ dynamic: true }) })
                                    .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
                                    .setDescription(`<@${newMember.id}>\n${text}`)
                                )
                            }
                        }
                    }
                }
            })
            .on('userUpdate', async (oldUser, newUser) => {
                if (oldUser.bot == true) return;
                client.guilds.cache.forEach(async guild => {
                    let hook = await checkWebhokk(guild);
                    if (hook != null) {
                        guild.members.fetch(newUser.id).then(() => {
                            let text = compareUser(oldUser, newUser)
                            if (text != null) {
                                send(hook, new MessageEmbed()
                                    .setColor("BLUE")
                                    .setAuthor({ name: `Member Updated: ${newUser.tag}`, iconURL: guild.iconURL({ dynamic: true }) })
                                    .setThumbnail(oldUser.displayAvatarURL({ dynamic: true }))
                                    .setImage(newUser.displayAvatarURL({ dynamic: true }))
                                    .setDescription(`<@${newUser.id}>\n${text}`)
                                )
                            }
                        }).catch(() => { });
                    }
                });
            })
            .on('guildUpdate', async (oldGuild, newGuild) => {
                let hook = await checkWebhokk(newGuild);
                if (hook != null) {
                    let text = compareGuild(oldGuild, newGuild)
                    if (text != null) {
                        let log = await checkLog(newGuild, 'GUILD_UPDATE');
                        if (log) {
                            send(hook, new MessageEmbed()
                                .setColor("BLUE")
                                .setAuthor({ name: `Guild Updated: ${newGuild.name} by ${log.executor.tag}`, iconURL: newGuild.iconURL({ dynamic: true }) })
                                .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                                .setDescription(`${text}`)
                            )
                        }
                    }
                }
            })
            .on('inviteCreate', async invite => {
                client.invites[invite.code] = invite.uses;
                let hook = await checkWebhokk(invite.guild);
                if (hook != null) {
                    send(hook, new MessageEmbed()
                        .setColor("BLUE")
                        .setAuthor({ name: `Invite Created: **${invite.code}**`, iconURL: invite.guild.iconURL({ dynamic: true }) })
                        .setThumbnail(invite.inviter.displayAvatarURL({ dynamic: true }))
                        .addFields(
                            { name: `Created by:`, value: `${invite.inviter.username}` },
                            { name: `Invite code:`, value: `${invite.code}` },
                            { name: `Invite URL:`, value: `${invite.url}` },
                            { name: `Invite Expires At:`, value: `${invite.expiresAt == null ? 'Never' : invite.expiresAt}` },
                            { name: `Max Uses:`, value: `${invite.maxUses == 0 ? 'Unlimited' : invite.maxUses}` },
                        )
                    )
                }
            })
            .on('inviteDelete', async invite => {
                let hook = await checkWebhokk(invite.guild);
                if (hook != null) {
                    let log = await checkLog(invite.guild, 'INVITE_DELETE');
                    if (log) {
                        send(hook, new MessageEmbed()
                            .setColor("RED")
                            .setAuthor({ name: `Invite Deleted: ${invite.code}`, iconURL: invite.guild.iconURL({ dynamic: true }) })
                            .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: `Invite Deleted by:`, value: `${log.executor.tag}` },
                            )
                        )
                    }
                }
            })
            //Messages
            .on('messageDelete', async message => {
                if (!message.channel) return;
                if (message.author.bot) return;
                let hook = await checkWebhokk(message.guild);
                if (hook != null) {
                    sendArray(hook, [new MessageEmbed()
                        .setColor("RED")
                        .setAuthor({ name: `Message Deleted in: ${message.channel?.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                        .setDescription(`<#${message.channel?.id}>`)
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                        .addFields(
                            { name: `Sent by:`, value: `${message.author.tag}` },
                            { name: `ID:`, value: `${message.id}` },
                            { name: `Is Bot:`, value: `${message.author?.bot ? 'Yes' : 'No'}` },
                            { name: `Content:`, value: `${message.content != '' ? message.content : 'No Message Content'}` },
                            { name: `Content Embeds:`, value: `${message.embeds?.length < 1 ? 'No' : '**Yes, Here is the embeds:**'}` },
                        ), ...message.embeds]
                    )
                }
            })
            .on('messageDeleteBulk', async messages => {
                let message = messages.first();
                if (!message.channel) return;
                let hook = await checkWebhokk(message.guild);
                if (hook != null) {
                    let log = await checkLog(message.guild, 'MESSAGE_BULK_DELETE');
                    if (log) {
                        send(hook, new MessageEmbed()
                            .setColor("RED")
                            .setAuthor({ name: `Message Bulk Deleted in: ${message.channel?.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setDescription(`<#${message.channel?.id}>`)
                            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: `Deleted by:`, value: `${log.executor.tag}` },
                                { name: `First Message Sent by:`, value: `${message.author.tag}` },
                                { name: `First Message ID:`, value: `${message.id}` },
                                { name: `Size of messages :`, value: `${messages.size} messages being bulk deleted` },
                                { name: `First Message Content:`, value: `${message.content != '' ? message.content : 'No Message Content'}` },
                            )
                        )
                    }
                }
            })
            .on('messageUpdate', async (oldMessage, newMessage) => {
                if (!oldMessage.channel || !newMessage.channel) return;
                if (!oldMessage || !newMessage) return;
                if (oldMessage.author?.id == '882068020153966663') return;
                let hook = await checkWebhokk(newMessage.guild);
                if (hook != null) {
                    let oldContent = oldMessage.content != '' ? oldMessage.content : 'No Message Content';
                    let newContent = newMessage.content != '' ? newMessage.content : 'No Message Content';
                    if (oldContent == newContent) return;
                    send(hook, new MessageEmbed()
                        .setColor("BLUE")
                        .setAuthor({ name: `Message Edited in: ${newMessage.channel?.name}`, iconURL: newMessage.guild.iconURL({ dynamic: true }) })
                        .setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`<#${newMessage.channel?.id}>\n[Click here to jump to the message](${newMessage.url})\n**Before:** ${oldContent}\n**After:** ${newContent}`)
                    )
                }
            })
            //Roles
            .on('roleCreate', async role => {
                let hook = await checkWebhokk(role.guild);
                if (hook != null) {
                    if (role.managed == true) {
                        send(hook, new MessageEmbed()
                            .setColor("GREEN")
                            .setAuthor({ name: `Bot role Created: ${role.name}`, iconURL: role.guild.iconURL({ dynamic: true }) })
                            .setDescription(`<@&${role.id}>`)
                            .setThumbnail(role.guild.iconURL({ dynamic: true }))
                            .addFields(
                                { name: `Role ID:`, value: `${role.id}` },
                                { name: `Created at:`, value: `${role.createdAt}` },
                                { name: `Position:`, value: `${role.position}` },
                                { name: `Permissions:`, value: `Allowed:\n\`\`\`${role.permissions.toArray().join(', ')}\`\`\`` },
                            )
                        )
                    }
                    else {
                        let log = await checkLog(role.guild, 'ROLE_CREATE');
                        if (log) {
                            send(hook, new MessageEmbed()
                                .setColor("GREEN")
                                .setAuthor({ name: `Role Created: ${role.name}`, iconURL: role.guild.iconURL({ dynamic: true }) })
                                .setDescription(`<@&${role.id}>`)
                                .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                                .addFields(
                                    { name: `Created by:`, value: `${log.executor.tag}` },
                                    { name: `Role ID:`, value: `${role.id}` },
                                    { name: `Created at:`, value: `${role.createdAt}` },
                                    { name: `Position:`, value: `${role.position}` },
                                    { name: `Permissions:`, value: `Allowed:\n\`\`\`${role.permissions.toArray().join(', ')}\`\`\`` },
                                )
                            )
                        }
                    }
                }
            })
            .on('roleDelete', async role => {
                if (role.type == 'DM' || role.type == 'GROUP_DM') return;
                let hook = await checkWebhokk(role.guild);
                if (hook != null) {
                    if (role.managed == true) {
                        send(hook, new MessageEmbed()
                            .setColor("RED")
                            .setAuthor({ name: `Bot role Deleted: ${role.name}`, iconURL: role.guild.iconURL({ dynamic: true }) })
                            .setThumbnail(role.guild.iconURL({ dynamic: true }))
                            .addFields(
                                { name: `Role ID:`, value: `${role.id}` },
                                { name: `Created at:`, value: `${role.createdAt}` },
                            )
                        )
                    }
                    else {
                        let log = await checkLog(role.guild, 'ROLE_DELETE');
                        if (log) {
                            send(hook, new MessageEmbed()
                                .setColor("RED")
                                .setAuthor({ name: `Role Deleted: ${role.name}`, iconURL: role.guild.iconURL({ dynamic: true }) })
                                .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                                .addFields(
                                    { name: `Deleted by:`, value: `${log.executor.tag}` },
                                    { name: `Role ID:`, value: `${role.id}` },
                                    { name: `Created at:`, value: `${role.createdAt}` },
                                )
                            )
                        }
                    }
                }
            })
            .on('roleUpdate', async (oldRole, newRole) => {
                if (newRole.type == 'DM' || newRole.type == 'GROUP_DM') return;
                let hook = await checkWebhokk(newRole.guild);
                if (hook != null) {
                    let log = await checkLog(newRole.guild, 'ROLE_UPDATE');
                    if (log) {
                        let text = compareRole(oldRole, newRole);
                        if (text != null) {
                            send(hook, new MessageEmbed()
                                .setColor("BLUE")
                                .setAuthor({ name: `Role Updated: ${newRole.name} by ${log.executor.tag}`, iconURL: newRole.guild.iconURL({ dynamic: true }) })
                                .setDescription(`<@&${newRole.id}>`)
                                .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                                .setDescription(text)
                            )
                        }
                    }
                }
            })
            //Webhook
            .on('webhookUpdate', async channel => {
                if (channel.type == 'DM' || channel.type == 'GROUP_DM') return;
                let hook = await checkWebhokk(channel.guild);
                if (hook != null) {
                    let log = await checkLog(channel.guild, null);
                    if (log.actionType == 'CREATE') {
                        send(hook, new MessageEmbed()
                            .setColor("GREEN")
                            .setAuthor({ name: `Webhook Created in: ${channel.name}`, iconURL: channel.guild.iconURL({ dynamic: true }) })
                            .setDescription(`<#${channel.id}>`)
                            .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: `Webhook Name:`, value: `${log.target.name}` },
                                { name: `Webhook ID:`, value: `${log.id}` },
                                { name: `Created by:`, value: `${log.executor.tag}` },
                            )
                        )
                    }
                    else if (log.actionType == 'DELETE') {
                        send(hook, new MessageEmbed()
                            .setColor("RED")
                            .setAuthor({ name: `Webhook Deleted in: ${channel.name}`, iconURL: channel.guild.iconURL({ dynamic: true }) })
                            .setDescription(`<#${channel.id}>`)
                            .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: `Deleted by:`, value: `${log.executor.tag}` },
                                { name: `Webhook ID:`, value: `${log.id}` },
                                { name: `Webhook Name:`, value: `${log.target.name}` },
                            )
                        )
                    }
                    else if (log.actionType == 'UPDATE') {
                        send(hook, new MessageEmbed()
                            .setColor("BLUE")
                            .setAuthor({ name: `Webhook Edited in: ${channel.name}`, iconURL: channel.guild.iconURL({ dynamic: true }) })
                            .setDescription(`<#${channel.id}>`)
                            .setThumbnail(log.executor.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                { name: `Edited by:`, value: `${log.executor.tag}` },
                                { name: `Webhook ID:`, value: `${log.id}` },
                                { name: `Webhook Name:`, value: `${log.target.name}` },
                            )
                        )
                    }
                }
            })

        function compareChannel(oldChannel, newChannel) {
            //needs: name, nsfw, type
            let { name, nsfw, parent } = oldChannel;
            let returnText = '';

            if (name != newChannel.name) returnText += `**Name Changed:**\n*Before*: ${name}\n*After*: ${newChannel.name}\n`
            if (nsfw != newChannel.nsfw) returnText += `**NSFW state Changed:**\n*Before*: ${nsfw == true ? 'Yes' : 'No'}\n*After*: ${newChannel.nsfw == true ? 'Yes' : 'No'}\n`
            if (parent != newChannel.parent) returnText += `**Category Changed:**\n*Before*: ${parent.name}\n*After*: ${newChannel.parent.name}\n`
            let te = comparePermission(oldChannel.permissionOverwrites.cache, newChannel.permissionOverwrites.cache);
            if (te != null) returnText += te;

            if (returnText == '') return null;
            return returnText;
        }
        function compareEmoji(oldEmoji, newEmoji) {
            if (oldEmoji.name == newEmoji.name) {
                return null;
            }
            else {
                return `**Name Changed:**\n*Before*: ${oldEmoji.name}\n*After*: ${newEmoji.name}`
            }
        }
        function compareRole(oldRole, newRole) {
            //needs: name, nsfw, type
            let { name, mentionable } = oldRole;
            let returnText = '';
            let permText = '';

            if (name != newRole.name) returnText += `**Name Changed:**\n*Before*: ${name}\n*After*: ${newRole.name}\n`
            if (mentionable != newRole.mentionable) returnText += `**Mentionable:**\n*Before*: ${mentionable == true ? 'Yes' : 'No'}\n*After*: ${newRole.mentionable == true ? 'Yes' : 'No'}\n`
            let oldPerm = oldRole.permissions.toArray();
            let newPerm = newRole.permissions.toArray();
            for (const perm of oldPerm) {
                let index = newPerm.indexOf(perm);
                if (index == -1) {
                    permText += `${perm} ✅ > ❌\n`
                }
            }
            for (const perm of newPerm) {
                let index = oldPerm.indexOf(perm);
                if (index == -1) {
                    permText += `${perm} ❌ > ✅\n`
                }
            }
            if (permText != '') returnText += `**Permissions:**\n${permText}`;

            if (returnText == '') return null;
            return returnText;
        }
        function compareGuildMember(oldMember, newMember) {
            let { nickname, roles } = oldMember;
            let oldAvt = oldMember.displayAvatarURL({ dynamic: true });
            let newAvt = newMember.displayAvatarURL({ dynamic: true });
            let oldRoles = [];
            let newRole = [];
            for (const role of roles.cache) {
                if (role[1].name != '@everyone') {
                    oldRoles.push(role[0]);
                }
            }
            for (const role of newMember.roles.cache) {
                if (role[1].name != '@everyone') {
                    newRole.push(role[0]);
                }
            }
            let addedRoles = [];
            let removedRoles = [];
            for (const role of oldRoles) {
                if (newRole.indexOf(role) == -1) removedRoles.push(`<@&${role}>`)
            }
            for (const role of newRole) {
                if (oldRoles.indexOf(role) == -1) addedRoles.push(`<@&${role}>`)
            }
            let returnText = '';
            let permText = '';

            if (nickname != newMember.nickname) returnText += `**Nickname Changed:**\n*Before*: ${nickname == null ? 'None' : nickname}\n*After*: ${newMember.nickname == null ? 'None' : newMember.nickname}\n`
            if (oldAvt != newAvt) returnText += `**Server Avatar Changed:**\n*Before*:\n[[here](${oldAvt})]\n*After*:\n[[here](${newAvt})]\n`
            if (addedRoles.length > 0) returnText += `**Role Added:**\n${addedRoles.join(', ')}\n`
            if (removedRoles.length > 0) returnText += `**Role Removed:**\n${removedRoles.join(', ')}\n`
            let oldPerm = oldMember.permissions.toArray();
            let newPerm = newMember.permissions.toArray();
            for (const perm of oldPerm) {
                let index = newPerm.indexOf(perm);
                if (index == -1) {
                    permText += `${perm} ✅ > ❌\n`
                }
            }
            for (const perm of newPerm) {
                let index = oldPerm.indexOf(perm);
                if (index == -1) {
                    permText += `${perm} ❌ > ✅\n`
                }
            }
            if (permText != '') returnText += `**Permissions:**\n${permText}`;

            if (returnText == '') return null;
            return returnText;
        }
        function compareUser(oldUser, newUser) {
            let { username, discriminator } = oldUser;
            let oldAvt = oldUser.displayAvatarURL({ dynamic: true });
            let newAvt = newUser.displayAvatarURL({ dynamic: true });
            let returnText = '';

            if (username != newUser.username) returnText += `**Username Changed:**\n*Before*: ${username}\n*After*: ${newUser.username}\n`
            if (discriminator != newUser.discriminator) returnText += `**Discriminator Changed:**\n*Before*: ${discriminator}\n*After*: ${newUser.discriminator}\n`
            if (oldAvt != newAvt) returnText += `**User Avatar Changed:**\n**Before**:\n[[here](${oldAvt})]\n**After**:\n[[here](${newAvt})]\n`

            if (returnText == '') return null;
            return returnText;
        }
        function compareGuild(oldGuild, newGuild) {
            let { name, defaultMessageNotifications, systemChannel, afkChannel, afkTimeout, verificationLevel, mfaLevel, nsfwLevel } = oldGuild;
            let oldIcon = oldGuild.iconURL({ dynamic: true });
            let newIcon = newGuild.iconURL({ dynamic: true });
            let oldBanner = oldGuild.bannerURL({ dynamic: true });
            let newBanner = newGuild.bannerURL({ dynamic: true });
            let returnText = '';

            if (name != newGuild.name) returnText += `**Server Name Changed:**\n*Before*: ${name}\n*After*: ${newGuild.name}\n`
            if (oldIcon != newIcon) returnText += `**Server Icon Changed:**\n*Before*:\n[[here](${oldIcon == null ? 'None' : oldIcon})]\n*After*:\n[[here](${newIcon == null ? 'None' : newIcon})]\n`
            if (oldBanner != newBanner) returnText += `**Server Banner Changed:*Before*:\n[[here](${oldBanner == null ? 'None' : oldBanner})]\n*After*:\n[[here](${newBanner == null ? 'None' : newBanner})]\n`
            if (defaultMessageNotifications != newGuild.defaultMessageNotifications) returnText += `**Default Message Notifications Changed:**\n*Before*: ${defaultMessageNotifications == 'ALL_MESSAGES' ? 'All Messages' : 'Only Mentions'}\n*After*: ${newGuild.defaultMessageNotifications == 'ALL_MESSAGES' ? 'All Messages' : 'Only Mentions'}\n`
            if (systemChannel != newGuild.systemChannel) returnText += `**Server System Channel Changed:**\n*Before*: ${systemChannel == null ? 'None' : systemChannel}\n*After*: ${newGuild.systemChannel == null ? 'None' : newGuild.systemChannel}\n`
            if (afkChannel != newGuild.afkChannel) returnText += `**Server Inactive Channel Channel Changed:**\n*Before*: ${afkChannel == null ? 'None' : afkChannel.name}\n*After*: ${newGuild.afkChannel == null ? 'None' : newGuild.afkChannel.name}\n`
            if (afkTimeout != newGuild.afkTimeout) returnText += `**Server Inactive Timeout Changed:**\n*Before*: ${afkTimeout} seconds\n*After*: ${newGuild.afkTimeout} seconds\n`
            if (verificationLevel != newGuild.verificationLevel) returnText += `**Verification Level Changed:**\n*Before*: ${verificationLevel}\n*After*: ${newGuild.verificationLevel}\n`
            if (nsfwLevel != newGuild.nsfwLevel) returnText += `**NSFW Level Changed:**\n*Before*: ${nsfwLevel}\n*After*: ${newGuild.nsfwLevel}\n`
            if (mfaLevel != newGuild.mfaLevel) returnText += `**MFA Level Changed:**\n*Before*: ${mfaLevel == 'NONE' ? 'None' : 'Elevated'}\n*After*: ${newGuild.mfaLevel == 'NONE' ? 'None' : 'Elevated'}\n`

            if (returnText == '') return null;
            return returnText;
        }

        function checkPermission(permissionOverwrites) {
            let returnText = '';

            for (const perm of permissionOverwrites) {
                let tempText = '';
                if (perm[1].type == 'role') {
                    tempText += `**For** <@&${perm[0]}>\n`
                }
                else {
                    tempText += `**For** <@${perm[0]}>\n`
                }
                let allow = perm[1].allow.toArray();
                let deny = perm[1].deny.toArray();

                for (const al of allow) {
                    tempText += `${al} ✅\n`
                }
                for (const dy of deny) {
                    tempText += `${dy} ❌\n`
                }

                if (tempText.length > 31) returnText += tempText;
            }

            if (returnText == '') returnText = 'None';
            return returnText;
        }
        function comparePermission(oldPermissionOverwrites, newPermissionOverwrites) {
            let returnText = '';
            let editPermText = '';
            let addNewPermText = '';
            let removePermText = '';
            let old = [];

            for (const perm of oldPermissionOverwrites) {
                old.push({ id: perm[0], type: perm[1].type, allowPerm: perm[1].allow, denyPerm: perm[1].deny });
            }
            for (const perm of newPermissionOverwrites) {
                let oldPerm = old.filter(o => o.id == perm[0]);
                if (oldPerm.length < 1) {
                    //Added new Perm
                    let tempAddNewPermText = '';
                    if (perm[1].type == 'role') {
                        tempAddNewPermText += `**For** <@&${perm[0]}>\n`
                    }
                    else {
                        tempAddNewPermText += `**For** <@${perm[0]}>\n`
                    }
                    let allow = perm[1].allow.toArray();
                    let deny = perm[1].deny.toArray();

                    for (const al of allow) {
                        tempAddNewPermText += `${al} ✅\n`
                    }
                    for (const dy of deny) {
                        tempAddNewPermText += `${dy} ❌\n`
                    }

                    if (tempAddNewPermText.length > 31) addNewPermText += tempAddNewPermText;
                }
                else {
                    let tempEditPermText = '';
                    if (perm[1].type == 'role') {
                        tempEditPermText += `**For** <@&${perm[0]}>\n`
                    }
                    else {
                        tempEditPermText += `**For** <@${perm[0]}>\n`
                    }
                    let oldAllowPerm = oldPerm[0].allowPerm.toArray();
                    let oldDenyPerm = oldPerm[0].denyPerm.toArray();
                    let newAllowPerm = perm[1].allow.toArray();
                    let newDenyPerm = perm[1].deny.toArray();

                    for (const oap of oldAllowPerm) {
                        let index = newDenyPerm.indexOf(oap);
                        if (index == -1) {
                            //Went to none/No changes
                            let ind = newAllowPerm.indexOf(oap);
                            if (ind == -1) {
                                tempEditPermText += `${oap} ✅ > ⬜\n`
                            }
                            else {
                                newAllowPerm.splice(ind, 1);
                            }
                        }
                        else {
                            //Denyed Perm
                            tempEditPermText += `${oap} ✅ > ❌\n`
                            newDenyPerm.splice(index, 1);
                        }
                    }
                    for (const odp of oldDenyPerm) {
                        let index = newAllowPerm.indexOf(odp);
                        if (index == -1) {
                            //Went to none/No changes
                            let ind = newDenyPerm.indexOf(odp);
                            if (ind == -1) {
                                tempEditPermText += `${odp} ❌ > ⬜\n`
                            }
                            else {
                                newDenyPerm.splice(ind, 1);
                            }
                        }
                        else {
                            //Allowed Perm
                            tempEditPermText += `${odp} ❌ > ✅\n`
                            newAllowPerm.splice(index, 1);
                        }
                    }
                    for (const nap of newAllowPerm) {
                        tempEditPermText += `${nap} ⬜ > ✅\n`
                    }
                    for (const nnp of newDenyPerm) {
                        tempEditPermText += `${nnp} ⬜ > ❌\n`
                    }

                    if (tempEditPermText.length > 31) editPermText += tempEditPermText;

                    let index = old.indexOf(oldPerm[0]);
                    old.splice(index, 1);
                }
            }

            if (old.length > 0) {
                //Removed Perms
                for (const od of old) {
                    removePermText += `${od.type == 'role' ? `<@&${od.id}>\n` : `<@${od.id}>\n`}`
                }
            }

            returnText += `${addNewPermText != '' ? `**Added new Permission Overwrites**\n${addNewPermText}` : ''}${removePermText != '' ? `**Removed Permission Overwrites for**\n${removePermText}` : ''}${editPermText != '' ? `**Edited Permission**\n${editPermText}` : ''}`

            if (returnText == '') returnText = null;
            return returnText;
        }
    }
}