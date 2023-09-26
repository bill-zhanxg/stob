const { Permissions, MessageEmbed } = require("discord.js")

module.exports = {
    name: "mute",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.reply("You don't have permission to do this!");
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.channel.send("I do not have permission to mute members!");
        if (args[0] == null) return message.reply("Usage: -mute <user> {reason}");
        let usermsg = args[1] == null ? "No reason provide" : args.splice(1).join(" ");

        if (message.mentions.members.first()) {
            mute(message.mentions.members.first(), usermsg);
        }
        else {
            try {
                let user = await message.guild.members.fetch(args[0])
                mute(user, usermsg);
            }
            catch {
                message.channel.send('Please enter a valid member id!');
            }
        }

        async function mute(member, reason) {
            //check if the role exist
            let role = await message.guild.roles.cache.find(role => role.name === "mute role for stob");
            if (role == undefined) {
                role = await createRole().catch(() => message.channel.send(`Error creating the role`));
            }
            changePerms(role);
            if (member.roles.cache.has(role.id)) return message.reply('That user is already being muted');
            giveRole(member, role).then(() => {
                let embed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`User ${member.user.tag} has been muted. Reason: ${reason}`);

                message.channel.send({ embeds: [embed] });
            }).catch(() => message.channel.send("There is an error while give user the role"));
        }

        async function createRole() {
            await message.channel.send("Createing a mute role...")
            let createdrole = await message.guild.roles.create({
                name: 'mute role for stob',
                color: 'RED',
                reason: 'This role has being created for the -mute command',
                permissions: [],
            });

            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`✅ Successfully created the mute role: \`mute role for stob\``)
                ]
            });

            return createdrole;
        }

        function changePerms(role) {
            message.guild.channels.cache.forEach(r => {
                r.permissionOverwrites.create(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    CONNECT: false,
                    SPEAK: false,
                })
            });
        }

        async function giveRole(member, role) {
            member.roles.add(role);
        }
    }
}