const { Collection, Intents, Client, Permissions, MessageEmbed, WebhookClient } = require('discord.js');
const fs = require('fs');
const { PlayTogether } = require('./activity');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const prefix = require('./prefix');
const commands = require('./disabledCommands');
const { reload } = require('./deploy-commands');
const functions = require('./commands/functions');
const config = require('./config.json');
const axios = require('axios').default;
const levenshtein = require('js-levenshtein');
const { clearNumber, resetPrefix, resetCommand } = require('./handleMongoDB');
const util = require('./util.js');
const process = require('process');

const http = require('http');
const requestListener = function (req, res) {
	res.writeHead(200);
	res.end('Hello, World!');
};
const server = http.createServer(requestListener);
(() => {
	server.listen(8080);
})();

reload();
prefix.update();
commands.update();
clearNumber();
let phishingLinks = null;

axios
	.get('https://raw.githubusercontent.com/Discord-AntiScam/scam-links/main/list.json')
	.then(function (response) {
		// handle success
		phishingLinks = response.data;
		sendLog(
			'Successfully load all scam links',
			new MessageEmbed()
				.setColor('YELLOW')
				.setTitle('Stob successfully load all scam links')
				.setFooter({ text: `At ${getAusDateNow()}` }),
		);
	})
	.catch(function (error) {
		// handle error
		sendLog(
			`Fail load scam links, error:\n${error.stack}`,
			new MessageEmbed()
				.setColor('RED')
				.setTitle(`Stob fail load scam links with error: \`\`\`${error.stack}\`\`\``)
				.setFooter({ text: `At ${getAusDateNow()}` }),
		);
	});

let client = new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_WEBHOOKS,
	],
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.aliases = new Collection();
client.queue = new Map();
client.together = new PlayTogether(client);
client.silent = [];
client.invites = {};
client.timeouts = [];
client.distube = new DisTube(client, {
	plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new YtDlpPlugin()],
	emitNewSongOnly: false,
	leaveOnEmpty: true,
	leaveOnFinish: true,
	leaveOnStop: true,
	savePreviousSongs: true,
	searchSongs: 0,
	youtubeCookie:
		'VISITOR_INFO1_LIVE=2NBztbdkBjA; HSID=AmqLOGTnyzGmcPYh1; SSID=AYCTaXrCT-IbnVgBK; APISID=rVnMd2NXf_4Gl1dV/AMFbTuIp2fgHWco5e; SAPISID=Js_VzPCofVgWLaNN/AJTgSoGHauqeEEZeI; __Secure-1PAPISID=Js_VzPCofVgWLaNN/AJTgSoGHauqeEEZeI; __Secure-3PAPISID=Js_VzPCofVgWLaNN/AJTgSoGHauqeEEZeI; LOGIN_INFO=AFmmF2swRgIhAN4zTMvq0IDIOPl4cJdtSrv3-Np2S6yQQJ24FhBHXn7hAiEApOmTYSwUihr6V-ZPxOdVCqTy_e9V6XcKkpsLULcyvA4:QUQ3MjNmemQ5LXlxUnIzeVFJa0ZoeHI2bXlQUWU1aVFvQmt3aWRrcGJPb0ZiSk1VVHhBYmJoWFhld1EwamdNWjlvcUZlVnRaOEJkY3V5SHNwQ2xCVEdKSzYzczQ3SUMzc29vVUdNMTBwYzFlTjAtNnVXMzRkRTIxNmhoUlRDUUllS01fNHA3ZnZ3M1NObVBQTmh5WFdUT0xrOUxpWmlYQTdB; PREF=f4=4000000&tz=Australia.Sydney&f5=30000; SID=GAjR3U9XpWTKFETiETMj212eRJJFG7F0NNh6YiFnzNBwIImugbd4v_7Vl60Ty808Td0lGA.; __Secure-1PSID=GAjR3U9XpWTKFETiETMj212eRJJFG7F0NNh6YiFnzNBwIImubXgLIcmcXIdHN_Fecpsg6g.; __Secure-3PSID=GAjR3U9XpWTKFETiETMj212eRJJFG7F0NNh6YiFnzNBwIImuxVPkFeM3oxPNuio9dM4nPQ.; YSC=9qGLl2u0d3A; CONSISTENCY=AGDxDePVEMRzTnGy2AEEftHAh7YJPJbB5JgBEqYRlO_H3xgmmbD7LsG5aAqClk8BHZGKM8SxY3hGHb1mFEiXSIdQiQB3jaDltWtp79yAcz-5Vagp-gC8AKHGiMU; SIDCC=AJi4QfH0raURVaAjXI9ugeHfe9gwB0dJvLmu0pMw2nPVZVryjuLqedCDCpASKFvoBALRsr62bQ; __Secure-3PSIDCC=AJi4QfH5yn2yevbu1RQUBwOiM-y0AhGsi9J2i1NvJvjlfsws7wQhPaiXJYhcJPbgLxguE7z6tDM',
	youtubeDL: false,
	updateYouTubeDL: true,
	customFilters: {
		funny: 'bass=g=10,apulsator=bpm=300:timing=bpm:hz=1,asubboost',
	},
	searchCooldown: 60,
	emptyCooldown: 600,
	nsfw: false,
	emitAddListWhenCreatingQueue: false,
	emitAddSongWhenCreatingQueue: false,
});

functions.sendLogs(client);

function setActivity() {
	client.user.setActivity(`-h/-help in ${client.guilds.cache.size} Servers`, {
		type: 'LISTENING',
	}); // STREAMING, WATCHING, CUSTOM_STATUS, PLAYING, COMPETING, LISTENING
}

client.on('ready', async () => {
	setActivity();

	// on bot start, fetch all guilds and fetch all invites to store
	for (const coll of client.guilds.cache) {
		const guild = coll[1];
		if (!guild.me.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) continue;
		guild.invites.fetch().then((guildInvites) => {
			guildInvites.each((guildInvite) => {
				client.invites[guildInvite.code] = guildInvite.uses;
			});
		});
	}

	sendLog(
		`Logged in as ${client.user.tag}!`,
		new MessageEmbed()
			.setColor('YELLOW')
			.setTitle(`Stob client active as ${client.user.tag}!`)
			.setFooter({ text: `At ${getAusDateNow()}` }),
	);
});

client.on('rateLimit', (rateLimitData) => {
	console.log(new Date().toLocaleString().split(',')[1].split('GMT')[0].trim());
	console.log(rateLimitData);
	let timeout = rateLimitData.timeout;
	let arr = rateLimitData.path.split('/');
	let channelId = arr[2];
	let msgId = arr[4];
	client.timeouts.push({ channel: channelId, time: timeout, message: msgId });
});

