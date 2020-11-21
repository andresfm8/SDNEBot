/**
 *
 * TimmyRB
 * November 1, 2020
 * The following file is used for handling functions related to guild events
 *
 * Updates
 * -------
 * November 20, 2020 -- N3rdP1um23 -- Updated to use new log handler
 *
 */

// Import the required items
import * as Discord from 'discord.js';
import * as db from '../../database';
import { roles } from '../globVars';
import { diary } from '../funcs';

/**
 *
 * The following function is used to handle when new members join the server
 *
 * @param member: is the new member to handle
 */
export function handleNewMember(member: Discord.GuildMember | Discord.PartialGuildMember) {
	// Fetch the member object from Discord
	member.fetch().then(async mem => {
		// Update the user in the database
		db.updateUser(mem.id, mem.user.username);

		// Create the required variabels
		let id = await db.getConfig('assignChannel'); // Get the assignChannel channel id

		// Send a DM to the user welcoming them to the server and also mentioning to assign roles and contact an admin for more support
		mem.send(`**Welcome to the SDNE Discord!**\nMake sure to assign your year and campus using the corresponding\nreactions in <#${id}> in order to access all the channels!\nDM an admin if you need help.`)

		// Add the unassigned role to the user since their new
		mem.roles.add(roles['👻']).catch(error => diary('sad',  member.guild, error));
	});
}