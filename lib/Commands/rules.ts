/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle displaying the rules of the server
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import { Permissions } from 'discord.js';
import { rules } from '../globVars';

/**
 *
 * The following function is used to handle displaying the server rules
 *
 * @param message: is the message to handle
 *
 */
export function displayRules(message: Discord.Message) {
    // Create a variable that's used to determing if the message should be sent in a DM or not
    let dm = false;

    // Iterate over each of the rules and handle accordingly
    rules.forEach(rule => {
        // Initialize the embed object
        let embed = {
            embed: {
                title: `${rule.title}`,
                description: `${rule.rule}`,
                color: 3553599
            }
        };

        // Check to see if the user has permissions to manage messages
        if(message.member.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES)) {
            // Send the embed message to the respective channel the message was sent in
            message.channel.send(embed);
        }else{
            // DM the user the embeded message and set the DM flag to true
            message.member.send(embed);
            dm = true;
        }
    });

    // Attempt to delete the original message from the user
    message.delete().catch(console.error);

    // Check to see if the message should be sent to the users DMs
    if(dm) {
        // Reply with a message notifying the user to check their DMs
        message.reply('Check your DMs!');
    }

    // Return to stop further processing
    return;
}