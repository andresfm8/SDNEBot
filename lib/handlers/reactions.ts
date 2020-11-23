/**
 *
 * TimmyRB
 * November 1, 2020
 * The following file is used for handling reactions
 *
 * Updates
 * -------
 * November 20, 2020 -- N3rdP1um23 -- Updated to use new log handler
 *
 */

// Import the required items
import * as Discord from 'discord.js';
import * as db from '../../database';
import { bot } from '../../bot';
import { help, hasAttachment, diary } from '../funcs';
import { helpPage, setHelpPage, roles, generalChannel, introductionChannel } from '../globVars';

/**
 *
 * The following function is used to handle when a message receives a reaction
 *
 * @param reaction: is the reaction for the respective message
 * @param user: is the user that triggered the reaction
 */
export async function handleReactionAdd(reaction: Discord.MessageReaction, user: Discord.User | Discord.PartialUser) {
	// Try the following and catch any errors that occur
	try {
		// Await the reaction
		await reaction.message.fetch().catch(error => diary('sad', reaction.message.guild, error));

		// Fetch the user for processing
		user.fetch().then(async user => {
			// Disallow actions for Bot
			if(user.bot) {
				// Return to stop further processing
				return;
			}

			// Disallow Reacting for Muted Users
			db.getUser(user.id, user.username, (userData: Object) => {
				// Check to see if the user is muted
				if(userData['muted'] === true) {
					// Remove the reaction since the user is muted
					reaction.users.remove(user);
				}
			});

			// Create the required variables
			let assign_role_message_id = await db.getConfig('assign').catch(error => diary('sad', reaction.message.guild, error));
			let assign_years = ['📗', '📘', '📙', '🧾'];
			let assign_campus = ['1️⃣', '2️⃣'];
			var member: Discord.GuildMember;
			var new_user: Boolean = false;
			let emoji_name: string = reaction.emoji.name;
			let users: Discord.Collection<string, Discord.User> = await reaction.users.fetch();

			// Check to see if the channel the reaction was made in is a text channel
			if(reaction.message.channel.type === 'text') {
				// Update the member value
				member = reaction.message.guild.members.cache.get(user.id);
			}

			// Check to see if the reaction was a question mark and the bot was one of the user who reacted
			if(emoji_name === '❓' && reaction.users.cache.array().includes(bot.user)) {
				// Remove the reaction from the message and display the help page
				reaction.remove();
				setHelpPage(help(member, 0, reaction.message.channel));
			}else if(emoji_name === '➡️' && reaction.message.author === bot.user) {
				// Remove the users reaction from the message and switch to the next help page
				reaction.users.remove(user);
				setHelpPage(help(member, helpPage + 1, undefined, reaction.message));
			}else if(emoji_name === '⬅️' && reaction.message.author === bot.user) {
				// Remove the users reaction from the message and switch to the previous help page
				reaction.users.remove(user);
				setHelpPage(help(member, helpPage - 1, undefined, reaction.message));
			}else if(emoji_name === '🗑️' && users.array().includes(bot.user)) {
				// Delete the message
				reaction.message.delete();
			}else if(assign_years.includes(emoji_name) && reaction.message.id === assign_role_message_id) {
				// Iterate over each of the reactions to the assign message
				reaction.message.reactions.cache.forEach((reaction) => {
					// Iterate over each of the user that reacted to the message
					reaction.users.fetch().then(reaction_users => {
						// Check to see if the user reacted with a wrong reaction emoji
						if(reaction.emoji.name !== emoji_name && reaction_users.array().includes(user) && !assign_campus.includes(reaction.emoji.name)) {
							// Remove the users reaction from the message
							reaction.users.remove(user).catch(error => diary('sad', member.guild, error));
						}
					});
				});

				// Check to see if the member has the unassigned role
				if(member.roles.cache.array().includes(roles['👻'])) {
					// specify that the user is new
					new_user = true;
				}

				// Remove all of the year roles from the user and also the unassigned role
				member.roles.remove([roles['📗'], roles['📘'], roles['📙'], roles['🧾'], roles['👻']], 'Removed conflicting year roles').then(async () => {
					// Add the desired year role to the member
					member.roles.add(roles[emoji_name], `Added ${roles[emoji_name].name}`).catch(error => diary('sad', member.guild, error));

					// Check to see if the user is new
					if(new_user) {
						// Grab the general channel
						var general_channel = await db.getConfig('generalChannel');

						// Check to make sure that the general_channel isn't undefined
						if(general_channel !== undefined) {
							// Grab the channel instance and then post the welcome message
							let channel = <Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel>bot.guilds.cache.first().channels.cache.get(general_channel);
							channel.send(`**Welcome <@${member.user.id}>!**\nFeel free to introduce yourself in <#${introductionChannel}>!`);
						}else{
							// Update the general column value
							await db.updateConfig('generalChannel', generalChannel);

							// Grab the channel instance and then post the welcome message
							let channel = <Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel>bot.guilds.cache.first().channels.cache.get(generalChannel);
							channel.send(`**Welcome <@${member.user.id}>!**\nFeel free to introduce yourself in <#${introductionChannel}>!`);
						}
					}
				}).catch(error => diary('sad', member.guild, error));
			}else if(assign_campus.includes(emoji_name) && reaction.message.id === assign_role_message_id) {
				// Iterate over each of the reactions to the assign message
				reaction.message.reactions.cache.forEach(function (reaction) {
					// Iterate over each of the user that reacted to the message
					reaction.users.fetch().then(reaction_users => {
						// Check to see if the user reacted with a wrong reaction emoji
						if(reaction.emoji.name != emoji_name && reaction_users.array().includes(user) && !assign_years.includes(reaction.emoji.name)) {
							// Remove the users reaction from the message
							reaction.users.remove(user).catch(error => diary('sad', member.guild, error));
						}
					});
				});

				// Remove all of the campus roles from the user
				member.roles.remove([roles['1️⃣'], roles['2️⃣']], 'Removed Conflicting assign_campuses').then(() => {
					// Add the respective campus role for the user
					member.roles.add(roles[emoji_name], `Added ${roles[emoji_name].name}`).catch(error => diary('sad', member.guild, error));
				}).catch(error => diary('sad', member.guild, error));
			}else if(emoji_name === '📌') {
				// Check to see if the message has an attachment
				if(hasAttachment(reaction.message)) {
					// Send the user the message along with the attachment
					user.send(`**<@${reaction.message.author.id}> sent:**\n${reaction.message.content}`, reaction.message.attachments.array()).then(dm => dm.react('🗑️'));
				}else if(reaction.message.embeds.length > 0) {
					// Send the user the message along with the embeds
					user.send(`**<@${reaction.message.author.id}> sent:**\n${reaction.message.content}`, reaction.message.embeds).then(dm => dm.react('🗑️'));
				}else{
					// Send the user the message along with the content
					user.send(`**<@${reaction.message.author.id}> sent:**\n${reaction.message.content}`).then(dm => dm.react('🗑️'));
				}
			}else{
				// Grab the author of the reaction
				let author: Discord.User = reaction.message.author

				// Check to see if the author was a bot or the user that triggered the reaction
				if (author.bot || author === user) {
					// Return to stop further processing
					return
				}

				// Update the users contribution points
				db.updateUser(author.id, author.username, undefined, undefined, undefined, 1, true);
			}
		});
	}catch(exception) {
		// Log the error to the console
		diary('sad', reaction.message.guild, exception);
	}
}