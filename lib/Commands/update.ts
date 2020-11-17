/**
 *
 * N3rdP1um23
 * November 17, 2020
 * The following file is used to handle updating the bot
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

/**
 *
 * The following function is used to handle updating the bot
 *
 * @param message: is the message to handle
 *
 */
export async function updateBot(message: Discord.Message) {
    // React to the message in acknowledgement of the update
    message.react('👌').then(async () => {
        // Update the repo from master
        exec('git pull origin master').then((output) => {
            // Finalize the output
            let status = output.stdout.replace('\n', '');

            // Send the output message to the channel
            message.channel.send(status).then(() => {
                // Check to see if the bot isn't up to date
                if(status !== 'Already up to date.') {
                    // Kill bot process
                    process.exit(0);
                }
            });
        });
	});

    // Return to stop further processing
    return;
}