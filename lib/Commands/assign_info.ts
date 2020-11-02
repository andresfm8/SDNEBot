/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle displaying the assign info embed
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import * as db from '../../database';

/**
 *
 * The following function is used to handle displaying the assign info embed
 *
 * @param message: is the message to handle
 *
 */
export function displayAssignInfo(message: Discord.Message) {
    // Initialise the embed
    let embed = {
        embed: {
            title: 'Role Assignment Info',
            description: 'Click a corresponding reaction to set your year & campus and gain access to the other channels!',
            color: 33023,
            timestamp:  new Date(),
            fields: [
                {
                    name: '📗',
                    value: 'First Years',
                    inline: true
                },
                {
                    name: '📘',
                    value: 'Second Years',
                    inline: true
                },
                {
                    name: '📙',
                    value: 'Third Years',
                    inline: true
                },
                {
                    name: '🧾',
                    value: 'Alumni',
                    inline: true
                },
                {
                    name: '1️⃣',
                    value: 'Trafalgar Campus',
                    inline: true
                },
                {
                    name: '2️⃣',
                    value: 'Davis Campus',
                    inline: true
                }
            ]
        }
    };

    // Delete the users message
    message.delete().catch(console.error);

    // Send the embed to the channel
    message.channel.send(embed).then((embed_message: Discord.Message) => {
        // Add the respective reactions to the message
        embed_message.react('📗').then(() => {
            // React with the next respective command
            embed_message.react('📘').then(() => {
                // React with the next respective command
                embed_message.react('📙').then(() => {
                    // React with the next respective command
                    embed_message.react('🧾').then(() => {
                        // React with the next respective command
                        embed_message.react('1️⃣').then(() => {
                            // React with the next respective command
                            embed_message.react('2️⃣').then(() => {});
                        });
                    });
                });
            });
        });

        // Update the config value that will hold the assign roles id
        db.updateConfig('assign', message.id);
    });

    // Return to stop further processing
    return;
}