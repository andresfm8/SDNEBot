/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle calculating and display the days until the specified event
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import * as moment from 'moment';

/**
 *
 * The following function is used to handle displaying the days until the specific event
 *
 * @param message: is the message to handle
 * @param args: is the array of events
 *
 */
export function displayDaysUntilEvent(message: Discord.Message, args) {
    // Check to see if no parameters were passed
	if(args.length === 0) {
		// React with a question mark as the user hasn't entered an event name and then return to stop further processing
		message.react('❓');
		return;
	}

	// Create the required variables
	let requested_event: string = args.join(' ');
	var events = {
		'Halloween': '10-31',
		'Christmas Eve': '12-24',
		'Christmas': '12-25',
		'Boxing Day': '12-26',
		'New Years Eve': '12-31',
		'New Years Day': '01-01',
	};

	// Check to see if the requested event is not available in the events object
	if(!(requested_event in events)) {
		// Reply that they're missing an event name
		message.reply('Oops... The requested event isn\'t currently supported. Feel free to make a PR and add the event!');

		// Return to strop further processing
		return;
	}

	// Calculate the days until the requeted event
	var days_until_event = moment(moment().format('y') + '-' + events[requested_event]).diff(moment(), 'days');

	// Check to see if the event has passed and attempt to grab the next years occurance of the event
	if(days_until_event < 0) {
		// Update an grab next years occurance
		days_until_event = moment(moment().add(1, 'y').format('y') + '-' + events[requested_event]).diff(moment(), 'days');
	}

	// Reply to the user with the remaining days until the event
	message.reply(`${days_until_event} day(s) until ${requested_event}!`);

    // Return to stop further processing
    return;
}