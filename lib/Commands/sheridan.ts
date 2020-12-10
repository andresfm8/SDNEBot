/**
 *
 * N3rdP1um23
 * December 8, 2020
 * The following file is used to handle Sheridan specific commands
 *
 */

// Import the requried items
import Axios from 'axios';
import * as Discord from 'discord.js';
import { diary } from '../funcs';
import { HTMLElement, parse } from 'node-html-parser';

// Define the file constants
const course_link = 'https://ulysses.sheridanc.on.ca/coutline/coutlineview.jsp?subjectCode=__subject_code__&courseCode=__course_code__';

/**
 *
 * The following function is used to handle display some quick course info
 *
 * @param message: is the message to handle
 * @param args: is the array of arguments to handle
 *
 */
export async function lookupCourses(message: Discord.Message, args) {
	// Check to see if the user has passed an argument
	if(args.length === 0) {
		// React to the message with a question mark as the command wasn't used properly
		message.react('❓');

		// Return to stop further processing
		return;
	}

	// Iterate over each of the courses and handle accordingly
	args.forEach(course => {
		// Strip the sections of the course code
		course = course.replace(',', '');
		var subject_code = course.replace(/[0-9]/g, '');
		var course_code = course.replace(subject_code, '');

		// Handle checking and display the course info
		checkCourseStatus(subject_code, course_code, message);
	});

	// Return to stop further processing
	return;
}

/**
 *
 * The following function is used to handle searching for the course and then displaying the relevant course information
 *
 * @param subject: is the subject code for the course
 * @param course: is the course code for the course
 * @param message: is the initial message from the user
 *
 */
function checkCourseStatus(subject, course, message) {
	// Format the course link
	var formated_course_link = course_link.replace('__subject_code__', subject).replace('__course_code__', course);

	// Try and handle embeding the course info
	try {
		// Initialize the request
		Axios.get(formated_course_link).then(result => {
			// Check to see if there was an error with the request
			if(result.status !== 200) {
				// Reply with an error message and then return to stop further processing
				message.reply('I had trouble finding that course. Please try again!');
				return;
			}

			// Parse the result data
			let html = parse(result.data);

			// Check to make sure that the outline exists
			if(!html.text.includes('A published outline is not available.')) {
				// Parse the requried items from the page
				let course_code = html.querySelector('.CourseSubjectHeading').firstChild.text;
				let course_name = html.querySelector('.CourseTitleHeading').firstChild.text;
				let standard_sections = html.querySelectorAll('.StandardText');
				let course_quick_info = standard_sections[0].text.split('\n').map(element => element.trim()).filter(element => !['', '\t'].includes(element));
				let total_hours = course_quick_info.find(element => element.toLowerCase().includes('total hours:'));
				let total_credits = course_quick_info.find(element => element.toLowerCase().includes('credit value:'));
				let prerequisites = course_quick_info.find(element => element.toLowerCase().includes('prerequisites:'));
				let description = standard_sections[3].text;
				var evaluation;
				var sections;
				evaluation = html.querySelectorAll('.Td-15')[3];
				sections = html.querySelectorAll('strong');

				// Check to see if the evaluation variable is a table
				if(evaluation.rawTagName === 'table') {
					// Set the evaluation again
					evaluation = evaluation.childNodes.map(row => row.childNodes.map(child => child.text).splice(1, 2));
				}else if(evaluation.rawTagName === 'td') {
					// Check to see if a table is a child
					if(evaluation.nextElementSibling.querySelector('table') !== null) {
						// Set the evaluation again
						evaluation = evaluation.nextElementSibling.querySelector('table').childNodes.map(row => row.childNodes.map(child => child.text).splice(1, 2));
					}else{
						// Set the evaluation again
						evaluation = evaluation.nextElementSibling.nextElementSibling.childNodes.map(row => row.childNodes.map(child => child.text).splice(1, 2));
					}
				}else{
					// Set the evaluation again
					evaluation = evaluation.nextElementSibling.nextElementSibling.childNodes.map(row => row.childNodes.map(child => child.text).splice(1, 2));
				}

				// Handle the correction for sections
				if(sections !== null) {
					// Assign the sections again
					sections = sections.map(element => element.text).filter(element => element.toLowerCase().startsWith('module'));
				}

				// Formulate the course embed
				let courseEmbed = {
					embed: {
						title: `${ course_code } - ${ course_name }`,
						url: formated_course_link,
						description: `Displaying relevant course information for - **${ course_code }**`,
						color: 4886754,
						footer: {
							icon_url: "https://www.sheridancollege.ca/assets/images/favicon.ico",
							text: "Sheridan College"
						},
						fields: [
							{
								name: 'Total Hours',
								value: `\`\`\`${ ((total_hours !== '') ? total_hours.toLowerCase().replace('total hours:', '').trim() : 'N/A') }\`\`\``,
								inline: true,
							},
							{
								name: 'Credits',
								value: `\`\`\`${ ((total_credits !== '') ? total_credits.toLowerCase().replace('credit value:', '').trim() : 'N/A') }\`\`\``,
								inline: true,
							},
							{
								name: 'Prerequisites',
								value: `\`\`\`${ ((prerequisites !== '') ? prerequisites.toLowerCase().replace('prerequisites:', '').trim().replace('(', '').replace(')', '').split(/(and|or)/).filter(item => (item !== 'or' && item !== 'and')).map(element => element.trim().toUpperCase()).join(', ') : 'N/A') }\`\`\``,
							},
							{
								name: 'Description',
								value: `\`\`\`${ description.replace('Detailed Description', '').trim() }\`\`\``,
							},
							{
								name: 'Evaluation',
								value: `\`\`\`${ ((evaluation.length > 0) ? evaluation.map(row => row[0] + ' -- ' + row[1]).toString().replace(/\,/g, '\n') : 'N/A') }\`\`\``,
							},
							{
								name: 'Sections',
								value: `\`\`\`${ ((sections.length > 0) ? sections.map(section => section.replace(':', '')).toString().replace(/\,/g, '\n') : 'N/A') }\`\`\``,
							}
						]
					}
				};

				// Send the course embed to the channel that the respective message was from
				message.channel.send(courseEmbed);
			}else{
				// Replay and log an error
				message.reply('I had trouble finding that course. Please try again!');
			}
		}).catch(error => {diary('sad', message, error); console.log(error)});
	}catch(exception) {
		// Reply with an error, log the exception, and then return to stop further processing
		message.reply('I had trouble finding that course. Please try again!');
		diary('sad', message, exception);
		return;
	}
}