setInterval(() => {
	client.timeouts = [];
}, 10800000);

const commandFiles = fs.readdirSync('./slashCommands').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./slashCommands/${file}`);
	client.slashCommands.set(command.data.name, command);
}

let catr = ['music', 'mod', 'fun'];

catr.forEach((folder) => {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		if (!command.name || !command.aliases) {
			sendLog(
				`No Command Name & Command Aliases In ${file}, skipping it`,
				new MessageEmbed()
					.setColor('YELLOW')
					.setTitle(`No Command Name & Command Aliases In ${file}, skipping it`)
					.setFooter({ text: `At ${getAusDateNow()}` }),
			);
			continue;
		}
		// if (folder === 'music') command.music = true;
		client.commands.set(command.name, command);
		command.aliases.forEach((aliase) => client.aliases.set(aliase, command.name));
	}
});

client.on('interactionCreate', async (interaction) => {
	interactionHanlder(interaction, false);
});

client.on('guildCreate', (guild) => {
	sendLog(
		`I have join a new guild: ${guild.name}`,
		new MessageEmbed()
			.setColor('AQUA')
			.setTitle(`I have join a new guild: ${guild.name}`)
			.setFooter({ text: `At ${getAusDateNow()}` }),
	);
	setActivity();
});
client.on('guildDelete', async (guild) => {
	sendLog(
		`I have being kicked from a guild: ${guild.name}`,
		new MessageEmbed()
			.setColor('RED')
			.setTitle(`I have being kicked from a guild: ${guild.name}`)
			.setFooter({ text: `At ${getAusDateNow()}` }),
	);
	resetPrefix(guild.id);
	resetCommand(guild.id);
	prefix.update();
	commands.update();
	setActivity();
});

const requirePerms = new Permissions([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS]);

let cooldown = [];

client.on('messageCreate', async (message) => {
	if (message.author.bot || !message.guild || message.webhookId) return;
	checkScam(message);
	let Prefix = prefix.get(message.guild.id);
	let disabledCommands = commands.get(message.guild.id);

	if (message.mentions.members.first() && message.mentions.members.first().id == client.user.id) {
		if (message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) {
			message
				.reply(`My prefix in this server is \`${Prefix}\`, use \`${Prefix}h\` to see how to use me`)
				.catch(() => {});
		}
	}

	if (!message.content.startsWith(Prefix)) return;

	let args = message.content.slice(Prefix.length).trim().split(/ +/g);
	let cmd = args.shift().toLowerCase();

	let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

	if (!command) return;

	if (disabledCommands.indexOf(command.name) != -1)
		return message.reply("I'm sorry but this command got disabled by the server owner!");

	if (cooldown.indexOf(message.author.id) != -1) return message.reply('Please do not spam commands');

	if (!message.channel.permissionsFor(message.guild.me).has(requirePerms)) {
		if (message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) {
			message.reply('I need the permission to send embeds, please give me send embed permission!');
		}
		return;
	}

	logCommands(
		0,
		message.author.tag,
		message.member.displayAvatarURL({ dynamic: true }),
		cmd,
		message.guild.name,
		message.channel.id,
	);

	if (command.music)
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor('BLUE')
					.setTitle('Music Command for Stob deprecated!')
					.setDescription(
						'Stob music feature got moved to **Stob YouTube** recently. Invite **Stob YouTube** [here](https://discord.com/api/oauth2/authorize?client_id=978893903346434069&permissions=3164160&scope=bot%20applications.commands)',
					),
			],
		});

	command.run(client, message, args);

	cooldown.unshift(message.author.id);
	setTimeout(() => {
		try {
			cooldown.splice(cooldown.indexOf(message.author.id), 1);
		} catch {
			console.error();
		}
	}, 2000);
});

function getAusDateNow() {
	let options = {
			timeZone: 'Australia/Melbourne',
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
		},
		formatter = new Intl.DateTimeFormat([], options);

	return formatter.format(new Date());
}

function checkDomain(content) {
	if (content == 'discordapp.com') return true;
	if (content == 'discordapp.net') return true;
	if (content == 'discord.com') return true;
	if (content == 'discord.new') return true;
	if (content == 'discord.gift') return true;
	if (content == 'discord.gifts') return true;
	if (content == 'discord.media') return true;
	if (content == 'discord.gg') return true;
	if (content == 'discord.co') return true;
	if (content == 'discord.app') return true;
	if (content == 'dis.gd') return true;
	if (content == 'watchanimeattheoffice.com') return true;
	if (content == 'cdn.discordapp.com') return true;
}

function checkScam(message) {
	if (phishingLinks == null)
		return sendLog(
			'Fail checking scam because nothing in phishing link list',
			new MessageEmbed()
				.setColor('RED')
				.setTitle('Fail checking scam because nothing in phishing link list')
				.setFooter({ text: `At ${getAusDateNow()}` }),
		);
	const content = message.content.toLowerCase();
	if (!message.channel.permissionsFor(message.guild.me).has(requirePerms)) return;
	try {
		let URLs = content.match(/\bhttps?:\/\/\S+/gi);
		if (URLs == null) return;
		for (let urlString of URLs) {
			let url = new URL(urlString);
			let domain = url.hostname;
			if (checkDomain(domain)) continue;

			if (phishingLinks.some((v) => v == domain)) {
				sendLog(
					`Phishing Link Form Array Detected: ${URLs.join(' ')}\nMessage:\n${content}`,
					new MessageEmbed()
						.setColor('BLUE')
						.setDescription(`Phishing Link Form Array Detected: ${URLs.join(' ')}\nMessage:\n${content}`)
						.setFooter({ text: `At ${getAusDateNow()}` }),
				);

				let scam = new MessageEmbed()
					.setTitle('SCAM DETECTION')
					.setColor('RED')
					.setDescription('I detect the link is possible a phishing link, please be warned!');

				message.reply({ embeds: [scam] }).catch(() => {});
				break;
			} else {
				if (levenshtein(domain, 'discord.gift') < 7) {
					sendLog(
						`Phishing Link Form Similar Check Detected: ${URLs.join(' ')}\nMessage:\n${content}`,
						new MessageEmbed()
							.setColor('BLUE')
							.setDescription(`Phishing Link Form Similar Check Detected: ${URLs.join(' ')}\nMessage:\n${content}`)
							.setFooter({ text: `At ${getAusDateNow()}` }),
					);

					let scam = new MessageEmbed()
						.setTitle('SCAM DETECTION')
						.setColor('RED')
						.setDescription(
							"I detect the link is very similar to https://discord.gift/ but it's not, please be warned: it's probably a phishing link!",
						);

					message.reply({ embeds: [scam] }).catch(() => {});
					break;
				}
			}
		}
	} catch (e) {
		sendLog(
			`Fail checking scam with error:\n${e.stack}`,
			new MessageEmbed()
				.setColor('RED')
				.setTitle(`Fail checking scam with error: \`\`\`${e.stack}\`\`\``)
				.setFooter({ text: `At ${getAusDateNow()}` }),
		);
	}
}

