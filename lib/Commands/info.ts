/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle displaying user info
 *
 * Updates
 * -------
 * November 20, 2020 -- N3rdP1um23 -- 
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import * as moment from 'moment';
import * as db from '../../database';

// Define global helper arrays
const status_emoji = {
    online: ':green_circle:',
    idle: ':orange_circle:',
    offline: ':white_circle:',
    dnd: ':red_circle:',
};

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
        // Grab the member and their nickname
        let member = message.guild.member(mention);
        let nick = (member.nickname ? member.nickname : mention.username);

        // Query the database for the respective user
        db.getUser(mention.id, mention.username, (userData: Object) => {
            // grab the time that the user was last updated
            let time: string = userData['lastUpdated'];

            // Initialize the embed object
            let embed = {
                embed: {
                    title: `${status_emoji[member.user.presence.status]} ${nick}'s Information`,
					url: `${member.user.avatarURL().toString()}`,
                    description: `Chilling in ${member.user.presence.status.replace('dnd', 'do not disturb')} status!`,
                    color: ((member.roles.cache.size > 0) ? member.roles.cache.first().color : 3066993),
                    footer: {
                        text: `User Id: ${member.user.id} | Last Updated: ${ moment.unix(Number(time)).format('MMM DD, YYYY @ HH:mm') }`
                    },
                    fields: [
                        {
                            name: '**Warns**',
                            value: `\`\`\`${ userData['warns'] }\`\`\``,
                            inline: true
                        },
                        {
                            name: '**Kicks**',
                            value: `\`\`\`${ userData['kicks'] }\`\`\``,
                            inline: true
                        },
                        {
                            name: '**Muted**',
                            value: `\`\`\`${ userData['muted'] }\`\`\``,
                            inline: true
                        },
                        {
                            name: '**Contribution Points**',
                            value: `\`\`\`${ Math.round(userData['cbp']) }\`\`\``,
                        },
                        {
                            name: '**Joined Discord on**',
                            value: `${ moment(member.user.createdTimestamp).format('MMM DD, YYYY @ HH:mm') }\n(${ moment(member.user.createdTimestamp).fromNow() })`,
                            inline: true
                        },
                        {
                            name: '**Joined this server on**',
                            value: `${ moment(member.joinedTimestamp).format('MMM DD, YYYY @ HH:mm') }\n(${ moment(member.joinedTimestamp).fromNow() })`,
                            inline: true
                        },
                        {
                            name: '**Roles**',
                            value: member.roles.cache.filter(role => role.name !== '@' + 'everyone').map(role => `<@&${role.id}>`).join(', ')
                        }
                    ]
                }
            };

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