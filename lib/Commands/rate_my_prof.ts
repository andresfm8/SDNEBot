/**
 *
 * N3rdP1um23
 * November 1, 2020
 * The following file is used to handle the rate my prof command
 *
 */

// Import the requried items
import * as Discord from 'discord.js';
import { parse } from 'node-html-parser';
import Axios from 'axios';
import { Prof } from '../../env';

/**
 *
 * The following function is used to handle displaying the help menu
 *
 * @param message: is the message to handle
 *
 */
export function rateProf(message: Discord.Message, args) {
    // Check to see if the user has passed an argument
    if(args.length === 0) {
        // React to the message with a question mark as the command wasn't used properly
        message.react('❓');

        // Return to stop further processing
        return;
    }

    // Create the required variables
    let professor: string = args.join(' ');
    let findId = Number(professor);

    // Check to see if the id isn't a number
    if(isNaN(findId)) {
        // Parse the professors name and clear the original professor name
        let names: string[] = professor.split(' ');
        professor = '';

        // Iterate over each of the names and format the query string
        names.forEach((n, i) => {
            // Check to see if the index is matching
            if(i == names.length - 1) {
                // Set the professor query id
                professor += n;
            }else{
                // Append the professor query id
                professor += `${n}+`;
            }
        })

        // Prepare the search url
        let profSearchURL: string = `https://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Sheridan+College&schoolID=&query=${professor}`;

        // Attempt the query
        try {
            // Initialize the request
            Axios.get(profSearchURL).then(result => {
                // Parse the result data and see if there are any profressor class items
                let listings = parse(result.data).querySelectorAll('.PROFESSOR');

                // Check to see if there aren't any found professors
                if(listings.length < 1) {
                    // Reply with a message that the professor may be mis-spelt and return to stop further processinf
                    message.reply('I had trouble finding that professor. Please double check your spelling!');
                    return;
                }

                // Create an array that will hold all found professors
                let foundProfs: Prof[] = []

                // Iterate over each of the professor listings
                listings.forEach((l, i) => {
                    // Create the requried variables and strip the reuqired information
                    let url = l.querySelector('a').getAttribute("href")
                    let id = Number(url.slice(21))
                    let name = l.querySelector('.main').text
                    let role = l.querySelector('.sub').text
                    // console.log(`${name}\n${role}\n${url}\n${id}`)

                    // Push the found professor to the foundProfs array
                    foundProfs.push({ id: id, name: name, role: role })
                });

                // Check to see if no professors were found
                if(foundProfs.length == 0) {
                    // Reply to the user with an error message that the profeessor wasn't found and return to stop further processing
                    message.reply('I had trouble finding that professor. Please double check your spelling!');
                    return;
                }

                // Check if there was more than one professor found
                if(foundProfs.length > 1) {
                    // Create a variable that will hold fields
                    let fields = [];

                    // Iterate over each of the found professors
                    foundProfs.forEach(prof => {
                        // Push the fields for the professor to the fileds array
                        fields.push({
                            name: prof.name,
                            value: `${prof.role}\n\`\`\`!rmp ${prof.id}\`\`\``
                        });
                    });

                    // Initialize the embed variable
                    let multiEmbed = {
                        embed: {
                            title: "Multiple Professors Found",
                            url: profSearchURL,
                            description: "Please choose one",
                            color: 4886754,
                            footer: {
                                icon_url: "https://www.ratemyprofessors.com/images/favicon-32.png",
                                text: "RateMyProfessors"
                            },
                            fields: fields
                        }
                    };

                    // Send the formatted embed to the channel that the respective message was from
                    message.channel.send(multiEmbed)
                }else{
                    // Call the function to handle displaying the single professor
                    singleProf(foundProfs[0].id, message);
                }
            });
        }catch(exception) {
            // Reply with an error, log the exception, and then return to stop further processing
            message.reply('I had trouble finding that professor. Please double check your spelling!');
            console.error(exception);
            return;
        }
    }else{
        // Call the function to handle displaying the single professor
        singleProf(findId, message)
    }
}

/**
 *
 * The following function is used for displaying a single professor result
 *
 * @param findId: is the professor id
 * @param message: is the respective message
 *
 */
function singleProf(findId: number, message: Discord.Message) {
    // Create a variable that will hold the formatted url
	let idUrl: string = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${findId}`

    // Try and grab the professors data
	try {
        // Attmept the query
		Axios.get(idUrl).then(result => {
            // Check to see if there was an error with the request
			if(result.status === 301 || result.status === 404) {
                // Reply with an error message and then return to stop further processing
				message.reply('I had trouble finding that professor. Please double check your spelling!');
				return;
            }

            // Parse the response and then initialize the professor instance
			let html = parse(result.data);
			let p: Prof = { id: 0, name: '', score: 0, role: '', retake: '', level: 0, highlightReview: '' };

            // Initialize the stardard field values for the professor
			p.id = findId;
			p.name = `${html.querySelector('.jeLOXk').firstChild.text} ${html.querySelector('.glXOHH').firstChild.text}`;
			p.role = `${html.querySelector('.hfQOpA').firstChild.childNodes[1].text}`;
			p.score = parseFloat(html.querySelector('.gxuTRq').text);

            // Try and parse a retake value
			try {
                // Set the retake value from the parsed value
				p.retake = `${html.querySelector('.jCDePN').firstChild.childNodes[0].text}`;
			}catch{
                // Set the retake value to a defauly value
				p.retake = '0%';
			}

            // Try and parse a level
			try {
                // Set the level to the parsed value
				p.level = parseFloat(html.querySelector('.jCDePN').childNodes[1].childNodes[0].text);
			}catch{
                // Set the level to a default of 0
				p.level = 0;
			}

            // Check to see if the retake value isn't a percentage
			if(p.retake.indexOf('%') === -1) {
                // Set the level and retake values
                p.level = Number(p.retake);
                p.retake = '0%';
			}

            // Try and parse a highlighted rating
			try {
                // Set the rating to the highlighted rating
				p.highlightReview = `${html.querySelector('.dvnRbr').text}`;
			}catch{
                // Handle setting a standard review
				p.highlightReview = `Bummer, ${p.name} doesn't have any featured ratings...`;
			}

            // Formulate the professor embed
			let profEmbed = {
				embed: {
					title: `${p.name}`,
					url: `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${p.id}`,
					description: `Professor in the **${p.role}**`,
					color: 4886754,
					footer: {
						icon_url: "https://www.ratemyprofessors.com/images/favicon-32.png",
						text: "RateMyProfessors"
					},
					thumbnail: {
						url: `https://dummyimage.com/256x256/fff.png&text=${p.score}`
					},
					fields: [
						{
							name: "🔁 Would Retake?",
							value: `\`\`\`${p.retake} say YES\`\`\``,
							inline: true
						},
						{
							name: "⛓ Difficulty",
							value: `\`\`\`${p.level} / 5\`\`\``,
							inline: true
						},
						{
							name: "🗨 Top Review",
							value: `\`\`\`${p.highlightReview}\`\`\``
						}
					]
				}
			};

            // Send the professor embed to the channel that the respective message was from
			message.channel.send(profEmbed);
		}).catch(error => {
            // Reply with an error message, log the error, and return to stop further processing
			message.reply('I had trouble finding that professor. Please double check your spelling!');
			console.error(error);
			return;
		})
	}catch(exception) {
        // Log the exception
		console.error(exception);
	}
}