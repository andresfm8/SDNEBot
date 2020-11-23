/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle displaying user info
 *
 * Updates
 * -------
 * November 20, 2020 -- N3rdP1um23 -- Added more info to the user command
 * November 23, 2020 -- N3rdP1um23 -- Added serverinfo command
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import * as moment from 'moment';
import { channel } from '.';
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
 * The following function is used to handle displaying info about a user
 *
 * @param message: is the message to handle
 *
 */
export function displayUserInfo(message: Discord.Message) {
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

/**
 *
 * The following function is used to handle displaying info about the server
 *
 * @param message: is the message to handle
 *
 */
export async function displayServerInfo(message: Discord.Message) {
    // Grab the guild
    var guild = message.guild;

    // Initialize the embed object
    let embed = {
        embed: {
            title: `${ guild.name }`,
            description: `This server was created on ${ moment(guild.createdTimestamp).format('MMM DD, YYYY @ HH:mm') }!`,
            color: 3066993,
            footer: {
                text: ``
            },
            fields: [
                {
                    name: '**Members**',
                    value: `**Users online:** ${ guild.members.cache.filter(member => member.presence.status === 'online').size }/${ guild.memberCount }\n**Humans:** ${ guild.members.cache.filter(member => !member.user.bot).size } - **Bots:** ${ guild.members.cache.filter(member => member.user.bot).size }`,
                    inline: true
                },
                {
                    name: '**Channels**',
                    value: `**:speech_balloon: Text:** ${ guild.channels.cache.filter(channel => channel.type === 'text').size }\n**:loud_sound: Voice:** ${ guild.channels.cache.filter(channel => channel.type === 'voice').size }`,
                    inline: true
                },
                {
                    name: '**Utility**',
                    value: `**Owner:** <@${ guild.owner.id }>\n**Voice Region:** ${ guild.region }\n**Server Id:** ${ guild.id }`,
                },
                {
                    name: '**Misc**',
                    value: `**AFK Channel:** ${ (guild.afkChannelID !== null) ? `<#${ guild.afkChannelID }>` : 'None' }\n**AFK Timeout:** ${ guild.afkTimeout/60 } mins\n**Custom Emojis:** ${ guild.emojis.cache.filter(emoji => emoji.deletable).size }\n**Roles:** ${ guild.roles.cache.size }`,
                },
                {
                    name: '**Server Features**',
                    value: (guild.features.length > 0) ? guild.features.forEach(feature => `:greenTick: ${ feature }`) : 'None',
                },
            ]
        }
    };

    // Check to see if the server has an avatar
    if(guild.iconURL() !== null) {
        // Set the embed thumbnail to the servers avatar
        embed['embed']['thumbnail'] = {
            'url': guild.iconURL({ dynamic: true, size: 4096 })
        };
    }

    // Send the embed message
    message.channel.send(embed);

    // Return to stop further processing
    return;
}