function logCommands(type, user, userIconURL, commandName, guild, channel) {
	// tpye:
	// 0: message commands
	// 1: slash commands
	// 2: context menu commands

	if (type === 2) {
		sendLog(
			`User: ${user}, used context menu: ${commandName}, in guild: ${guild}, in channel(id): ${channel}. At ${getAusDateNow()}`,
			new MessageEmbed()
				.setAuthor({ name: `Command Used by: ${user}`, iconURL: userIconURL })
				.setTitle(`Context Menu Command used: ${commandName}`)
				.setColor('GREEN')
				.setDescription(`Command Name: **${commandName}**\nGuild: **${guild}**\nChannel id: **${channel}**`)
				.setFooter({ text: `Command Used at: ${getAusDateNow()}` }),
		);
	} else {
		sendLog(
			`User: ${user}, used command: ${
				type === 0 ? '-' : '/'
			}${commandName}, in guild: ${guild}, in channel(id): ${channel}. At ${getAusDateNow()}`,
			new MessageEmbed()
				.setAuthor({ name: `Command Used by: ${user}`, iconURL: userIconURL })
				.setTitle(type === 0 ? `Message Command used: (-)${commandName}` : `Slash Command used: (/)${commandName}`)
				.setColor('GREEN')
				.setDescription(`Command Name: **${commandName}**\nGuild: **${guild}**\nChannel id: **${channel}**`)
				.setFooter({ text: `Command Used at: ${getAusDateNow()}` }),
		);
	}
}

function sendLog(consoleLog, webhookEmbed) {
	if (consoleLog) console.log(consoleLog);
	// if (webhookEmbed) {
	//     const webhookClient = new WebhookClient({ url: config.webHooks.event });
	//     webhookClient.send({ embeds: [webhookEmbed] });
	// }
}

const status = (queue) =>
	`Volume: \`${queue.volume}%\` | Loop: \`${
		queue.repeatMode ? (queue.repeatMode == 2 ? 'Queue' : 'Song') : 'Off'
	}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;
client.distube
	.on('addSong', (queue, song) => {
		queue.textChannel.send({
			embeds: [
				new MessageEmbed()
					.setTitle('Added :thumbsup: ' + song.name)
					.setURL(song.url)
					.setColor('BLUE')
					.addField(`${queue.songs.length} Songs in the Queue`, `Queue Duration: \`${queue.formattedDuration}\``)
					.addField('Song Duration', `\`${song.formattedDuration}\``)
					.setThumbnail(song.thumbnail)
					.setFooter({
						text: `Requested by: ${song.user.tag}`,
						iconURL: song.user.displayAvatarURL({ dynamic: true }),
					}),
			],
		});
	})
	.on('addList', (queue, playlist) => {
		queue.textChannel.send({
			embeds: [
				new MessageEmbed()
					.setTitle('Added Playlist :thumbsup: ' + playlist.name + ` - \`[${playlist.songs.length} songs]\``)
					.setURL(playlist.url)
					.setColor('BLUE')
					.addField('Playlist Duration', `\`${playlist.formattedDuration}\``)
					.addField(`${queue.songs.length} Songs in the Queue`, `Duration: \`${queue.formattedDuration}\``)
					.setThumbnail(playlist.thumbnail.url)
					.setFooter({
						text: `Requested by: ${playlist.songs[0].user.tag}`,
						iconURL: playlist.songs[0].user.displayAvatarURL({ dynamic: true }),
					}),
			],
		});
	})
	.on('playSong', (queue, song) => {
		if (client.silent.indexOf(queue.textChannel.guild.id) == -1) {
			queue.textChannel.send({
				embeds: [
					new MessageEmbed()
						.setTitle('Playing :notes: ' + song.name)
						.setURL(song.url)
						.setColor('BLUE')
						.addField('Song Duration', `\`${song.formattedDuration}\``)
						.addField('Queue Status', status(queue))
						.setThumbnail(song.thumbnail)
						.setFooter({
							text: `Requested by: ${song.user.tag}`,
							iconURL: song.user.displayAvatarURL({ dynamic: true }),
						}),
				],
			});
		}
	})
	.on('noRelated', (queue) => {
		queue.textChannel.send({
			embeds: [new MessageEmbed().setColor('BLUE').setTitle(`Sorry but I can not find any related video to play!`)],
		});
	})
	.on('searchNoResult', (message, query) => {
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor('RED')
					.setDescription(`❌ No result found for **${query.toString().slice(0, 1000)}...**!`),
			],
		});
	})
	.on('empty', (queue) => {
		queue.textChannel.send('I left because there is no one in the voice channel');
	})
	.on('finish', (queue) => {
		queue.textChannel.send('I left because there are no more song in queue');
	})
	.on('initQueue', (queue) => {
		queue.autoplay = false;
		queue.volume = 30;
		queue.filter = 'clear';
		if (client.silent.indexOf(queue.textChannel.guild.id) != -1)
			client.silent.splice(client.silent.indexOf(queue.textChannel.guild.id), 1);
	})
	.on('error', (channel, error) => {
		channel.send({
			embeds: [
				new MessageEmbed()
					.setColor('RED')
					.setTitle(`❌ ERROR | An error occurred`)
					.setDescription(`\`\`\`${error.message}\`\`\``),
			],
		});
	});

client.login(config.clientToken);

const { reload: reload2 } = require('./deploy-commands2');
const { log } = require('console');
reload2();

let client2 = new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_WEBHOOKS,
	],
});

