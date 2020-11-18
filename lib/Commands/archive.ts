/**
 *
 * N3rdP1um23
 * November 18, 2020
 * The following file is used to handle archiving the respective channel
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import { AnyARecord } from 'dns';
import * as db from '../../database';

/**
 *
 * The following function is used to handle archiving the respective channel
 *
 * @param message: is the message to handle
 * @param args: is the array of events
 *
 */
export function archiveChannel(message: Discord.Message, args) {
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
					], 'Hide everyone access from the category and only allow Admins and Mods to view.');

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
			// Check to see if the channel should be recreated
			if(args[0] === 'true') {
				// Clone the channel
				await current_channel.clone();
			}

			// Handle updateing the respective channel
			current_channel.setParent(archive_category_channel.id, { lockPermissions: true }).then(() => message.channel.send('This channel has now been archived!')).catch(console.error);
		}
	});

    // Return to stop further processing
    return;
}