/**
 *
 * TimmyRB
 * November 1, 2020
 * The following file is used for handling reactions
 *
 * Updates
 * -------
 * November 1, 2020 -- N3rdP1um23 -- Updated execution of commands and cleaned up file, updated the cbp to be a random number between 1-500
 * November 17, 2020 -- N3rdP1um23 -- Added version & update commands
 * November 18, 2020 -- N3rdP1um23 -- Added archive command
 *
 */

// Import the required items
import * as Discord from 'discord.js';
import * as db from '../../database';
import { Permissions } from 'discord.js';
import { bot } from '../../bot';
import { commandPrefix, editChannel, deletedChannel } from '../globVars';
import { hasAttachment, hasURL } from '../funcs';
import * as commands from '../Commands';

/**
 *
 * The following function is used to handle messages
 *
 * @param message: is the message to handle
 *
 */
export function handleMessage(message: Discord.Message) {
	// Check to see if the message doesn't start with the command prefix, is a bot message, system message, or in a dm or news channel
	if(message.author.bot || message.system || message.channel.type === 'dm' || message.channel.type === 'news') {
		// Return to stop further processing
		return;
	}

	// Grab the user from the database and handle if their muted
	db.getUser(message.author.id, message.author.username, (user: Object) => {
		// Check to see if the user is muted
		if (user['muted'] === true) {
			// Delete the message and return to stop further processing
			message.delete();
			return;
		}
	});

	// Update the users contribution points
	db.updateUser(message.author.id, message.author.username, undefined, undefined, undefined, ((message.content.length / (Math.random() * (500 - 1) + 1)) || 0), true)

	// Define the respective variables
	var raw_message = message.content.trim().toLowerCase();
	const args: Array<string> = message.content.slice(commandPrefix.length).trim().split(/ +/);
	const command: string = args.shift().toLowerCase();

	// Check to see if the user would like to execute a command
	if(raw_message.startsWith(commandPrefix)) {
		// Check to see if the user is executing the help command
		if(command === 'help') {
			// Call the help command and return to stop further processing
			commands['help_menu'].displayMenu(message);
			return;
		}

		// Check to see if the user is executing the rmp command
		if(command === 'rmp') {
			// Call the help command and return to stop further processing
			commands['rate_my_prof'].rateProf(message, args);
			return;
		}

		// Check to see if the user is executing the info command
		if(command === 'info') {
			// Call the help command and return to stop further processing
			commands['info'].displayInfo(message);
			return;
		}

		// Check to see if the user is executing the rules command
		if(command === 'rules') {
			// Call the help command and return to stop further processing
			commands['rules'].displayRules(message);
			return;
		}

		// Check to see if the user is executing the free/hosting command
		if(command === 'free' || command === 'hosting') {
			// Call the help command  and return to stop further processing
			commands['hosting'].displayHostingDetails(message);
			return;
		}

		// Check to see if the user is executing the daysUntil command
		if(command === 'daysuntil') {
			// Call the help command and return to stop further processing
			commands['days_until'].displayDaysUntilEvent(message, args);
			return;
		}

		// Check to see if the user is executing the make command
		if(command === 'make') {
			// Call the help command and return to stop further processing
			commands['make'].creatChannel(message, args);
			return;
		}

		// Check to see if the message author has permissions to manage roles
		if(message.member.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
			// Check to see if the user is executing the assignInfo command
			if(command === 'assigninfo') {
				// Call the help command and return to stop further processing
				commands['assign_info'].displayAssignInfo(message);
				return;
			}
		}

		// Check to see if the message author has permissions to manage messages
		if(message.member.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES)) {
			// Check to see if the user is executing the cleanup command
			if(command === 'cleanup') {
				// Call the help command and return to stop further processing
				commands['cleanup'].cleanupMessages(message, args);
				return;
			}

			// Check to see if the user is executing the restart command
			if(command === 'restart') {
				// Call the help command and return to stop further processing
				commands['restart'].restartBot(message);
				return;
			}

			// Check to see if the user is executing the introinfo command
			if(command === 'introinfo') {
				// Call the help command and return to stop further processing
				commands['intro_info'].displayIntroInformation(message);
				return;
			}
		}

		// Check to see if the message author has permissions to kick members
		if(message.member.hasPermission(Permissions.FLAGS.KICK_MEMBERS)) {
			// Create a variable that will hold as the color for the embed
			let color = 16725558;

			// Check to see if the user is executing the mute command
			if(command === 'mute') {
				// Call the help command and return to stop further processing
				commands['mute_unmute'].mute(message, color);
				return;
			}

			// Check to see if the user is executing the unmute command
			if(command === 'unmute') {
				// Call the help command and return to stop further processing
				commands['mute_unmute'].unmute(message, color);
				return;
			}

			// Check to see if the user is executing the warn command
			if(command === 'warn') {
				// Call the help command and return to stop further processing
				commands['warn'].warnUsers(message, args, color);
				return;
			}

			// Check to see if the user is executing the version command
			if(command === 'version') {
				// Call the help command and return to stop further processing
				commands['version'].displayVersionDetails(message);
				return;
			}

			// Check to see if the user is executing the update command
			if(command === 'update') {
				// Call the help command and return to stop further processing
				commands['update'].updateBot(message);
				return;
			}

			// Check to see if the user is executing the channel command
			if(command === 'channel') {
				// Create a variable that will hold the action value
				let action = args.shift();

				// Check to see if the action argument is valid
				if(['archive', 'clone'].includes(action)) {
					// Execute the respective action
					commands['channel'][action](message, args);
				}else{
					// Send an error message
					message.channel.send('Oops... Missing channel action to execute.');
				}

				// Return to stop further processing
				return;
			}
		}
	}

	// Check to see if someone flipped a table or used the table flip command
	if(raw_message.includes('(╯°□°）╯︵ ┻━┻') || raw_message.includes('/tableflip')) {
		// Unflip the table
		message.channel.send('┬─┬ ノ( ゜-゜ノ)');
	}

	// Check to see if someone attempted a command and it wasn't valid
	if(raw_message.startsWith('!')) {
		// React to the message with a question mark as the command isn't valid and then return to stop further processing
		message.react('❓');
		return;
	}

	// Check to see if the message as an attachment or is a URL
	if(hasAttachment(message) || hasURL(message)) {
		// Add the respective reactions to the message
		message.react('👍').then(() => {
			// Append the next reaction to the message
			message.react('👎').then(() => {
				// Append the next reaction to the message
				message.react('📌').catch(console.error);
			}).catch(console.error);
		}).catch(console.error);
	}
}

