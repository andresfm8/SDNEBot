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

			// Check to see if the channel should be cloned
			if(args[0] === 'true') {
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
							value: `${(args[0] === 'true') ? `\`Yes - New Channel\` <#${cloned_channel.id}>` : '\`\`\`No\`\`\`'}`,
						},
						{
							name: "Archived by",
							value: `<@${message.member.user.id}>`,
						}
					]
				}
			};

			// Handle updateing the respective channel
			current_channel.setParent(archive_category_channel.id, { lockPermissions: true }).then(() => message.channel.send(archive_embed)).catch(console.error);
		}
	});

    // Return to stop further processing
    return;
}