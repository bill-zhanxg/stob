const sleep = require('util').promisify(setTimeout);
const mongo = require('./mongo');
const warnSchemas = require('./schemas/warn-schemas');
const prefixSchemas = require('./schemas/prefix-schemas');
const disableCommandSchemas = require('./schemas/disablecommand-schemas');

let waitingID = 0;
let waiting = [];

module.exports = {
	clearNumber: async () => {
		while (true) {
			if (waitingID > 100) {
				while (true) {
					if (waiting.length == 0) {
						waitingID = 0;
						break;
					}
					await sleep(50);
				}
			}
			await sleep(500);
		}
	},
	warn: async (guildId, userId) => {
		let num = waitingID;
		waitingID++;
		waiting.push(num);
		while (true) {
			if (waiting[0] == num) {
				//Execute Here
				try {
					let mongoose = await mongo();
					let object = await warnSchemas
						.findOneAndUpdate(
							{
								id: guildId,
								userId: userId,
							},
							{
								$inc: {
									WarnCounts: 1,
								},
							},
							{
								upsert: true,
								new: true,
							},
						)
						.exec();
					mongoose.connection.close();
					waiting.splice(0, 1);

					return object;
				} catch {
					waiting.splice(0, 1);
					return false;
				}
			}
			await sleep(500);
		}
	},
	cwarn: async (guildId, userId) => {
		let num = waitingID;
		waitingID++;
		waiting.push(num);
		while (true) {
			if (waiting[0] == num) {
				//Execute Here
				try {
					let mongoose = await mongo();
					await warnSchemas.deleteOne({ id: guildId, userId: userId });

					mongoose.connection.close();
					waiting.splice(0, 1);
					return userId;
				} catch {
					waiting.splice(0, 1);
					return null;
				}
			}
			await sleep(500);
		}
	},
	vwarn: async (guildId, userId) => {
		let num = waitingID;
		waitingID++;
		waiting.push(num);
		while (true) {
			if (waiting[0] == num) {
				//Execute Here
				try {
					let mongoose = await mongo();
					const warns = await warnSchemas.findOne({ id: guildId, userId: userId });
					mongoose.connection.close();
					waiting.splice(0, 1);

					if (warns == null) {
						return false;
					} else {
						return { userId: userId, warns: warns.WarnCounts };
					}
				} catch {
					waiting.splice(0, 1);
					return null;
				}
			}
			await sleep(500);
		}
	},
	setPrefix: async (guildId, prefix) => {
		let num = waitingID;
		waitingID++;
		waiting.push(num);
		while (true) {
			if (waiting[0] == num) {
				//Execute Here
				try {
					let mongoose = await mongo();
					await prefixSchemas
						.updateOne(
							{
								guild: guildId,
							},
							{
								prefix: prefix,
							},
							{
								upsert: true,
							},
						)
						.exec();

					mongoose.connection.close();
					waiting.splice(0, 1);

					return prefix;
				} catch {
					waiting.splice(0, 1);
					return null;
				}
			}
			await sleep(500);
		}
	},
	resetPrefix: async (guildId) => {
		let num = waitingID;
		waitingID++;
		waiting.push(num);
		while (true) {
			if (waiting[0] == num) {
				//Execute Here
				try {
					let mongoose = await mongo();
					await prefixSchemas
						.deleteOne({
							guild: guildId,
						})
						.exec();

					mongoose.connection.close();
					waiting.splice(0, 1);

					return true;
				} catch {
					waiting.splice(0, 1);
					return null;
				}
			}
			await sleep(500);
		}
	},
	getPrefix: async () => {
		let num = waitingID;
		waitingID++;
		waiting.push(num);
		while (true) {
			if (waiting[0] == num) {
				//Execute Here
				try {
					let mongoose = await mongo();
					let prefixes = await prefixSchemas.find();
					mongoose.connection.close();
					waiting.splice(0, 1);

					let prefixs = [];
					for (const prefix of prefixes) {
						prefixs.push({ guild: prefix.guild, prefix: prefix.prefix });
					}

					return prefixs;
				} catch {
					waiting.splice(0, 1);
					return null;
				}
			}
			await sleep(500);
		}
	},
	disableCommand: async (guildId, command) => {
		let num = waitingID;
		waitingID++;
		waiting.push(num);
		while (true) {
			if (waiting[0] == num) {
				//Execute Here
				try {
					let mongoose = await mongo();
					let value = await disableCommandSchemas.findOne({
						guild: guildId,
					});

					if (value == null) {
						await disableCommandSchemas
							.updateOne(
								{
									guild: guildId,
								},
								{
									commands: [command],
								},
								{
									upsert: true,
								},
							)
							.exec();
					} else {
						await disableCommandSchemas
							.updateOne(
								{
									guild: guildId,
								},
								{
									commands: [command, ...value?.commands],
								},
								{
									upsert: true,
								},
							)
							.exec();
					}

					mongoose.connection.close();
					waiting.splice(0, 1);

					return null;
				} catch {
					waiting.splice(0, 1);
					return null;
				}
			}
			await sleep(500);
		}
	},
	enableCommand: async (guildId, command) => {
		let num = waitingID;
		waitingID++;
		waiting.push(num);
		while (true) {
			if (waiting[0] == num) {
				//Execute Here
				try {
					let mongoose = await mongo();
					let value = await disableCommandSchemas.findOne({
						guild: guildId,
					});

					if (value != null) {
						value.commands.splice(value.commands.indexOf(command), 1);

						if (value.commands.length < 1) {
							await disableCommandSchemas
								.deleteOne({
									guild: guildId,
								})
								.exec();
						} else {
							await disableCommandSchemas
								.updateOne(
									{
										guild: guildId,
									},
									{
										commands: [value.commands],
									},
									{
										upsert: true,
									},
								)
								.exec();
						}
					}

					mongoose.connection.close();
					waiting.splice(0, 1);

					return prefix;
				} catch {
					waiting.splice(0, 1);
					return null;
				}
			}
			await sleep(500);
		}
	},
	resetCommand: async (guildId) => {
		let num = waitingID;
		waitingID++;
		waiting.push(num);
		while (true) {
			if (waiting[0] == num) {
				//Execute Here
				try {
					let mongoose = await mongo();
					await disableCommandSchemas
						.deleteOne({
							guild: guildId,
						})
						.exec();

					mongoose.connection.close();
					waiting.splice(0, 1);

					return true;
				} catch {
					waiting.splice(0, 1);
					return null;
				}
			}
			await sleep(500);
		}
	},
	getDisabledCommands: async () => {
		let num = waitingID;
		waitingID++;
		waiting.push(num);
		while (true) {
			if (waiting[0] == num) {
				//Execute Here
				try {
					let mongoose = await mongo();
					let value = await disableCommandSchemas.find();
					mongoose.connection.close();
					waiting.splice(0, 1);

					return value;
				} catch {
					waiting.splice(0, 1);
					return null;
				}
			}
			await sleep(500);
		}
	},
};
