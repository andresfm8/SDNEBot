/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle cleaning up messages
 *
 * Updates
 * -------
 * November 20, 2020 -- N3rdP1um23 -- Updated to use new log handler
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import { diary } from '../funcs';

/**
 *
 * The following function is used to handle cleaning up the specified amount of messages in the channel
 *
 * @param message: is the message to handle
 * @param args: is the array of events
 *
 */
export function cleanupMessages(message: Discord.Message, args) {
    // Check to see if no parameters were passed
	if(args.length === 0) {
		// React with a question mark as the user hasn't entered an event name and then return to stop further processing
		message.react('❓');
		return;
	}

	// Create a variable that will parse the requested amount of messages to remove
	let amount: number = Number.parseInt(args[0]);

	// Check to see if the mount isn't a number
	if(isNaN(amount) || amount < 1) {
		// React with a question mark as the operation isn't corrent and then return to stop further processing
		message.react('❓');
		return;
	}

	// Check to see if the amount is creater than 100
	if(amount > 100) {
		// Cap the amount at 100 messages
		amount = 100;
	}

	// Delete the message from the user
	message.delete().catch(error => diary('sad', message, error));

	if (message.channel.type === "dm" || message.channel.type === "news"){
		// React with a question mark as the operation isn't corrent and then return to stop further processing
		message.react('❓');
		return;
	}

	// Perform a bulk deletion in the channel that the original message was sent
	message.channel.bulkDelete(amount, true)
	.then((deleted) => {
		// Replay with the amount of messages deleted
		message.reply(`Deleted ${deleted.size} messages.`).then((reply) => {
			// Delete the reply after 5 seconds
			reply.delete({timeout: 5000});
		});
	})
	.catch((err: Discord.DiscordAPIError) => {
		// Replay to the user the error with executing the command
		message.reply(`${err.message}`).then((reply) => {
			// Delete the reply after 10 seconds
			reply.delete({timeout: 10000});
		});
	});

    // Return to stop further processing
    return;
}