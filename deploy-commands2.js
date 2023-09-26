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

        const rest = new REST({ version: '9' }).setToken(config.clientToken2);
        try {
            if (config.deleteSlashCommand == true) {
                await rest.get(Routes.applicationCommands(config.clientID2))
                    .then(data => {
                        for (const command of data) {
                            const deleteUrl = `${Routes.applicationCommands(config.clientID2)}/${command.id}`;
                            rest.delete(deleteUrl)
                        }
    
                        console.log('Successfully deleted all global slash commands (Stob Backup).');
                    });
            }

            await rest.put(
                Routes.applicationCommands(config.clientID2),
                { body: commands },
            );

            console.log('Successfully reloaded all slash commands (Stob Backup).');
        } catch (error) {
            console.error(error);
        }
    }
}