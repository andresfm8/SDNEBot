/**
 *
 * N3rdP1um23
 * November 29, 2020
 * The following file is used to handle admin commands
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import { diary } from '../funcs';
import { roles, yearChannels } from '../globVars';

/**
 *
 * The following function is used to handle cleaning up the specified amount of messages in the channel
 *
 * @param message: is the message to handle
 * @param args: is the array of events
 *
 */
export function displayRolesArray(message: Discord.Message, args) {
	// console.log(roles)
    message.channel.send(Object.entries(roles).map(role => role[0] + ' ---- ' + role[1].name + ` ---- <@&${ role[1].id }>`));
}

/**
 *
 * The following function is used to handle cleaning up the specified amount of messages in the channel
 *
 * @param message: is the message to handle
 * @param args: is the array of events
 *
 */
export function displayYearChannelsArray(message: Discord.Message, args) {
    message.channel.send(Object.entries(yearChannels).map(yearChannel => yearChannel[1].year + ' ---- ' + yearChannel[1].cid));
}