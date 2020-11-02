/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle muting/unmuting mentioned users
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import { Permissions } from 'discord.js';
import * as db from '../../database';

/**
 *
 * The following function is used to handle muting mentioned users
 *
 * @param message: is the message to handle
 * @param color: is the color for the embed
 *
 */
export function mute(message: Discord.Message, color) {
    // Check to see if no users were mentioned
	if(message.mentions.users.first() === undefined) {
		// React with a question mark as the command wasn't complete and return to stop further processing
		message.react('❓');
		return;
	}

	// Define a varible that's used to hold unmuted users
	let mutedUsers: string = '';

	// Iterate over each of the mentinoed users and handle them aCCORDINGLY
	message.mentions.users.array().forEach(user => {
		// Check to see if the respective user has the permission to kick memmbers
		if(message.guild.member(user).hasPermission(Permissions.FLAGS.KICK_MEMBERS)) {
			// Return to stop processing further
			return;
		}

		// Update the user in the database
		db.updateUser(user.id, user.username, undefined, undefined, true);

		// Grab the nickname of the user or fallback to their username
		let nick: string = (message.guild.member(user).nickname ? message.guild.member(user).nickname : user.username);

		// Check to see if the grabbed muted user is empty
		if(mutedUsers === '') {
			// Add the nickname to the muted users string
			mutedUsers += nick;
		}else{
			// Append the muted users nickname
			mutedUsers += `, ${nick}`;
		}
	});

	// Initialize the embed object
	let embed = {
		embed: {
			title: `🔈 Mute Users`,
			color: color,
			timestamp:  new Date(),
			fields: [
				{
					name: 'Successfully Muted:',
					value: `\`\`\`${mutedUsers}\`\`\``,
				}
			]
		}
	};

	// Check to see if the muted users list isn't empty
	if(mutedUsers !== '') {
		// Send the embed to the channel the command was executed in
		message.channel.send(embed);
	}else{
		// React to the request with a question mark as the command either wasn't complete or something else happened
		message.react('❓');
	}

    // Return to stop further processing
    return;
}

/**
 *
 * The following function is used to handle unmuting mentioned users
 *
 * @param message: is the message to handle
 * @param color: is the color for the embed
 *
 */
export function unmute(message: Discord.Message, color) {
    // Check to see if no users were mentioned
	if(message.mentions.users.first() === undefined) {
		// React with a question mark as the command wasn't complete and return to stop further processing
		message.react('❓');
		return;
	}
	// Define a varible that's used to hold muted users
	let unmutedUsers: string = '';

	// Iterate over each of the mentinoed users and handle them aCCORDINGLY
	message.mentions.users.array().forEach(user => {
		// Check to see if the respective user has the permission to kick memmbers
		if(message.guild.member(user).hasPermission(Permissions.FLAGS.KICK_MEMBERS)) {
			// Return to stop processing further
			return;
		}

		// Update the user in the database
		db.updateUser(user.id, user.username, undefined, undefined, false);

		// Grab the nickname of the user or fallback to their username
		let nick: string = (message.guild.member(user).nickname ? message.guild.member(user).nickname : user.username);

		// Check to see if the grabbed muted user is empty
		if(unmutedUsers === '') {
			// Add the nickname to the muted users string
			unmutedUsers += nick;
		}else{
			// Append the muted users nickname
			unmutedUsers += `, ${nick}`;
		}
	});

	// Initialize the embed object
	let embed = {
		embed: {
			title: `🔊 Unmute Users`,
			color: color,
			timestamp:  new Date(),
			fields: [
				{
					name: 'Successfully Unmuted:',
					value: `\`\`\`${unmutedUsers}\`\`\``,
				}
			]
		}
	};

	// Check to see if the unmuted users list isn't empty
	if(unmutedUsers !== '') {
		// Send the embed to the channel the command was executed in
		message.channel.send(embed);
	}else{
		// React to the request with a question mark as the command either wasn't complete or something else happened
		message.react('❓');
	}

    // Return to stop further processing
    return;
}