client2.commands = new Collection();
client2.slashCommands = new Collection();
client2.aliases = new Collection();
client2.queue = new Map();
client2.together = new PlayTogether(client2);
client2.silent = [];
client2.invites = {};
client2.timeouts = [];
client2.distube = new DisTube(client2, {
	plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new YtDlpPlugin()],
	emitNewSongOnly: false,
	leaveOnEmpty: true,
	leaveOnFinish: true,
	leaveOnStop: true,
	savePreviousSongs: true,
	searchSongs: 0,
	youtubeCookie:
		'VISITOR_INFO1_LIVE=2NBztbdkBjA; HSID=AmqLOGTnyzGmcPYh1; SSID=AYCTaXrCT-IbnVgBK; APISID=rVnMd2NXf_4Gl1dV/AMFbTuIp2fgHWco5e; SAPISID=Js_VzPCofVgWLaNN/AJTgSoGHauqeEEZeI; __Secure-1PAPISID=Js_VzPCofVgWLaNN/AJTgSoGHauqeEEZeI; __Secure-3PAPISID=Js_VzPCofVgWLaNN/AJTgSoGHauqeEEZeI; LOGIN_INFO=AFmmF2swRgIhAN4zTMvq0IDIOPl4cJdtSrv3-Np2S6yQQJ24FhBHXn7hAiEApOmTYSwUihr6V-ZPxOdVCqTy_e9V6XcKkpsLULcyvA4:QUQ3MjNmemQ5LXlxUnIzeVFJa0ZoeHI2bXlQUWU1aVFvQmt3aWRrcGJPb0ZiSk1VVHhBYmJoWFhld1EwamdNWjlvcUZlVnRaOEJkY3V5SHNwQ2xCVEdKSzYzczQ3SUMzc29vVUdNMTBwYzFlTjAtNnVXMzRkRTIxNmhoUlRDUUllS01fNHA3ZnZ3M1NObVBQTmh5WFdUT0xrOUxpWmlYQTdB; PREF=f4=4000000&tz=Australia.Sydney&f5=30000; SID=GAjR3U9XpWTKFETiETMj212eRJJFG7F0NNh6YiFnzNBwIImugbd4v_7Vl60Ty808Td0lGA.; __Secure-1PSID=GAjR3U9XpWTKFETiETMj212eRJJFG7F0NNh6YiFnzNBwIImubXgLIcmcXIdHN_Fecpsg6g.; __Secure-3PSID=GAjR3U9XpWTKFETiETMj212eRJJFG7F0NNh6YiFnzNBwIImuxVPkFeM3oxPNuio9dM4nPQ.; YSC=9qGLl2u0d3A; CONSISTENCY=AGDxDePVEMRzTnGy2AEEftHAh7YJPJbB5JgBEqYRlO_H3xgmmbD7LsG5aAqClk8BHZGKM8SxY3hGHb1mFEiXSIdQiQB3jaDltWtp79yAcz-5Vagp-gC8AKHGiMU; SIDCC=AJi4QfH0raURVaAjXI9ugeHfe9gwB0dJvLmu0pMw2nPVZVryjuLqedCDCpASKFvoBALRsr62bQ; __Secure-3PSIDCC=AJi4QfH5yn2yevbu1RQUBwOiM-y0AhGsi9J2i1NvJvjlfsws7wQhPaiXJYhcJPbgLxguE7z6tDM',
	youtubeDL: false,
	updateYouTubeDL: true,
	customFilters: {
		funny: 'bass=g=10,apulsator=bpm=300:timing=bpm:hz=1,asubboost',
	},
	searchCooldown: 60,
	emptyCooldown: 600,
	nsfw: false,
	emitAddListWhenCreatingQueue: false,
	emitAddSongWhenCreatingQueue: false,
});

functions.sendLogs(client2);

function setActivity2() {
	client2.user.setActivity(`-h/-help in ${client2.guilds.cache.size} Servers`, {
		type: 'LISTENING',
	}); // STREAMING, WATCHING, CUSTOM_STATUS, PLAYING, COMPETING, LISTENING
}

process.on('uncaughtException', (err, origin) => {
	// const webhookClient = new WebhookClient({ url: config.webHooks.error });
	// webhookClient.send({ embeds: [new MessageEmbed().setColor('RED').setTitle("Stob Crashed! Here is the error:").setDescription(`Caught exception: \`\`\`${err.stack}\`\`\`\nException origin: ${origin}`).setFooter({ text: `Crashed at ${getAusDateNow()}` })] }).then(async () => {
	//     for (let channel of client.distube.queues.collection) {
	//         await channel[1].textChannel.send("An error occurred in my code, I'll let my creator knows the error and he will fix it as fast as he can. Safe shutting down...").catch(() => { });
	//     }
	//     for (let channel of client2.distube.queues.collection) {
	//         await channel[1].textChannel.send("An error occurred in my code, I'll let my creator knows the error and he will fix it as fast as he can. Safe shutting down...").catch(() => { });
	//     }
	//     // process.exit();
	// }).catch(() => { });
});

client2.on('ready', async () => {
	setActivity2();

	// on bot start, fetch all guilds and fetch all invites to store
	for (const coll of client2.guilds.cache) {
		const guild = coll[1];
		if (!guild.me.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) continue;
		guild.invites.fetch().then((guildInvites) => {
			guildInvites.each((guildInvite) => {
				client2.invites[guildInvite.code] = guildInvite.uses;
			});
		});
	}

	sendLog(
		`Logged in as ${client2.user.tag} (Stob Backup)!`,
		new MessageEmbed()
			.setColor('YELLOW')
			.setTitle(`Stob client active as ${client2.user.tag} (Stob Backup)!`)
			.setFooter({ text: `At ${getAusDateNow()}` }),
	);

	console.log('Server started!');
});

client2.on('rateLimit', (rateLimitData) => {
	let timeout = rateLimitData.timeout;
	let arr = rateLimitData.path.split('/');
	let channelId = arr[2];
	let msgId = arr[4];
	client2.timeouts.push({ channel: channelId, time: timeout, message: msgId });
});

setInterval(() => {
	client2.timeouts = [];
}, 10800000);

for (const file of commandFiles) {
	const command = require(`./slashCommands/${file}`);
	client2.slashCommands.set(command.data.name, command);
}

catr.forEach((folder) => {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		if (!command.name || !command.aliases) {
			sendLog(
				`(Stob Backup) No Command Name & Command Aliases In ${file}, skipping it`,
				new MessageEmbed()
					.setColor('YELLOW')
					.setTitle(`(Stob Backup) No Command Name & Command Aliases In ${file}, skipping it`)
					.setFooter({ text: `At ${getAusDateNow()}` }),
			);
			continue;
		}
		// if (folder === 'music') command.music = true;
		client2.commands.set(command.name, command);
		command.aliases.forEach((aliase) => client2.aliases.set(aliase, command.name));
	}
});

