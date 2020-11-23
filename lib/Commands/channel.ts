/**
 *
 * N3rdP1um23
 * November 18, 2020
 * The following file is used to handle respective channel commands
 *
 * Updates
 * -------
 * November 20, 2020 -- N3rdP1um23 -- Removed delete message from the channel & updated to use new logging method
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import * as db from '../../database';
import { diary } from '../funcs';

/**
 *
 * The following function is used to handle archiving the respective channel
 *
 * @param message: is the message to handle
 * @param args: is the array of arguments
 *
 */
export function archive(message: Discord.Message, args) {
    // Check to see if no parameters were passed
	if(args.length === 1 && (args[0] !== 'true' && args[0] !== 'false')) {
		// React with a question mark as the user hasn't entered a valid option and then return to stop further processing
		message.react('❓');
		return;
	}

	// Create the required variables
	var archive_category_channel;

	// Check to see if there's an archive category
	db.getConfig('archive_category_id').then(async (result) => {
		// Check to make sure the value isn't undefined
		if(result !== undefined) {
			// Grab the archived category channel
			archive_category_channel = message.guild.channels.cache.find(channel => channel.id === result);
		}else{
			// Create the required variables
			var category_channels = message.guild.channels.cache.filter(channel => channel.type === 'category');
			var existing_archive_channel = category_channels.find(channel => channel.name.toLowerCase().includes('archive'));

			// Check to see if an existing channel wasn't found
			if(existing_archive_channel === undefined) {
				// Create the archive channel
				await message.guild.channels.create('📁 Archived', {type: 'category', topic: `Holds all archived channels from the server`}).then((channel) => {
					// Grab the respective roles
					const everyone = message.guild.roles.cache.find(role => role.name.toLowerCase() === "@" + "everyone");
					const admin = message.guild.roles.cache.find(role => role.name.toLowerCase() === "admin");
					const mod = message.guild.roles.cache.find(role => role.name.toLowerCase() === "moderator");

					// Update the permissions for the category
					channel.overwritePermissions([
						{
							id: everyone.id,
							deny: ['VIEW_CHANNEL'],
						},
						{
							id: admin.id,
							allow: ['VIEW_CHANNEL'],
						},
						{
							id: mod.id,
							allow: ['VIEW_CHANNEL'],
						}
					], 'Hide everyone\'s access from this category and only allow Admins and Mods to view.');

					// Update the archived_category_channel variable
					archive_category_channel = channel;
				});
			}else{
				// Set the archive channel
				archive_category_channel = existing_archive_channel;
			}

			// Make the category and then store the id in the database
			await db.updateConfig('archive_category_id', archive_category_channel.id);
		}

		// Grab the current channel in question
		var current_channel = message.guild.channels.cache.find(channel => channel.id === message.channel.id);

		// Check to see if the channel is already archived
		if(current_channel.parent.id === archive_category_channel.id) {
			// Send an error message that the channel is already archived
			message.channel.send('This channel is already archived! (╯°□°）╯︵ ┻━┻');
		}else{
			// Create a variable that will hold the clonsed channel
			var cloned_channel;
			let clone_channel = args.shift();

			// Check to see if the channel should be cloned
			if(clone_channel === 'true') {
				// Clone the channel
				cloned_channel = await current_channel.clone();
			}

			// Formulate the archive embed
			let archive_embed = {
				embed: {
					title: `Channel Archived`,
					description: `This channel has now been archived.`,
					color: 4886754,
					timestamp: new Date(),
					fields: [
						{
							name: "Was the channel cloned?",
							value: `${(clone_channel === 'true') ? `\`Yes - New Channel\` <#${cloned_channel.id}>` : '\`\`\`No\`\`\`'}`,
						},
						{
							name: "Archived by",
							value: `<@${message.member.user.id}>`,
						},
						{
							name: "Reason",
							value: `\`\`\`${(args.length > 0) ? args.join(' ') : 'N/A'}\`\`\``,
						}
					]
				}
			};

			// Handle updateing the respective channel
			current_channel.setParent(archive_category_channel.id, { lockPermissions: true }).then(() => message.channel.send(archive_embed)).catch(error => diary('sad', message.guild, error));
		}
	});

    // Return to stop further processing
    return;
}

/**
 *
 * The following function is used to handle cloning the respective channel
 *
 * @param message: is the message to handle
 * @param message: is the passed parameters
 *
 */
export async function clone(message: Discord.Message, args) {
	// Grab the current channel in question
	var current_channel = message.guild.channels.cache.find(channel => channel.id === message.channel.id);

	// Create a variable that will hold the clonsed channel
	var cloned_channel;

	// Clone the channel
	cloned_channel = await current_channel.clone();

	// Formulate the clone embed
	let clone_embed = {
		embed: {
			title: `Channel Clonned`,
			description: `This channel has now been cloned.`,
			color: 4886754,
			timestamp: new Date(),
			fields: [
				{
					name: "Cloned from",
					value: `<#${cloned_channel.id}>`,
				},
				{
					name: "Cloned to",
					value: `<#${cloned_channel.id}>`,
				},
				{
					name: "Cloned by",
					value: `<@${message.member.user.id}>`,
				},
				{
					name: "Reason",
					value: `\`\`\`${(args.length > 0) ? args.join(' ') : 'N/A'}\`\`\``,
				}
			]
		}
	};

	// Send the notive to the channel
	message.channel.send(clone_embed);

    // Return to stop further processing
    return;
}

/**
 *
 * The following function is used to handle removing the respective channel
 *
 * @param message: is the message to handle
 * @param message: is the passed parameters
 *
 */
export async function remove(message: Discord.Message, args) {
	// Grab the current channel in question
	var current_channel = message.guild.channels.cache.find(channel => channel.id === message.channel.id);

	// Confirm with the user that they want to actually remove the channel
	message.reply('The bot will now remove this channel.\nConfirm with `yes` or deny with `no`.');

	// Await for a reply - must be send from the OG user, only accept one message, and await fro 30s
	message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 30000}).then(async response => {
		// first (and, in this case, only) message of the collection
		if(response.first().content.toLowerCase() === 'yes') {
			// Remove the channel
			await current_channel.delete();
		}else{
			// Reply with a failed message
			message.reply('Aborted channel removal.');
		}
	}).catch(() => {
		// Reply with a failed message
		message.reply('Aborted channel removal.');
	});

    // Return to stop further processing
    return;
}