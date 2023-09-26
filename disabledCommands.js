const { getDisabledCommands } = require("./handleMongoDB");
let commands = [];

module.exports = {
    get: (guild) => {
        let guildDisabledCommands = commands.filter(g => g.guild == guild)[0];
        if (guildDisabledCommands != undefined) {
            return guildDisabledCommands.commands;
        }
        else {
            return [];
        }
    },
    update: async () => {
        let cmd = await getDisabledCommands();
        if (cmd != null) commands = cmd;
    },
}