client2.on('interactionCreate', async (interaction) => {
	interactionHanlder(interaction, true);
});

client2.on('guildCreate', (guild) => {
	sendLog(
		`I have join a new guild (Stob Backup): ${guild.name}`,
		new MessageEmbed()
			.setColor('AQUA')
			.setTitle(`I have join a new guild (Stob Backup): ${guild.name}`)
			.setFooter({ text: `At ${getAusDateNow()}` }),
	);
	setActivity2();
});
client2.on('guildDelete', async (guild) => {
	sendLog(
		`I have being kicked from a guild (Stob Backup): ${guild.name}`,
		new MessageEmbed()
			.setColor('RED')
			.setTitle(`I have being kicked from a guild (Stob Backup): ${guild.name}`)
			.setFooter({ text: `At ${getAusDateNow()}` }),
	);
	resetPrefix(guild.id);
	resetCommand(guild.id);
	prefix.update();
	commands.update();
	setActivity2();
});

client2.on('messageCreate', async (message) => {
	if (message.author.bot || !message.guild || message.webhookId) return;
	checkScam(message);
	let Prefix = prefix.get(message.guild.id);
	let disabledCommands = commands.get(message.guild.id);

	if (message.mentions.members.first() && message.mentions.members.first().id == client2.user.id) {
		if (message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) {
			message
				.reply(`My prefix in this server is \`${Prefix}\`, use \`${Prefix}h\` to see how to use me`)
				.catch(() => {});
		}
	}

	if (!message.content.startsWith(Prefix)) return;

	let args = message.content.slice(Prefix.length).trim().split(/ +/g);
	let cmd = args.shift().toLowerCase();

	let command = client2.commands.get(cmd) || client2.commands.get(client2.aliases.get(cmd));

	if (!command) return;

	if (disabledCommands.indexOf(command.name) != -1)
		return message.reply("I'm sorry but this command got disabled by the server owner!");

	if (cooldown.indexOf(message.author.id) != -1) return message.reply('Please do not spam commands');

	if (!message.channel.permissionsFor(message.guild.me).has(requirePerms)) {
		if (message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) {
			message.reply('I need the permission to send embeds, please give me send embed permission!');
		}
		return;
	}

	logCommands2(
		0,
		message.author.tag,
		message.member.displayAvatarURL({ dynamic: true }),
		cmd,
		message.guild.name,
		message.channel.id,
	);

	if (command.music)
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor('BLUE')
					.setTitle('Music Command for Stob deprecated!')
					.setDescription(
						'Stob music feature got moved to **Stob YouTube** recently. Invite **Stob YouTube** [here](https://discord.com/api/oauth2/authorize?client_id=978893903346434069&permissions=3164160&scope=bot%20applications.commands)',
					),
			],
		});

	command.run(client2, message, args, true);

	cooldown.unshift(message.author.id);
	setTimeout(() => {
		try {
			cooldown.splice(cooldown.indexOf(message.author.id), 1);
		} catch {
			console.error();
		}
	}, 2000);
});

function logCommands2(type, user, userIconURL, commandName, guild, channel) {
	// tpye:
	// 0: message commands
	// 1: slash commands
	// 2: context menu commands

	if (type === 2) {
		sendLog(
			`(Stob Backup) User: ${user}, used context menu: ${commandName}, in guild: ${guild}, in channel(id): ${channel}. At ${getAusDateNow()}`,
			new MessageEmbed()
				.setAuthor({ name: `(Stob Backup) Command Used by: ${user}`, iconURL: userIconURL })
				.setTitle(`Context Menu Command used: ${commandName}`)
				.setColor('GREEN')
				.setDescription(`Command Name: **${commandName}**\nGuild: **${guild}**\nChannel id: **${channel}**`)
				.setFooter({ text: `Command Used at: ${getAusDateNow()}` }),
		);
	} else {
		sendLog(
			`(Stob Backup) User: ${user}, used command: ${
				type === 0 ? '-' : '/'
			}${commandName}, in guild: ${guild}, in channel(id): ${channel}. At ${getAusDateNow()}`,
			new MessageEmbed()
				.setAuthor({ name: `(Stob Backup) Command Used by: ${user}`, iconURL: userIconURL })
				.setTitle(type === 0 ? `Message Command used: (-)${commandName}` : `Slash Command used: (/)${commandName}`)
				.setColor('GREEN')
				.setDescription(`Command Name: **${commandName}**\nGuild: **${guild}**\nChannel id: **${channel}**`)
				.setFooter({ text: `Command Used at: ${getAusDateNow()}` }),
		);
	}
}

client2.distube
	.on('addSong', (queue, song) => {
		queue.textChannel.send({
			embeds: [
				new MessageEmbed()
					.setTitle('Added :thumbsup: ' + song.name)
					.setURL(song.url)
					.setColor('BLUE')
					.addField(`${queue.songs.length} Songs in the Queue`, `Queue Duration: \`${queue.formattedDuration}\``)
					.addField('Song Duration', `\`${song.formattedDuration}\``)
					.setThumbnail(song.thumbnail)
					.setFooter({
						text: `Requested by: ${song.user.tag}`,
						iconURL: song.user.displayAvatarURL({ dynamic: true }),
					}),
			],
		});
	})
	.on('addList', (queue, playlist) => {
		queue.textChannel.send({
			embeds: [
				new MessageEmbed()
					.setTitle('Added Playlist :thumbsup: ' + playlist.name + ` - \`[${playlist.songs.length} songs]\``)
					.setURL(playlist.url)
					.setColor('BLUE')
					.addField('Playlist Duration', `\`${playlist.formattedDuration}\``)
					.addField(`${queue.songs.length} Songs in the Queue`, `Duration: \`${queue.formattedDuration}\``)
					.setThumbnail(playlist.thumbnail.url)
					.setFooter({
						text: `Requested by: ${playlist.songs[0].user.tag}`,
						iconURL: playlist.songs[0].user.displayAvatarURL({ dynamic: true }),
					}),
			],
		});
	})
	.on('playSong', (queue, song) => {
		if (client2.silent.indexOf(queue.textChannel.guild.id) == -1) {
			queue.textChannel.send({
				embeds: [
					new MessageEmbed()
						.setTitle('Playing :notes: ' + song.name)
						.setURL(song.url)
						.setColor('BLUE')
						.addField('Song Duration', `\`${song.formattedDuration}\``)
						.addField('Queue Status', status(queue))
						.setThumbnail(song.thumbnail)
						.setFooter({
							text: `Requested by: ${song.user.tag}`,
							iconURL: song.user.displayAvatarURL({ dynamic: true }),
						}),
				],
			});
		}
	})
	.on('noRelated', (queue) => {
		queue.textChannel.send({
			embeds: [new MessageEmbed().setColor('BLUE').setTitle(`Sorry but I can not find any related video to play!`)],
		});
	})
	.on('searchNoResult', (message, query) => {
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor('RED')
					.setDescription(`❌ No result found for **${query.toString().slice(0, 1000)}...**!`),
			],
		});
	})
	.on('empty', (queue) => {
		queue.textChannel.send('I left because there is no one in the voice channel');
	})
	.on('finish', (queue) => {
		queue.textChannel.send('I left because there are no more song in queue');
	})
	.on('initQueue', (queue) => {
		queue.autoplay = false;
		queue.volume = 30;
		queue.filter = 'clear';
		if (client2.silent.indexOf(queue.textChannel.guild.id) != -1)
			client2.silent.splice(client2.silent.indexOf(queue.textChannel.guild.id), 1);
	})
	.on('error', (channel, error) => {
		channel.send({
			embeds: [
				new MessageEmbed()
					.setColor('RED')
					.setTitle(`❌ ERROR | An error occurred`)
					.setDescription(`\`\`\`${error.message}\`\`\``),
			],
		});
	});

