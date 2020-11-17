/**
 *
 * TimmyRB
 * November 1, 2020
 * The following file is used for function initialization for the application
 *
 * Updates
 * -------
 * November 17, 2020 -- N3rdP1um23 -- Added version & update command to the help menu
 *
 */

// Import the required items
import * as Discord from 'discord.js'
import { Permissions } from 'discord.js'
import * as db from '../database'

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
	tips.push({ 'name': 'User(s\') Info', 'value': '```!info @user[]```' });
	tips.push({ 'name': 'View RateMyProfessor info', 'value': '```!rmp profName```'});
	tips.push({ 'name': 'Get days until an event (mainly holiday)', 'value': '```!daysUntil event name```'});

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