/**
 *
 * The following function is used to handle deleted messages
 *
 * @param message: is the respective message to handle
 *
 */
export async function handleMessageDelete(message: Discord.Message | Discord.PartialMessage) {
	// Try and process the deleted message
	try {
		// Check to see if the message is partial
		if(message.partial) {
			// Await for the full message
			await message.fetch().catch(console.error);
		}

		// Check to see if the message author is a bot, a ssystem message, or in a DM/news channel
		if(message.author.bot || message.system || message.channel.type === 'dm' || message.channel.type === 'news') {
			// Return to stop further processing
			return;
		}

		// Create a variable that will hold the deleted messsages channel
		let id = await db.getConfig('deletedChannel');

		// Check to see if the config value is null
		if(id === undefined) {
			// Update the edit column value
			await db.updateConfig('deletedChannel', editChannel);

			// Set the id to the edit channel id
			id = editChannel;
		}

		// Create a variable that will hold the respective delete channel instance
		let channel = <Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel>bot.guilds.cache.first().channels.cache.get(id);

		// Check to see if the channel the message is in is the same channel as the deleted messages channel
		if(message.channel === channel) {
			// Return to stop further processing
			return;
		}

		// Grab the users nickname or default to their username
		let nick = (message.member.nickname ? message.member.nickname : message.author.username);

		// Grab the respective message contents
		let content = message.content.replace(/`/g, '');

		// Send the deleted message to the deleted messages channel
		channel.send(`**${nick}'s message in <#${message.channel.id}> was deleted:**\`\`\`${content}\`\`\``).catch(console.error);
	}catch(exception) {
		// Log the exception
		console.error(exception);
	}
}

/**
 *
 * The following function is used to handle edited messages
 *
 * @param oldMessage: is the old message to handle
 * @param newMessage: is the new message to handle
 *
 */
export async function handleMessageEdit(oldMessage: Discord.Message | Discord.PartialMessage, newMessage: Discord.Message | Discord.PartialMessage) {
	// Try and process the edited message
	try {
		// Check to see if the old message is partial
		if(oldMessage.partial) {
			// Await for the full message
			await oldMessage.fetch();
		}
		// Check to see if the new message is partial
		if(newMessage.partial) {
			// Await for the full message
			await newMessage.fetch();
		}

		// Check to see if the message author is a bot, a ssystem message, or in a DM/news channel
		if(newMessage.author.bot || newMessage.system || newMessage.channel.type === 'dm' || newMessage.channel.type === 'news') {
			// Return to stop further processing
			return;
		}

		// Grab the user and check if they're muted
		db.getUser(newMessage.author.id, newMessage.author.username, (user: Object) => {
			// Check to see if the user is muted
			if(user['muted'] === true) {
				// Delete the message
				newMessage.delete();
			}
		});

		// Create a variable that will hold the edited messsages channel
		let id = await db.getConfig('editedChannel');

		// Check to see if the config value is null
		if(id === undefined) {
			// Update the edit column value
			await db.updateConfig('editedChannel', deletedChannel);

			// Set the id to the edit channel id
			id = deletedChannel;
		}

		// Create a variable that will hold the respective edit channel instance
		let channel = <Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel>bot.guilds.cache.first().channels.cache.get(id);

		// Grab the users nickname or default to their username
		let nick = (newMessage.member.nickname ? newMessage.member.nickname : newMessage.author.username);

		// Grab the respective message contents
		let oldContent = oldMessage.content.replace(/`/g, '');
		let newContent = newMessage.content.replace(/`/g, '');

		// Send the edited message to the edited messages channel
		channel.send(`**${nick} changed their message in <#${oldMessage.channel.id}> from:**\`\`\`${oldContent}\`\`\`**to:**\`\`\`${newContent}\`\`\``).catch(console.error);
	}catch(exception) {
		// Log the exception
		console.error(exception);
	}
}