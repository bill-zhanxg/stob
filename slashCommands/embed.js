const { MessageEmbed, MessageActionRow, MessageButton, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const urlExists = require('url-exists');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Send an embed!')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send the embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('The color on the left side of the embed')
                .addChoices(
                    { name: 'Default', value: 'DEFAULT' },
                    { name: 'Random', value: 'RANDOM' },
                    { name: 'White', value: 'WHITE' },
                    { name: 'Aqua', value: 'AQUA' },
                    { name: 'Green', value: 'GREEN' },
                    { name: 'Blue', value: 'BLUE' },
                    { name: 'Yellow', value: 'YELLOW' },
                    { name: 'Purple', value: 'PURPLE' },
                    { name: 'Luminous Vivid Pink', value: 'LUMINOUS_VIVID_PINK' },
                    { name: 'Fuchsia', value: 'FUCHSIA' },
                    { name: 'Gold', value: 'GOLD' },
                    { name: 'Orange', value: 'ORANGE' },
                    { name: 'Red', value: 'RED' },
                    { name: 'Grey', value: 'GREY' },
                    { name: 'Navy', value: 'NAVY' },
                    { name: 'Dark Aqua', value: 'DARK_AQUA' },
                    { name: 'Dark Green', value: 'DARK_GREEN' },
                    { name: 'Dark Blue', value: 'DARK_BLUE' },
                    { name: 'Dark Purple', value: 'DARK_PURPLE' },
                    { name: 'Dark Vivid Pink', value: 'DARK_VIVID_PINK' },
                    { name: 'Dark Gold', value: 'DARK_GOLD' },
                    { name: 'Dark Orange', value: 'DARK_ORANGE' },
                    { name: 'Dark Red', value: 'DARK_RED' },
                    { name: 'Dark Grey', value: 'DARK_GREY' },
                    { name: 'Darker Grey', value: 'DARKER_GREY' },
                )
                .setRequired(false))
        .addStringOption(option =>
            option.setName('author')
                .setDescription('The author of the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('authoricon')
                .setDescription('The icon URL of the author on the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('titleurl')
                .setDescription('The URL of the title on the embed that let people click the title')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description of the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('The image URL of the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footericon')
                .setDescription('The icon URL of the footer on the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('The image URL of the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('thumbnail')
                .setDescription('The image URL of the embed')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.editReply('You do not have permission to use this command');

        let options = interaction.options;
        let channel = options.getChannel('channel');
        if (channel.type == 'GUILD_CATEGORY') return interaction.editReply("I can't send message in category channel");
        if (channel.type == 'GUILD_STAGE_VOICE') return interaction.editReply("I can't send message in stage channel");

        let color = options.getString('color');
        let author = options.getString('author')?.replaceAll("\\n", '\n');
        let authorURL = options.getString('authoricon');
        let title = options.getString('title')?.replaceAll("\\n", '\n');
        let titleURL = options.getString('titleurl');
        let description = options.getString('description')?.replaceAll("\\n", '\n');
        let footer = options.getString('footer')?.replaceAll("\\n", '\n');
        let footerURL = options.getString('footericon');
        let image = options.getString('image');
        let thumbnail = options.getString('thumbnail');

        let embed = new MessageEmbed()
        if (author == null && title == null && description == null && footer == null) return interaction.editReply("I can't send an embed with no text!");
        if (author?.length + title?.length + description?.length + footer?.length > 6000) return interaction.editReply("Too many characters, max character allowed in an embed is 6000 characters!")

        if (color != null) embed.setColor(color);
        if (title != null) if (title.length > 256) {
            return interaction.editReply("Embed title must be less than 256 characters!");
        }
        else {
            embed.setTitle(title)
        };
        if (description != null) if (description.length > 4096) {
            return interaction.editReply("Embed description must be less than 4096 characters!");
        }
        else {
            embed.setDescription(description)
        };

        if (author != null) {
            if (author.length > 256) return interaction.editReply("Embed author must be less than 256 characters!");
            if (authorURL != null) {
                let isValid = await checkURL(authorURL).catch(console.error);
                if (isValid == true) {
                    embed.setAuthor({ name: author, iconURL: authorURL });
                }
                else {
                    return interaction.editReply("You didn't enter a valid URL for author icon");
                }
            }
            else {
                embed.setAuthor({ name: author });
            }
        }

        if (titleURL != null) {
            let isValid = await checkURL(titleURL).catch(console.error);
            if (isValid == true) {
                embed.setURL(titleURL);
            }
            else {
                return interaction.editReply("You didn't enter a valid URL for title URL");
            }
        }

        if (footer != null) {
            if (footer.length > 2048) return interaction.editReply("Embed footer must be less than 2048 characters!")
            if (footerURL != null) {
                let isValid = await checkURL(footerURL).catch(console.error);
                if (isValid == true) {
                    embed.setFooter({ text: footer, iconURL: footerURL });
                }
                else {
                    return interaction.editReply("You didn't enter a valid URL for footer icon");
                }
            }
            else {
                embed.setFooter({ text: footer });
            }
        }

        if (image != null) {
            let isValid = await checkURL(image).catch(console.error);
            if (isValid == true) {
                embed.setImage(image);
            }
            else {
                return interaction.editReply("You didn't enter a valid URL for image URL");
            }
        }

        if (thumbnail != null) {
            let isValid = await checkURL(thumbnail).catch(console.error);
            if (isValid == true) {
                embed.setThumbnail(thumbnail);
            }
            else {
                return interaction.editReply("You didn't enter a valid URL for thumbnail URL");
            }
        }

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('yes')
                    .setStyle('SUCCESS')
                    .setLabel('Yes')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('no')
                    .setStyle('DANGER')
                    .setLabel('No')
            )

        interaction.editReply({ content: 'Please check is this embed correct?', embeds: [embed], components: [row] });

        let fetched = await interaction.fetchReply();
        const filter = i => i.message.id == fetched.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000, max: 1 })
        collector.on('collect', async interaction2 => {
            if (interaction2.customId == 'yes') {
                await channel.send({ embeds: [embed] }).then(() => {
                    interaction.editReply({ content: `Embed sent to ${channel}`, embeds: [], components: [] });
                }).catch(err => {
                    if (channel.type == 'GUILD_VOICE' && err.message === 'Cannot send messages in a non-text channel') return interaction.editReply({ content: "Text In Voice isn't enabled in this server so I can't send message in voice channel", embeds: [], components: [] });
                    interaction.editReply({ content: `There is an error when I'm trying to send the embed, please make sure I have enough permission!`, embeds: [], components: [] });
                });
            }
            else {
                interaction.editReply({ content: 'Cancelled sending the embed', embeds: [], components: [] });
            }
        })
        collector.on('end', async collected => {
            if (collected.size < 1) interaction.editReply('Timeout... You took too long to just click a simple button!');
        })
    },
};

async function checkURL(url) {
    return new Promise((resolve, reject) => {
        urlExists(url, function (err, exists) {
            if (err) {
                reject(err);
            }
            else {
                resolve(exists);
            }
        })
    });
}