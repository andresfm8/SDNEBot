/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle displaying the introduction information
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
 * The following function is used to handle displaying the introduction information
 *
 * @param message: is the message to handle
 *
 */
export function displayIntroInformation(message: Discord.Message) {
    // Define a variable that is used to formulate the introduction information message
    let desc: string = '';
    desc += `Welcome to the introduction channel! This is the place to introduce yourself, make new friends and to connect with your fellow peers! We highly encourage you all connect with each other, don't be shy! Who knows, maybe the friends you make will be your group in a hackathon?`;
    desc += `\n\nReady to introduce yourself? Follow the format below, you don't have to follow it exactly but it's a good guideline. You can add your socials (LinkedIn, GitHub, Instagram, Twitter, etc) if you have any. If not, we recommend making a LinkedIn. It's a great networking tool in the industry.`;
    desc += `\n\`\`\`Name:\n\nProgram:\n\nYear/Semester:\n\nAbout You (Hobbies/Passions):\n\nSocials (LinkedIn, GitHub, Instagram, Twitter, etc):\`\`\``;

    // Initialize the introduction embed
    let introEmbed = {
        embed: {
            title: "Introduction Info",
            description: desc,
            color: 3553599
        }
    };

    // Send the embed to the channel and then delete the message
    message.channel.send(introEmbed);
    message.delete().catch(error => diary('sad', message.guild, error));

    // Return to stop further processing
    return;
}