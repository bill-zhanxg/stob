const fs = require('fs');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');

module.exports = {
    reload: async () => {
        const commands = [];

        commands.push((new ContextMenuCommandBuilder().setName('Explain Code').setType(3)).toJSON())

        const commandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./slashCommands/${file}`);
            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '9' }).setToken(config.clientToken);
        try {
            if (config.deleteSlashCommand == true) {
                await rest.get(Routes.applicationCommands(config.clientID))
                    .then(data => {
                        for (const command of data) {
                            const deleteUrl = `${Routes.applicationCommands(config.clientID)}/${command.id}`;
                            rest.delete(deleteUrl)
                        }
    
                        console.log('Successfully deleted all global slash commands.');
                    });
            }

            await rest.put(
                Routes.applicationCommands(config.clientID),
                { body: commands },
            );

            console.log('Successfully reloaded all slash commands.');
        } catch (error) {
            console.error(error);
        }
    }
}