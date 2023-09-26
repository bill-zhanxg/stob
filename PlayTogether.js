const fetch = require('node-fetch');

const defaultApplications = {
    "watch_together": "880218394199220334",
    "poker_night": "755827207812677713",
    "betrayal": "773336526917861400",
    "fishington": "814288819477020702",
    "chess_in_the_park": "832012774040141894",
    "sketch_heads": "902271654783242291",
    "letter_league": "879863686565621790",
    "wordsnacks": "879863976006127627",
    "spellcast": "852509694341283871",
    "checkers_in_the_park": "832013003968348200",
    "ocho": "832025144389533716",
};


/**
 * Class symbolizing a YoutubeTogether
 * @template {Object.<string, string>} T
 */
class PlayTogether {
    /**
     * Create a new YoutubeTogether
     * @param {string} client Discord.Client
     * @param {T} applications
     * @example
     * const Discord = require('discord.js');
     * const client = new Discord.Client();
     * const { PlayTogether } = require('@miudiscord/together');
     *
     * client.together = new PlayTogether(client);
     *
     * client.on('message', async message => {
     *      if (message.content === 'start') {
     *          client.together.generateTogetherCode(message.member.voice.channelID, 'youtube').then(async invite => {
     *              return message.channel.send(`${invite.code}`);
     *           });
     *      };
     * });
     *
     * client.login('your token');
     */
    constructor(client, applications = defaultApplications) {
        if (!client) {
            throw new SyntaxError('Invalid Discord.Client !');
        };

        /**
         * Discord.Client
         */
        this.client = client;
        this.applications = { ...defaultApplications, ...applications };
    };

    /**
     * Create a Youtube Together invite code (note: send the invite using markdown link)
     * @param {string} voiceChannelId 
     * @param {keyof (defaultApplications & T)} option
     * @example
     * client.on('message', async message => {
     *      if (message.content === 'start') {
     *          client.together.generateTogetherCode(message.member.voice.channelID, 'youtube').then(async invite => {
     *              return message.channel.send(`${invite.code}`); // Click the blue link
     *           });
     *      };
     * });
     */
    async generateTogetherCode(voiceChannelId, option) {
        /**
         * @param {string} code The invite link (only use the blue link)
         */
        let returnData = {
            code: 'none'
        };
        if (option && this.applications[option.toLowerCase()]) {
            let applicationID = this.applications[option.toLowerCase()];
            try {
                await fetch(`https://discord.com/api/v8/channels/${voiceChannelId}/invites`, {
                    method: 'POST',
                    body: JSON.stringify({
                        max_age: 86400,
                        max_uses: 0,
                        target_application_id: applicationID,
                        target_type: 2,
                        temporary: false,
                        validate: null
                    }),
                    headers: {
                        'Authorization': `Bot ${this.client.token}`,
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                    .then(invite => {
                        if (invite.error || !invite.code) {
                            throw new Error('An error occured while retrieving data !');
                        };
                        returnData.code = `https://discord.com/invite/${invite.code}`
                    })
            } catch (err) {
                throw new Error('An error occured while starting Youtube together !');
            }
            return returnData;
        } else {
            throw new SyntaxError('Invalid option !');
        }
    };
};

module.exports = PlayTogether;