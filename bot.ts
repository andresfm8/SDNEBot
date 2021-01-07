/**
 *
 * TimmyRB
 * October 31, 2020
 * The following file is the main file for the application
 *
 * Updates
 * -------
 * October 31, 2020 -- N3rdP1um23 -- Added new DB handling
 * November 01, 2020 -- N3rdP1um23 -- Updated the roles assignment and searching through Discord roles
 * November 20, 2020 -- N3rdP1um23 -- Updated to use new log handler
 *
 */

// Import the required items
import * as Discord from 'discord.js';
import { botToken, dbFile, localRoles } from './env';
import { roles } from './lib/globVars';
import { handleReactionAdd } from './lib/handlers/reactions';
import { handleMessage, handleMessageDelete, handleMessageEdit } from './lib/handlers/messages';
import { handleNewMember } from './lib/handlers/guildEvents';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Config } from './lib/Entities/Config';
import { User } from './lib/Entities/User';
import { diary } from './lib/funcs';
import { monitorNews } from './lib/Events/MonitorNews';
import { Article } from './lib/Entities/Article';

// Create the requried instances
export const bot = new Discord.Client({ partials: Object.values(Discord.Constants.PartialTypes) })

// Create the connection to the database
createConnection({
	type: 'sqlite',
	database: `./${dbFile}`,
	entities: [
		Config,
		User,
		Article
	],
	synchronize: true,
	logging: false
}).then(connection => {
	// Bot startup
	bot.on('ready', () => {
		// Log who the bot was signed in as and set the presence of the bot
		console.log(`Bot started successfully!`);
		diary('happy', bot.guilds.cache.first(), {status: `Signed in as ${bot.user.tag}`});
		bot.user.setPresence({ activity: { type: 'WATCHING', name: 'for !help' }, status: 'online' });

		// Iterate over each role from the roles object and handle them accordingly
		localRoles.forEach(resRole => {
			// Query the Discord roles for the respective local role and store the results to a variable
			var discord_role = bot.guilds.cache.first().roles.cache.find(role => role.id === resRole.rid);

			// Check to see if the Discord role was found
			if(discord_role !== undefined) {
				// Store the role to the globar array
				roles[resRole.name] = discord_role;
			}
		});
		monitorNews().start();
	});

	// Listen for Members joining
	bot.on('guildMemberAdd', member => handleNewMember(member));

	// Listen for Messages
	bot.on('message', message => handleMessage(message));

	// Listen for Reactions
	bot.on('messageReactionAdd', (reaction, user) => { handleReactionAdd(reaction, user) });

	// Login Bot
	bot.login(botToken);

	/** Older functions */
	// Listen for Message Deletions
	// bot.on('messageDelete', message => handleMessageDelete(message));

	// Listen for Message Edits
	// bot.on('messageUpdate', (oldMessage, newMessage) => handleMessageEdit(oldMessage, newMessage));
}).catch(console.error);