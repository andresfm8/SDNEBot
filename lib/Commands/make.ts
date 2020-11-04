/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle creating a channel
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import { roles, yearChannels } from '../globVars';

/**
 *
 * The following function is used to handle creating a channel
 *
 * @param message: is the message to handle
 * @param args: is the array of events
 *
 */
export function creatChannel(message: Discord.Message, args) {
    // Check to see if no parameters were passed
	if(args.length === 0) {
		// React with a question mark as the user hasn't entered an event name and then return to stop further processing
		message.react('❓');
		return;
	}

	// Create the required variables
	let channelName: string = args.join(' ');
	let created: Boolean = false;

	// Iterate over each of the roles for the user that is requested to make a channel and process accordingly
	message.member.roles.cache.forEach(role => {
		// Check to see if the user has the year one role
		if(role === roles['📗']) {
			// Create the channel until the Year 1 parent channel
			message.guild.channels.create(channelName, {parent: message.guild.channels.resolve(yearChannels[0]), topic: `Created by **${message.member.nickname}**`}).then(() => {
				// React to the message from the user with an okay emoji to show that the channel was created
				message.react('👌');
			});

			// Update the created value to true and return to stop processing further
			created = true;
			return;
		}else if(role === roles['📘']) {
			// Create the channel until the Year 2 parent channel
			message.guild.channels.create(channelName, {parent: message.guild.channels.resolve(yearChannels[1]), topic: `Created by **${message.member.nickname}**`}).then(() => {
				// React to the message from the user with an okay emoji to show that the channel was created
				message.react('👌');
			});

			// Update the created value to true and return to stop processing further
			created = true;
			return;
		}else if(role === roles['📙']) {
			// Create the channel until the Year 3 parent channel
			message.guild.channels.create(channelName, {parent: message.guild.channels.resolve(yearChannels[2]), topic: `Created by **${message.member.nickname}**`}).then(() => {
				// React to the message from the user with an okay emoji to show that the channel was created
				message.react('👌');
			});

			// Update the created value to true and return to stop processing further
			created = true;
			return;
		}
	})

	// Check to see if the channel wasn't created
	if(!created) {
		//  Replay an error message to the user
		message.reply('You need to assign a year before creating channels!');
	}

    // Return to stop further processing
    return;
}