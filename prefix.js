const { getPrefix } = require("./handleMongoDB");
let prefixes = [];

module.exports = {
    get: guild => {
        let guildPrefix = prefixes.filter(g => g.guild == guild)[0];
        if (guildPrefix != undefined) {
            return guildPrefix.prefix;
        }
        else {
            return '-';
        }
    },
    update: async () => {
        let pre = await getPrefix();
        if (pre != null) prefixes = pre;
    },
}