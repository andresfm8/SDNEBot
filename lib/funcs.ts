/**
 *
 * TimmyRB
 * November 1, 2020
 * The following file is used for function initialization for the application
 *
 * Updates
 * -------
 * November 17, 2020 -- N3rdP1um23 -- Added version & update command to the help menu
 * November 18, 2020 -- N3rdP1um23 -- Added channel commands to the help menu
 * November 20, 2020 -- N3rdP1um23 -- Updated to use new log handler
 *
 */

// Import the required items
import * as Discord from 'discord.js'
import { Permissions } from 'discord.js'
import * as db from '../database'
import { NewChannel } from '../env';

// Emotions object
const emotions = {
	sad: {
		color: 3447003,
		emoji: ':slight_frown:'
	},
	happy: {
		color: 15105570,
		emoji: ':smiley:'
	},
};

/**
 *
 * The following function is used to render the help menu
 *
 * @param member: is the user that has run the command
 * @param page: is the page that is requested from the help menu
 * @param channel: is the chanel for which the command was executed in
 * @param msg: is the message that was executed by the user
 *
 */
export function help(member: Discord.GuildMember, page: number, channel?: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel, msg?: Discord.Message): number {
	// Define the required variables
	var tips_per_page = 3;

	// Initialize the tips array that will hold all of the help tips
	let tips = [
		{
			name: 'View Help',
			value: '```!help```'
		},
		{
			name: 'Pin Message',
			value: '```React with 📌 on any message to save it```'
		}
	];

	// Append additional tips
	tips.push({ 'name': 'Create Channel', 'value': '```!make channelName```'});
	tips.push({ 'name': 'User(s\') Info', 'value': '```!userinfo @user[]```' });
	tips.push({ 'name': 'View RateMyProfessor info', 'value': '```!rmp profName```'});
	tips.push({ 'name': 'Get days until an event (mainly holidays)', 'value': '```!daysUntil event_name[]```'});

	// Check to see if the member has the permission to manage roles
	if(member.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
		// Append the assign roles tip
		tips.push({ 'name': 'Assign Roles Embed', 'value': '```!assignInfo```' });
	}

	// Check to see if the member has the permission to manage messages
	if(member.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES)) {
		// Append the cleanup messages tip
		tips.push({ 'name': 'Cleanup Messages', 'value': '```!cleanup #num_messages```' });
	}

	// Check to see if the member has the permission to kick members
	if(member.hasPermission(Permissions.FLAGS.KICK_MEMBERS)) {
		// Append the respective mute, warn, and kick tips
		tips.push({ 'name': 'Mute User(s)', 'value': '```!mute @non_admin_user[]```' });
		tips.push({ 'name': 'Unmute User(s)', 'value': '```!unmute @non_admin_user[]```' });
		tips.push({ 'name': 'Warn User(s)', 'value': '```!warn #rule_num @non_admin_user[]```' });
		tips.push({ 'name': 'Display bot (repo) version', 'value': '```!version```' });
		tips.push({ 'name': 'Update bot (repo) version', 'value': '```!update```' });
		tips.push({ 'name': 'Archive Channel', 'value': '```!channel archive [clone=false]```' });
		tips.push({ 'name': 'Clone Channel', 'value': '```!channel clone [clone=false]```' });
		tips.push({ 'name': 'Clone Channel', 'value': '```!channel remove```' });
	}

	// Define the max amount of pages  based on the amount of tips
	let maxPages = Math.ceil(tips.length / tips_per_page);

	// Check to see if the current page is great than the max amount of pages
	if(page > maxPages) {
		// Reset the page back to the max allowed page
		page = maxPages;
	}

	// Check to see if the current page is less than 1
	if(page < 1) {
		// Reset the page to the first page
		page = 1;
	}

	// Start to formulate the embed object
	let embed = {
		'embed': {
			'title': 'Help Menu',
			'description': `Click the arrows to change pages. Page ${page} of ${maxPages}`,
			'color': 3553599,
			'timestamp': new Date(),
			'fields': []
		}
	};

	// Determine the current page of tips to display
	let toDisplay = tips.slice(((page - 1) * tips_per_page), (page * tips_per_page));

	// Push the items to display to the embeded fields array
	toDisplay.forEach(item => {
		// Check to make aure that the item isn't undefined
		if(item !== undefined) {
			// Push the item to the embed fields array
			embed['embed']['fields'].push(item);
		}
	});

	// Check to make sure that the channel isn't undefined
	if(channel !== undefined) {
		// Send the new embed object to the specified channel
		channel.send(embed).then(m => {
			// React with the page left option
			m.react('⬅️').then(() => {
				// React with the page right option
				m.react('➡️').then(() => {
					// React with the help remove option
					m.react('🗑️');
				});
			});

			// Update the config value that stores the latest help message id
			db.updateConfig('help', m.id);
		});
	}else if(msg !== undefined) {
		// Update the embeded message
		msg.edit(embed);
	}

	// Return the page that the user is currently on
	return page;
}

/**
 *
 * The following function is used to determine if the message has an attachment or not
 *
 * @param msg: is the message that is to be checked
 *
 */
export function hasAttachment(msg: Discord.Message | Discord.PartialMessage): boolean {
	// Return if the message has an attachment
	return (msg.attachments.size > 0);
}

/**
 *
 * The following function is used to determine if the message has an URL or not
 *
 * @param msg: is the message that is to be checked
 *
 */
export function hasURL(msg: Discord.Message | Discord.PartialMessage): boolean {
	// Return if the message has a URL
	return (msg.content.indexOf('https://') !== -1 || msg.content.indexOf('http://') !== -1);
}

