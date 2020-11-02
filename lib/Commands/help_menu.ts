/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle displaying the help menu
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import { setHelpPage } from '../globVars';
import { help } from '../funcs';

/**
 *
 * The following function is used to handle displaying the help menu
 *
 * @param message: is the message to handle
 *
 */
export function displayMenu(message: Discord.Message) {
    // Call the functions that will help display the help menu
    setHelpPage(help(message.member, 0, message.channel));
}