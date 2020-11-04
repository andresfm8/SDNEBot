/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle displaying the free hosting details
 *
 */

// Import the requried items
import * as Discord from 'discord.js';

/**
 *
 * The following function is used to handle displaying the free hosting link
 *
 * @param message: is the message to handle
 *
 */
export function displayHostingDetails(message: Discord.Message) {
    // Replay with the link about hosting
    message.reply('https://educate.scuffdesign.co/articles/getting-github-student-developer-pack');

    // Return to stop further processing
    return;
}