/**
 *
 * The following function is used to handle writing to the bots diary
 *
 * @param emotion : is the emotion of the diary entry
 * @param guild : is the Discord guild to handle
 * @param diary_object? : is the diary object to handle
 *
 */
export async function diary(emotion = 'sad', guild: Discord.Guild, diary_object?) {
	// Create the required variables
	var bot_category;
	var bot_diary_channel;

	// Check to see if there's a bot specific channel
	await db.getConfig('bot_channel_id').then(async (result) => {
		// Create the required variables
		var channels = guild.channels.cache;
		var category_channels = channels.filter(channel => channel.type === 'category');
		var text_channels = channels.filter(channel => channel.type === 'text');
		var existing_bot_category = category_channels.find(channel => channel.name.toLowerCase().includes('bot'));
		var existing_bot_diary_channel = text_channels.find(channel => channel.name.toLowerCase().includes('diary'));

		// Check to see if the channel id exists
		if(result !== undefined) {
			// Set the bot diary channel
			bot_diary_channel = text_channels.find(channel => channel.id === result);
		}

		// Check to see if the channel doesn't exist
		if(bot_diary_channel === undefined) {
			// Check to see if the bot category doesn't exist
			if(existing_bot_category === undefined) {
				// Create and set the bot category instance
				await createChannel(guild, {
					title: '🤖 bot-stuff',
					type: 'category',
					topic: 'Bots Playpen',
				}).then(async channel => {
					// Update the bot_cateogry reference
					bot_category = channel;

					// Create the new bot diary channel
					await createChannel(guild, {
						title: 'diary',
						type: 'text',
						topic: 'Bots Diary',
						parent: channel.id
					}).then(async channel => {
						// Update the bot diary channel reference
						bot_diary_channel = channel;

						// Store the bot diary channel id in the database
						await db.updateConfig('bot_channel_id', channel.id);
					});
				});
			}else{
				// Update the bot category reference
				bot_category = existing_bot_category;

				// Check to make sure the diary channel exists
				if(existing_bot_diary_channel === undefined || (existing_bot_diary_channel !== undefined && existing_bot_diary_channel.parentID !== bot_category.id)) {
					// Create the new bot diary channel
					await createChannel(guild, {
						title: 'diary',
						type: 'text',
						topic: 'Bots Diary',
						parent: bot_category.id
					}).then(async channel => {
						// Update the bot diary channel reference
						bot_diary_channel = channel;

						// Store the bot diary channel id in the database
						await db.updateConfig('bot_channel_id', channel.id);
					});
				}
			}
		}else{
			// Check to see if the bot category doesn't exist
			if(existing_bot_category === undefined) {
				// Create and set the bot category instance
				await createChannel(guild, {
					title: '🤖 bot-stuff',
					type: 'category',
					topic: 'Bots Playpen',
				}).then(async channel => {
					// Update the bot_cateogry reference
					bot_category = channel;

					// Update the parent of teh diary channel
					bot_diary_channel.setParent(bot_category.id, { lockPermissions: true }).catch(console.error);
				});
			}else{
				// Update the bot category reference
				bot_category = existing_bot_category;

				// Check to make sure the diary channel exists
				if(bot_diary_channel.parentID !== bot_category.id) {
					// Update the parent of teh diary channel
					bot_diary_channel.setParent(bot_category.id, { lockPermissions: true }).catch(console.error);
				}
			}
		}
	});

	// Create the diary embed
	let embed = {
		embed: {
			title: `${ emotions[emotion].emoji } Diary Entry #${ Math.floor(Math.random() * Math.floor(9999999999)) }`,
			description: `On this day...`,
			color: emotions[emotion].color,
			footer: {
				text: "I just wanted to let you know..."
			},
			fields: [
				{
					name: "**I felt...**",
					value: `${ emotions[emotion].emoji } ${ emotion.charAt(0).toUpperCase() + emotion.slice(1) }`
				},
				{
					name: "**I did...**",
					value: `\`\`\`${ (diary_object !== undefined) ? JSON.stringify(diary_object).substring(0, 1900).replace('`', '') : 'Nothing...' }\`\`\``
				}
			]
		}
	};

	// Send the embed to the diary channel
	bot_diary_channel.send(embed);
}


/**
 *
 * @param guild is the Discord guild instance to handle
 * @param channel_properties is the object of new channel properties
 */
async function createChannel(guild, channel_properties: NewChannel) : Promise<Discord.TextChannel | Discord.CategoryChannel> {
	// Create a variable that will hold the new channel instance
	var new_channel;

	// Create the bot diary channel
	await guild.channels.create(channel_properties.title, {type: channel_properties.type, topic: channel_properties.topic, parent: channel_properties.parent}).then((channel) => {
		// Grab the respective roles
		const everyone = guild.roles.cache.find(role => role.name.toLowerCase() === "@" + "everyone");
		const admin = guild.roles.cache.find(role => role.name.toLowerCase() === "admin");
		const mod = guild.roles.cache.find(role => role.name.toLowerCase() === "moderator");

		// Update the permissions for the channel
		channel.overwritePermissions([
			{
				id: everyone.id,
				deny: ['VIEW_CHANNEL'],
			},
			{
				id: admin.id,
				allow: ['VIEW_CHANNEL'],
			},
			{
				id: mod.id,
				allow: ['VIEW_CHANNEL'],
			}
		], 'Hide everyone\'s access from this category and only allow Admins and Mods to view.');

		// Set the new channel variable
		new_channel = channel;
	});

	// Return the new channel
	return new_channel;
}