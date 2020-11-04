/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle displaying user info
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import * as moment from 'moment';
import * as db from '../../database';

/**
 *
 * The following function is used to handle displaying the help menu
 *
 * @param message: is the message to handle
 *
 */
export function displayInfo(message: Discord.Message) {
    // Check to see if the user didn't mention anyone in the message
    if(message.mentions.users.first() === undefined) {
        // React with a with a question mark and the return to stop further processing
        message.react('❓');
        return;
    }

    // Iterate over each of the mentions and then formulate the embed
    message.mentions.users.array().forEach(mention => {
        // Grab the users nickname
        let nick = (message.guild.member(mention).nickname ? message.guild.member(mention).nickname : mention.username);

        // Query the database for the respective user
        db.getUser(mention.id, mention.username, (userData: Object) => {
            // grab the time that the user was last updated
            let time: string = userData['lastUpdated'];

            // Initialize the embed object
            let embed = {
                embed: {
                    title: `${nick}'s Information`,
                    description: `Get a user's information`,
                    color: 3553599,
                    timestamp: moment.unix(Number(time)).toDate(),
                    footer: {
                        text: 'Last Updated'
                    },
                    fields: [
                        {
                            name: 'Warns',
                            value: `\`\`\`${ userData['warns'] }\`\`\``,
                            inline: true
                        },
                        {
                            name: 'Kicks',
                            value: `\`\`\`${ userData['kicks'] }\`\`\``,
                            inline: true
                        },
                        {
                            name: 'Muted',
                            value: `\`\`\`${ userData['muted'] }\`\`\``,
                            inline: true
                        },
                        {
                            name: 'Contribution Points',
                            value: `\`\`\`${ Math.round(userData['cbp']) }\`\`\``,
                            inline: true
                        }
                    ]
                }
            }

            // Check to see if the user has an avatar
            if(mention.avatarURL() !== null) {
                // Set the embed thumbnail to the users avatar
                embed['embed']['thumbnail'] = {
                    'url': mention.avatarURL({ dynamic: true, size: 4096 })
                };
            }

            // Send the embed message
            message.channel.send(embed);
        });
    });

    // Return to stop further processing
    return;
}