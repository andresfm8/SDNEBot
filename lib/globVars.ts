/**
 *
 * TimmyRB
 * November 1, 2020
 * The following file is used to handle holding and using global variables and function
 *
 */

// Import the required packages
import * as env from '../env';

// Export some default values
export var roles: Object = {};
export var helpPage: number = 0;
export var generalChannel: string = env['generalChannel'];
export var introductionChannel: string = env['introductionChannel'];
export var editChannel: string = env['editChannel'];
export var deletedChannel: string = env['deletedChannel'];
export var yearChannels: Array<string> = env['yearChannels'];
export var commandPrefix: string = env['commandPrefix'];

// Export a function that will help updating the help page variable
export function setHelpPage(num: number) {
	helpPage = num;
}

// Export the arrya of server rules
export const rules = [
	{
		title: 'Rule 1 - Keep it friendly and respectful',
		rule: 'We\'re all mature here, please do not be disrespectful towards any users (no hateful nicknames!). Harassment or encouragement of harassment of any kind is not tolerated, including sexual harassment.'
	},
	{
		title: 'Rule 2 - Keep chats safe for work',
		rule: 'Please do not post any NSFW pictures or links in any of the channels, a lot of us use Discord on our phone or on our computers when in class so keep that in mind.'
	},
	{
		title: 'Rule 3 - No spamming or trolling',
		rule: 'Spamming is not allowed on this server. No excessive trolling is allowed on this server, do not deliberately make others uncomfortable or deliberately derail a conversation. Do not post any malicious links.'
	},
	{
		title: 'Rule 4 - Use the appropriate channels',
		rule: 'We have multiple channels, so please make sure your discussion aligns with the channel\'s name and topic.'
	},
	{
		title: 'Rule 5 - Enforcing Academic Integrity',
		rule: 'Please do not ask for any help on assignments you have for your classes. Academic integrity is taken very seriously at Sheridan and as students in the SDNE program, we all must follow these rules.'
	}
];