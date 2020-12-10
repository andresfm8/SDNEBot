/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle warning mentioned users
 *
 * Updates
 * -------
 * November 20, 2020 -- N3rdP1um23 -- Updated to use new log handler
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import { Permissions } from 'discord.js';
import * as db from '../../database';
import { diary } from '../funcs';
import { rules } from '../globVars';

/**
 *
 * The following function is used to handle warning mentioned users
 *
 * @param message: is the message to handle
 * @param args: is the array of passed arguments
 * @param color: is the color for the embed
 *
 */
export function warnUsers(message: Discord.Message, args, color) {
    // Check to see if no users were mentioned
	if(message.mentions.users.first() === undefined) {
		// React with a question mark as the command wasn't complete and return to stop further processing
		message.react('❓');
		return;
	}

	// Define the required variables
	let ruleNum = Number.parseInt(args[0]);
	var warned: string = '';

	// Check to see if the rule number is valid
	if(ruleNum === NaN || ruleNum > rules.length || ruleNum < 1) {
		// React to the message with a question mark as the commant rule wasn't correct and return to stop processing further
		message.react('❓');
		return;
	}

	// Initialize the embed object
	var embed = {
		embed: {
			title: `🚩 Rule Violation`,
			description: 'You violated:',
			color: color,
			timestamp:  new Date(),
			fields: [
				{
					name: `**${rules[ruleNum - 1].title}**`,
					value: `${rules[ruleNum - 1].rule}`,
				}
			]
		}
	};

	// Iterate though the mentioned users and handle accordingly
	message.mentions.users.array().forEach(mention => {
		// Check to see if the respective user has the permission to kick memebers
		if(message.guild.member(mention).hasPermission(Permissions.FLAGS.KICK_MEMBERS)) {
			// Return to stop further processing
			return;
		}

		// Update the user in the database
		db.getUser(mention.id, mention.username, (userData: Object) => {
			// Update the users warn count
			db.updateUser(mention.id, mention.username, 1, undefined, undefined, undefined, true);

			// Increment the warn count
			userData['warns'] += 1;

			// Check to see if the user has more than 3 warnings
			if(userData['warns'] % 3 === 0 && userData['warns'] !== 0) {
				// Update the users kick count
				db.updateUser(mention.id, mention.username, undefined, 1, undefined, undefined, true);

				// Increment the users kick count
				userData['kicks'] += 1;

				// Check to see if the user has more than 3 kicks
				if(userData['kicks'] % 3 === 0 && userData['kicks'] !== 0) {
					// Send a DM to the user mentinoed that they've been banned for violating the respective rules
					message.guild.member(mention).send(`**You have been banned for violating the rules:**`, embed).then(() => {
						// Ban the user from the server
						message.guild.member(mention).ban({ reason: `${mention.username} banned because they have ${userData['kicks']} kicks.` });
					});
				}else{
					// Send a DM to the user mentioning that they've been kicked from the server for violating the respective rules
					message.guild.member(mention).send(`**You have been kicked for violating the rules:**`, embed).then(() => {
						// Kick the user from the server
						message.guild.member(mention).kick(`${mention.username} kicked because they have ${userData['warns']} warnings.`);
					});
				}
			}
		});

		// Check to see if the wanred users list is empty
		if(warned === '') {
			// Apppend the warned user
			warned += `<@${mention.id}>`;
		}else{
			// Append the warned user
			warned += `, <@${mention.id}>`;
		}
	});

	// Check to see if the warned list isn't empty
	if (warned !== '') {
		// Send the embed to the channel and then delete the original message
		message.channel.send(warned, embed).then(() => message.delete().catch(error => diary('sad', message, error)));
	}else{
		// React to the request with a question mark as the command either wasn't complete or something else happened
		message.react('❓');
	}

    // Return to stop further processing
    return;
}