client2.login(config.clientToken2);

async function interactionHanlder(interaction, isBackup) {
	if (interaction.isButton()) {
		let Prefix = prefix.get(interaction.guild.id);
		/*
        if (interaction.customId == `music`) {
            let music = new MessageEmbed()
                .setAuthor({ name: "Music commands:", iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                .setColor("BLUE")
                .addFields(
                    { name: `**Play a song** *(support Spotify, SoundCloud, YouTube, Netflix and more)*`, value: `\`${Prefix}pl <URL/Name>\`` },
                    { name: `**Show all the controls:**\n`, value: `\`${Prefix}song\`\n**\`🔁 = Change loop type, ⏮️ = Play the previous song, ⏸ = Pause/Play, ⏭️ = Play the next song, 🔀 = Shuffle the queue, 🔔 = Turn silent mode on/off, 🎶 = View the queue, 🔉 = Change the volume, 📄 = Show the lyric of the current playing song, 🚪 = Leave\`**` },
                    { name: `**Leave the voice channel**`, value: `\`${Prefix}leave/${Prefix}stop\`` },
                    { name: `**Pause the current song**`, value: `\`${Prefix}pa\`` },
                    { name: `**Resume the paused song**`, value: `\`${Prefix}r\`` },
                    { name: `**Loop the songs**`, value: `\`${Prefix}loop <off/track/queue>\`` },
                    { name: `**View server queue**`, value: `\`${Prefix}q\`` },
                    { name: `**Skip the current playing song**`, value: `\`${Prefix}sk\`` },
                    { name: `**Shuffle the queue**`, value: `\`${Prefix}sh\`` },
                    { name: `**Change the song volume**`, value: `\`${Prefix}v <0 ${Prefix} 300>\`` },
                    { name: `**Forward the song**`, value: `\`${Prefix}fw <Seconds>\`` },
                    { name: `**Set the playing time of the song**`, value: `\`${Prefix}settime <Seconds>\`` },
                    { name: `**Apply a(some) filters**`, value: `\`${Prefix}filter {multi}\`` },
                    { name: `**Turn autoplay on/off**`, value: `\`${Prefix}ap <on/off>\`` },
                    { name: `**Add Related Song**`, value: `\`${Prefix}addRS\`` },
                    { name: `**Jump to a song**`, value: `\`${Prefix}jump\`` },
                    { name: `**Play the previous song**`, value: `\`${Prefix}playpre\`` },
                    { name: `**Search and play the selected song**`, value: `\`${Prefix}searchplay <song>\`` },
                    { name: `**Search for a video(download audio/video)**`, value: `\`${Prefix}search <video>\`` },
                    { name: `**Show the lyric of a song**`, value: `\`${Prefix}lyric <song>\`` },
                    { name: `**Turn on/off silent mode**`, value: `\`${Prefix}silent <on/off>\`` },
                    { name: `**Get the song by listening(song recognizer powered by shazam)**`, value: `\`${Prefix}getsong\`` },
                )

            interaction.reply({ ephemeral: true, embeds: [music] });
        }
        */
		if (interaction.customId == `mod`) {
			let mod = new MessageEmbed()
				.setAuthor({ name: 'Mods commands:', iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
				.setColor('BLUE')
				.addFields(
					{ name: `**Change the prefix of the bot for this server**`, value: `\`${Prefix}prefix <prefix>\`` },
					{ name: `**Reset the prefix of the bot for this server**`, value: `\`${Prefix}rp\`` },
					{ name: `**Delete messages**`, value: `\`${Prefix}delete <1 - 10000>\`` },
					{
						name: `**Delete message one by one instead of bulk delete (Support messages older than 14 days & Slow)**`,
						value: `\`${Prefix}forcedelete <1 - 100>\``,
					},
					{ name: `**Ban a user**`, value: `\`${Prefix}ban <user> {reason}\`` },
					{ name: `**Unban a user**`, value: `\`${Prefix}unban <user id/name>\`` },
					{ name: `**Kick a user**`, value: `\`${Prefix}kick <user> {reason}\`` },
					{ name: `**Warn a user**`, value: `\`${Prefix}warn <user>\`` },
					{ name: `**Clear the warns of a user**`, value: `\`${Prefix}cwarn <user>\`` },
					{ name: `**View warnings of a user**`, value: `\`${Prefix}vwarn <user>\`` },
					{ name: `**Mute a user**`, value: `\`${Prefix}mute <user> {reason}\`` },
					{ name: `**Unmute a user**`, value: `\`${Prefix}unmute <user>\`` },
					{ name: `**Timeout a user**`, value: `\`${Prefix}timeout <user> <time(1d, 1h, 1m, 1s)> {reason}\`` },
					{ name: `**Untimeout a user**`, value: `\`${Prefix}untimeout <user>\`` },
					{ name: `**View all the timeouted users in the server**`, value: `\`${Prefix}viewtimeouts\`` },
					{ name: `**Spam a message**`, value: `\`${Prefix}spam <times> <message>\`` },
					{ name: `**Stop spamming**`, value: `\`${Prefix}stopspam\`` },
					{ name: `**Send all server logs to that channel**`, value: `\`${Prefix}log <channel/off>\`` },
					{ name: `**Disable a command (Owner Only)**`, value: `\`${Prefix}dc <command>\`` },
					{ name: `**Enable a command (Owner Only)**`, value: `\`${Prefix}ec <command>\`` },
					{ name: `**Reset all commands (allow all commands) (Owner Only)**`, value: `\`${Prefix}rc\`` },
					{ name: `**View disabled commands (Everyone)**`, value: `\`${Prefix}vdc\`` },
				);

			interaction.reply({ ephemeral: true, embeds: [mod] });
		}
		if (interaction.customId == `fun`) {
			let fun = new MessageEmbed()
				.setAuthor({ name: 'Fun commands:', iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
				.setColor('BLUE')
				.addFields(
					{ name: `**Replace linebreaks with '\\n'**`, value: `\`${Prefix}rlb <text>\`` },
					{ name: `**Start an activity(Play games, YouTube videos...)**`, value: `\`${Prefix}activity\`` },
					{ name: `**Translate any language to English**`, value: `\`${Prefix}translate <text>\`` },
					{ name: `**Say a joke**`, value: `\`${Prefix}joke\`` },
					{ name: `**Show information about the server**`, value: `\`${Prefix}serverinfo\`` },
					{ name: `**Show all the roles in the server**`, value: `\`${Prefix}rolesinfo\`` },
					{ name: `**Show information about a user**`, value: `\`${Prefix}userinfo <user>\`` },
					{ name: `**Show information about the role**`, value: `\`${Prefix}role <role name>\`` },
					{ name: `**Show the avatar of the server(with download)**`, value: `\`${Prefix}serveravt <user>\`` },
					{ name: `**Show the avatar of a user(with download)**`, value: `\`${Prefix}avt <user>\`` },
					{ name: `**View how to create a poll**`, value: `\`${Prefix}poll example\`` },
					{ name: `**Windows 11 facts**`, value: `\`${Prefix}windows11\`` },
				);

			interaction.reply({ ephemeral: true, embeds: [fun] });
		}
		if (interaction.customId == 'slashcommands') {
			let fun = new MessageEmbed()
				.setAuthor({
					name: 'Stob Slash Commands:',
					iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
				})
				.setColor('BLUE')
				.setDescription(
					'If you can not see the slash commands registered in your server, please reinvite the bot use [this link](https://discord.com/api/oauth2/authorize?client_id=882068020153966663&permissions=8&scope=bot%20applications.commands) (No need to kick then invite, just use the link)',
				)
				.addFields({ name: '**Send an embed (Use `\\n` to line break)**', value: '`/embed`' });

			interaction.reply({ ephemeral: true, embeds: [fun] });
		}
		if (interaction.customId == 'bot') {
			interaction.reply(
				`Here is the main Stob invite link:\nhttps://discord.com/api/oauth2/authorize?client_id=882068020153966663&permissions=8&scope=bot%20applications.commands\n\nStob backup:\nhttps://discord.com/api/oauth2/authorize?client_id=884565538469203989&permissions=8&scope=bot%20applications.commands`,
			);
		}
		if (interaction.customId == 'server') {
			let embed = new MessageEmbed()
				.setColor('GREEN')
				.setTitle(`Here is my discord server invite link:`)
				.setDescription(`https://discord.com/invite/5F3EueB`);

			interaction.reply({ embeds: [embed] });
		}
		const controls = require('./commands/music/song');
		let client = interaction.client;
		let message = interaction.message;
		if (interaction.customId == 'loop') {
			let m = controls.loopClicked(client, message);
			await interaction.reply(
				m == null
					? 'Changed!'
					: { embeds: [new MessageEmbed().setTitle(`Error: ${m}`).setColor('RED')], ephemeral: true },
			);
			if (m == null)
				try {
					interaction.deleteReply();
				} catch {}
		}
		if (interaction.customId == 'presong') {
			try {
				let m = await controls.preClicked(client, message);
				await interaction.reply(
					m == null
						? 'Changed!'
						: { embeds: [new MessageEmbed().setTitle(`Error: ${m}`).setColor('RED')], ephemeral: true },
				);
				if (m == null)
					try {
						interaction.deleteReply();
					} catch {}
			} catch {
				console.error();
			}
		}
		if (interaction.customId == 'pause') {
			let m = controls.pauseClicked(client, message);
			await interaction.reply(
				m == null
					? 'Changed!'
					: { embeds: [new MessageEmbed().setTitle(`Error: ${m}`).setColor('RED')], ephemeral: true },
			);
			if (m == null)
				try {
					interaction.deleteReply();
				} catch {}
		}
		if (interaction.customId == 'nextsong') {
			let m = await controls.nextClicked(client, message);
			await interaction.reply(
				m == null
					? 'Changed!'
					: { embeds: [new MessageEmbed().setTitle(`Error: ${m}`).setColor('RED')], ephemeral: true },
			);
			if (m == null)
				try {
					interaction.deleteReply();
				} catch {}
		}
		if (interaction.customId == 'shuffle') {
			let m = controls.shffleClicked(client, message);
			await interaction.reply(
				m == null
					? 'Changed!'
					: { embeds: [new MessageEmbed().setTitle(`Error: ${m}`).setColor('RED')], ephemeral: true },
			);
			if (m == null)
				try {
					interaction.deleteReply();
				} catch {}
		}
		if (interaction.customId == 'silent') {
			let m = controls.silentClicked(client, message);
			await interaction.reply(
				m == null
					? 'Changed!'
					: { embeds: [new MessageEmbed().setTitle(`Error: ${m}`).setColor('RED')], ephemeral: true },
			);
			if (m == null)
				try {
					interaction.deleteReply();
				} catch {}
		}
		if (interaction.customId == 'leave') {
			let m = controls.leaveClicked(client, message);
			await interaction.reply(
				m == null ? 'Left!' : { embeds: [new MessageEmbed().setTitle(`Error: ${m}`).setColor('RED')], ephemeral: true },
			);
			if (m == null)
				try {
					interaction.deleteReply();
				} catch {}
		}
		if (interaction.customId == 'queue') {
			controls.queueClicked(client, message, interaction);
		}
		if (interaction.customId == 'volume') {
			let m = controls.volumeClicked(client, message);
			await interaction.reply(
				m == null
					? 'Changed!'
					: { embeds: [new MessageEmbed().setTitle(`Error: ${m}`).setColor('RED')], ephemeral: true },
			);
			if (m == null)
				try {
					interaction.deleteReply();
				} catch {}
		}
		if (interaction.customId == 'lyric') {
			controls.lyricClicked(client, message, interaction);
		}
	}
	if (interaction.isContextMenu()) {
		if (interaction.commandName === 'Explain Code') {
			if (isBackup) {
				logCommands2(
					2,
					interaction.user?.tag,
					interaction.user.displayAvatarURL({ dynamic: true }),
					interaction?.commandName,
					interaction.guild?.name,
					interaction.channel?.id,
				);
			} else {
				logCommands(
					2,
					interaction.user?.tag,
					interaction.user.displayAvatarURL({ dynamic: true }),
					interaction?.commandName,
					interaction.guild?.name,
					interaction.channel?.id,
				);
			}

			// Give the bot time for our API to respond
			await interaction.deferReply();

			var codeSnippet = interaction.options.getMessage('message').content;
			var userId = interaction.user.tag;

			var lines = codeSnippet.split('\n');
			var language = lines[0].split('```')[1];
			var code = ''.concat(...lines.slice(1, lines.length - 1));

			// Check if this language is supported
			switch (language) {
				case 'cs':
					language = 'csharp';
					break;
				case 'js':
					language = 'javascript';
					break;
				case 'py':
					language = 'python';
					break;
				default:
					if (!util.SUPPORTED_LANGUAGES.includes(language)) {
						await interaction.editReply(
							'Language must be C#, Java, JavaScript or Python. Please ensure your snippet is correctly formed as a code block with the language on the first line after three backticks.',
						);
						return;
					}
					break;
			}

			var explanation = await util.requestExplanation(code, language, userId);
			var codeBlock = '```\n' + explanation + '\n```';
			await interaction.editReply(codeBlock);
		}
	}
	if (interaction.isSelectMenu()) {
		if (interaction.customId == 'jump') {
			let index = parseInt(interaction.values[0]);
			let message = interaction.message;
			try {
				client2.distube.jump(message, index);
			} catch {
				interaction.reply('There is an error while jumping songs!');
			}
			message.delete();
		}
		if (interaction.customId == 'jumpNoD') {
			let client = interaction.client;
			let message = interaction.message;

			let queue = client.distube.getQueue(message);
			if (!queue) {
				return interaction.reply({
					embeds: [new MessageEmbed().setTitle(`❌ There is nothing playing!`).setColor('RED')],
					ephemeral: true,
				});
			}
			let index = parseInt(interaction.values[0]);
			client.distube
				.jump(message, index)
				.then(async () => {
					await interaction.reply('Jumped!');
					try {
						interaction.deleteReply();
					} catch {}
				})
				.catch(() => {
					interaction.reply({ content: "You can't jump to the current playing song!", ephemeral: true });
				});
		}
		if (interaction.customId == 'filter') {
			let client = interaction.client;
			let message = interaction.message;
			if (!client.distube.getQueue(message)) {
				return interaction.reply({
					embeds: [new MessageEmbed().setTitle(`❌ There is nothing playing!`).setColor('RED')],
					ephemeral: true,
				});
			}

			client.distube.setFilter(message, false);
			if (interaction.values != 'clear') {
				client.distube.setFilter(message, interaction.values[0]);
			}
			await interaction.reply('Changed!');
			try {
				interaction.deleteReply();
			} catch {}
		}
		if (interaction.customId == 'singleFilter') {
			let client = interaction.client;
			let message = interaction.message;
			if (!client.distube.getQueue(message)) {
				return interaction.reply({
					embeds: [new MessageEmbed().setTitle(`❌ There is nothing playing!`).setColor('RED')],
					ephemeral: true,
				});
			}

			client.distube.setFilter(message, false);
			if (interaction.values != 'clear') {
				client.distube.setFilter(message, interaction.values[0]);
			}

			let embed = new MessageEmbed()
				.setColor('BLUE')
				.setTitle(`I set the filter to: \`${interaction.values[0]}\``)
				.setDescription('Please wait a few seconds to let the bot process');

			interaction.reply({ embeds: [embed] });
		}
		if (interaction.customId == 'multiFilter') {
			let client = interaction.client;
			let message = interaction.message;
			if (!client.distube.getQueue(message)) {
				return interaction.reply({
					embeds: [new MessageEmbed().setTitle(`❌ There is nothing playing!`).setColor('RED')],
					ephemeral: true,
				});
			}

			client.distube.setFilter(message, false);
			for (const filter of interaction.values) {
				client.distube.setFilter(message, filter);
			}

			let embed = new MessageEmbed()
				.setColor('BLUE')
				.setTitle('This may take a while')
				.setDescription(`I set the filters includes: \`${interaction.values.join(', ')}\``);

			interaction.reply({ embeds: [embed] });
		}
		if (interaction.customId == 'activity') {
			let message = interaction.message;
			let vc = interaction.member.voice.channel;
			let type = interaction.values[0];
			if (!vc) return interaction.reply('You need to be in a voice channel to start an activity!');
			if (!vc.permissionsFor(message.guild.me).has(Permissions.FLAGS.CREATE_INSTANT_INVITE))
				return interaction.reply(`I do not have permission to create instand invite in ${vc}!`);
			let invite = await functions.activity(client2, vc.id, type);
			if (invite == null) {
				interaction.reply('There is an error while creating invite links!');
			} else {
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor('GREEN')
							.setTitle('Started an activity!')
							.setDescription(
								`Channel: ${vc}\nClick [here](${invite}) to join **${
									message.components[0].components[0].options.filter((m) => m.value == type)[0].label
								}**`,
							)
							.setFooter({
								text: `Started by: ${interaction.member.user.tag}`,
								iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
							}),
					],
				});
				message.delete();
			}
		}
	}
	if (interaction.isCommand()) {
		const command = client2.slashCommands.get(interaction.commandName);

		if (!command) return;
		if (isBackup) {
			logCommands2(
				1,
				interaction.user?.tag,
				interaction.user.displayAvatarURL({ dynamic: true }),
				interaction?.commandName,
				interaction.guild?.name,
				interaction.channel?.id,
			);
		} else {
			logCommands(
				1,
				interaction.user?.tag,
				interaction.user.displayAvatarURL({ dynamic: true }),
				interaction?.commandName,
				interaction.guild?.name,
				interaction.channel?.id,
			);
		}
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			interaction
				.reply({ content: 'There was an error while executing this command!', ephemeral: true })
				.catch(() =>
					interaction
						.editReply({ content: 'There was an error while executing this command!', ephemeral: true })
						.catch(() => {}),
				);
		}
	}
}
