const { Collection } = require('discord.js');
const functions = require('../functions');

module.exports = {
  name: "allserver",
  aliases: [],
  run: async (client, message, args) => {
    if (message.author.id != "768367429973704714") return message.channel.send("Only the owner of this bot can user this command!");

    let guildCache = client.guilds.cache;
    let servers = functions.formatText('Server list' + guildCache.map(guild => guild.name).map((o, i) => `${i + 1}. **${o}**`).join('\n'));
    let count = guildCache.size;
    // Check if the bot is in 0 server
    if (count <= 0) return message.reply("I'm not even in any server, how can you even execute this command?");

    let msg
    let error;
    for (let text of servers) {
      // Check if there is an error. If so, break the loop.
      if (error) break;
      msg = await message.member.send(text).catch(err => { error = err; });
    }
    if (error) {
      message.channel.send("Failed!");
      console.log(`Failed sending all servers to the creator! Error: ${error.message}`);
      return;
    }
    if (!msg) {
      message.channel.send("Variable `msg` is null!");
      console.log("Variable 'msg' is null! Stop executing...");
      return;
    }
    message.channel.send("Check dm, dmed!");

    const filter = m => m.author.id == message.member.id;

    if (args[0] == "1") {

      // Show members:
      // Create listener
      msg.channel.awaitMessages({ max: 1, time: 60000, errors: ["time"], filter }).then(async collected => {
        if (collected.size == 0) return;
        let content = parseInt(collected.first()?.content);
        // Check valid
        if (!content || content == NaN || !(content >= 0 && content <= count)) return message.member.send("Not a valid number");
        // If all valid, list all members and turn into string then format it
        let members = functions.formatText('Member List:\n\n' + (await guildCache.map(guild => guild.members)[content - 1].fetch()).toJSON().map((user, index) => `${index + 1}. **${user.user.username}#${user.user.discriminator}**, id: **${user.user.id}**${user.user.bot ? ', **ISBOT**' : ''}`).join('\n'));

        if (members.length <= 0) return message.member.send('No member in this server!');
        for (let text of members) {
          msg = await message.member.send(text).catch(() => { });
        }
      }).catch(err => {
        // Check if it's timeup
        if (err instanceof Collection) {
          message.member.send("You didn't reply in time, sad");
        }
        else {
          console.log(err);
          message.member.send(`Oops, there is an error: ${err.message}`);
        }
      });
    }
    else if (args[0] == "2") {
      
      // Show channels:
      // Create listener
      msg.channel.awaitMessages({ max: 1, time: 60000, errors: ["time"], filter }).then(async collected => {
        if (collected.size == 0) return;
        let content = parseInt(collected.first()?.content);
        // Check valid
        if (!content || content == NaN || !(content >= 0 && content <= count)) return message.member.send("Not a valid number");
        // If all valid, list all channels and turn into string then format it
        let channels = functions.formatText('Channel List:\n\n' + (await guildCache.map(guild => guild.channels)[content - 1].fetch()).toJSON().map((channel, index) => `${index + 1}. **${channel.name}**, id: **${channel.id}**, type: **${channel.type}**`).join('\n'));

        if (channels.length <= 0) return message.member.send('No channel in this server!');
        for (let text of channels) {
          msg = await message.member.send(text).catch(() => { });
        }
      }).catch(err => {
        // Check if it's timeup
        if (err instanceof Collection) {
          message.member.send("You didn't reply in time, sad");
        }
        else {
          console.log(err);
          message.member.send(`Oops, there is an error: ${err.message}`);
        }
      });
    }
    else if (args[0] == "3") {
      
      // Show roles:
      // Create listener
      msg.channel.awaitMessages({ max: 1, time: 60000, errors: ["time"], filter }).then(async collected => {
        if (collected.size == 0) return;
        let content = parseInt(collected.first()?.content);
        // Check valid
        if (!content || content == NaN || !(content >= 0 && content <= count)) return message.member.send("Not a valid number");
        // If all valid, list all roles and turn into string then format it
        let roles = functions.formatText('Role List:\n\n' + (await guildCache.map(guild => guild.roles)[content - 1].fetch()).toJSON().map((roles, index) => `${index + 1}. **${roles.name}**, id: **${roles.id}**${roles.managed ? ', **MANAGED**' : ''}`).join('\n'));

        if (roles.length <= 0) return message.member.send('No role in this server!');
        for (let text of roles) {
          msg = await message.member.send(text).catch(() => { });
        }
      }).catch(err => {
        // Check if it's timeup
        if (err instanceof Collection) {
          message.member.send("You didn't reply in time, sad");
        }
        else {
          console.log(err);
          message.member.send(`Oops, there is an error: ${err.message}`);
        }
      });
    }
  }
}