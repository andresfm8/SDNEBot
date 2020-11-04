/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle restarting the bot
 *
 */

// Import the requried items
import * as Discord from 'discord.js';

/**
 *
 * The following function is used to handle restarting the bot
 *
 * @param message: is the message to handle
 *
 */
export function restartBot(message: Discord.Message) {
	// React to the message in acknowledgement of the restart
    message.react('👌').then(() => {
		// Kill bot process
		process.exit(0);
	});

    // Return to stop further processing
    return;
}