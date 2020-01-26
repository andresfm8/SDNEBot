const Discord = require('discord.js')
const fs = require('file-system')

const bot = new Discord.Client()

bot.login('NjE5NTkwOTQ5MzAzMDkxMjEx.XXKdeQ.bLymm-XWu37fp5GYFZq5HUjugUE')

//#region Server Vars
var botID;

// Roles
const adminRole = '619581765345869844'
const year1 = '619581998574469120'
const year2 = '619582112936362020'
const year3 = '619582159899852802'
const alumni = '619582173522952233'
const unassigned = '663060867490775071'
const trafalgar = '620641262101463070'
const davis = '620641321908043798'
const everyone = '619560877405896714'

// Channels
const assign_year = '619603429379014667'
const rules_info = '619585833636200449'
const support = '628315463402913793'
const deleted = '670103982903132201'

//#endregion

// When Bot Starts up
bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`)
	bot.user.setActivity('!help commands', { type: 'LISTENING' })
	botID = bot.user.id
	bot.guilds.get('619560877405896714').setSplash()
})

// Message is deleted
bot.on('messageDelete', msg => {
	if (msg.channel.id === '670103982903132201')
		return

	let server = bot.guilds.get('619560877405896714')
	server.channels.get('670103982903132201').send(`**${msg.author}'s message in ${msg.channel} was deleted:** \`\`\`${msg.content}\`\`\``)
})

bot.on('messageUpdate', (oldMsg, newMsg) => {
	if (newMsg.author.id === botID)
		return

	let server = bot.guilds.get('619560877405896714')
	server.channels.get('670806040119607356').send(`**${oldMsg.author} changed:**\`\`\`${oldMsg.content}\`\`\`**to:**\`\`\`${newMsg.content}\`\`\``)
})

// When user joins Discord server
bot.on('guildMemberAdd', member => {
	member.send('Welcome to the SDNE Discord Server!')
	member.send({
		embed: {
			title: 'Information',
			description: 'To access all channels, you must assign which year you are in from 1-4 in the SDNE program. 4 represents Alumni. \n```!year <your year>``` in the #assign-year channel. \n \nEach year gets their own category where members of that year can add channels for whatever they would like to discuss.\nYou can also assign your campus with ```!campus <campus-name>```so you can find others on your campus!',
			color: 10197915
		}
	})
	addRole(member, unassigned, 'Default Unassigned Role')
})

// When user sends message to any channel shared with SDNE Bot
bot.on('message', msg => {
	msg.content = msg.content.toLowerCase()

	// Ignore Bot Messages
	if (msg.author.id === botID)
		return

	let mutedData = getUser(msg.author)
	if (mutedData.muted) {
		msg.delete()
		return
	}

	if (msg.content.startsWith('!')) {
		// Message is a command
		if (msg.channel.id === assign_year) {
			// Command is in #assign-year
			if (msg.content.startsWith('!year ')) {

				let year = parseFloat(msg.content.split(' ')[1])
				let user = msg.member

				switch (year) {

					case 1:
						addRole(user, year1)
						delRole(user, year2)
						delRole(user, year3)
						delRole(user, alumni)
						delRole(user, unassigned)
						msg.reply('you are now in the role associated with your year!')
						break

					case 2:
						delRole(user, year1)
						addRole(user, year2)
						delRole(user, year3)
						delRole(user, alumni)
						delRole(user, unassigned)
						msg.reply('you are now in the role associated with your year!')
						break

					case 3:
						delRole(user, year1)
						delRole(user, year2)
						addRole(user, year3)
						delRole(user, alumni)
						delRole(user, unassigned)
						msg.reply('you are now in the role associated with your year!')
						break

					case 4:
						delRole(user, year1)
						delRole(user, year2)
						delRole(user, year3)
						addRole(user, alumni)
						delRole(user, unassigned)
						msg.reply('you are now in the role associated with your year!')
						break

					default:
						msg.reply('that\'s not a valid year, try between 1-4!')
						break

				}

				return

			} else if (msg.content.startsWith('!campus ')) {

				let campus = msg.content.split(' ')[1]
				let user = msg.member

				switch (campus) {

					case 'trafalgar':
						addRole(user, trafalgar)
						delRole(user, davis)
						msg.reply('welcome to Trafalgar!')
						break

					case 'davis':
						delRole(user, trafalgar)
						addRole(user, davis)
						msg.reply('welcome to Davis!')
						break

					default:
						msg.reply('that\s not a vaild campus, try either Trafalgar or Davis')
						break

				}

				return

			} else {

				msg.delete()
				msg.reply(`it looks like you have formatted that command incorrectly, see <#${rules_info}> for more information or ask for help in <#${support}>.`).then(m => {
					setTimeout(() => {
						m.delete()
					}, 15000)
				})

				return

			}
		}

		if (msg.member.highestRole.id === adminRole) {
			// Message is by Admin
			if (msg.content === '!help') {

				msg.channel.send({
					embed: {
						color: 4886754,
						title: 'Help Menu',
						fields: [{
							name: 'Assign Year Roles',
							value: '```!year <year>\nUse \'4\' if you are Alumni```'
						},
						{
							name: 'Assign Campus',
							value: '```!campus <campus name>```'
						},
						{
							name: 'View Help Menu',
							value: '```!help```'
						},
						{
							name: 'View Rules',
							value: '```!rules```'
						},
						{
							name: 'View Karma',
							value: '```!karma\n!karma @username```'
						},
						{
							name: 'Create a poll with as many standard emojis as you want',
							value: '```!poll <messageID ?String> <broadcast ?boolean> <minutes ?Float> <emojiOne ?String> <emojiTwo ?String> ...```'
						},
						{
							name: 'Generate Bot Invite',
							value: '```!invite```'
						},
						{
							name: 'Give Unassigned Roles',
							value: '```!reassign```'
						},
						{
							name: 'Get Bot Uptime',
							value: '```!uptime```'
						},
						{
							name: 'Get Message Edits',
							value: '```!edits <messageId>```'
						},
						{
							name: 'Toggle Karma',
							value: '```!karmaToggle\n!karmaToggle <@user>```'
						},
						{
							name: 'Cleanup Messages',
							value: '```!cleanup <amount<=100>```'
						},
						{
							name: 'Get Updating Scoreboard',
							value: '```!scoreboard```'
						},
						{
							name: 'Toggle User Muted Status',
							value: '```!toggleMute <@user>```'
						}
						],
						timestamp: new Date(),
						footer: {
							icon_url: bot.user.avatarURL,
							text: 'SDNE Bot'
						}
					}
				})

				return
			}

			if (msg.content === '!invite') {

				msg.guild.channels.get('id', rules_info).createInvite({
					maxAge: 0,
					unique: false,
					temporary: false,
					maxUses: 0
				}, 'New Invite Created by Bot').then(function (invite) {
					msg.reply('a new Invite Link has been generated, ' + invite.url)
				})

				return

			}

			if (msg.content === '!reassign') {

				msg.channel.members.forEach(function (e, i) {
					if (e.highestRole.id === everyone) {
						addRole(unassigned, 'Default Unassigned Role')
					}
				})
				msg.delete()
				msg.reply('it has been done.').then((m) => {
					setTimeout(() => {
						m.delete()
					}, 5000)
				})

				return

			}

			if (msg.content === '!uptime') {

				let uptime = process.uptime().toString().toHHMMSS()
				msg.channel.send(`I've been awake for \`${uptime}\` now!`).then((m) => {
					var updateMS = Math.round(Math.random() * (30000 - 5000)) + 5000
					setInterval(() => {
						time = process.uptime()
						uptime = (time + '').toHHMMSS()
						m.edit(`I've been awake for \`${uptime}\` now!`)
					}, updateMS)
				})

				return

			}

			if (msg.content.startsWith('!edits ')) {

				let msgID = msg.content.split(' ')[1]
				let fields = []
				msg.channel.fetchMessage(msgID).then(edited => {
					edited.edits.forEach((m, i) => {
						if (i == 0) {
							fields.push(
								{
									'name': `Latest`,
									'value': `\`\`\`${m.content}\`\`\``
								}
							)
						} else {
							fields.push(
								{
									'name': `Version ${edited.edits.length - i}`,
									'value': `\`\`\`${m.content}\`\`\``
								}
							)
						}
					})

					msg.channel.send({
						'embed': {
							'title': 'Previous Versions',
							'color': 15684432,
							'timestamp': edited.createdTimestamp,
							'footer': {
								'icon_url': edited.author.avatarURL,
								'text': edited.author.username
							},
							'fields': fields
						}
					})
				}).catch(err => {
					console.error(err)
					msg.reply('could not find the message specified.')
				})

				return

			}

			if (msg.content.startsWith('!karmatoggle')) {
				let user

				if (msg.mentions.users.size > 0)
					user = msg.mentions.users.first()
				else
					user = msg.author

				let data = getUser(user)

				data.karmaToggle = !data.karmaToggle

				writeUser(user, data)

				msg.channel.send({
					'embed': {
						'title': `${user.username}'s Karma Info`,
						'color': 9224077,
						'timestamp': new Date(),
						'footer': {
							'icon_url': `${user.avatarURL}`,
							'text': `${user.username}`
						},
						'fields': [
							{
								'name': 'Karma Toggle',
								'value': `\`\`\`KarmaToggle: ${data.karmaToggle}\`\`\``
							}
						]
					}
				})

				return
			}

			if (msg.content.startsWith('!cleanup ')) {

				let amount = parseInt(msg.content.split(' ')[1])

				msg.delete()

				if (amount > 100) {
					msg.reply('you can only delete up to 100 messages at a time.').then((m) => {
						setTimeout(() => {
							m.delete()
						}, 5000)
					})
					return
				}

				msg.channel.bulkDelete(amount)
					.then(() => {
						msg.reply(`deleted ${amount} messages.`).then((m) => {
							setTimeout(() => {
								m.delete()
							}, 5000)
						})
					})
					.catch(err => {
						msg.reply(`${err.message}`).then((m) => {
							setTimeout(() => {
								m.delete()
							}, 5000)
						})
					})

				return

			}

			if (msg.content === '!scoreboard') {
				msg.delete()

				let fields = []
				let data = getAllUsers()

				data.forEach((e, i) => {
					let karma = Math.floor(e.karma * 100) / 100;
					if (karma !== 0) {
						fields.push({
							name: `#${i + 1} ${e.name}`,
							value: `\`\`\`Karma: ${karma}\`\`\``
						})
					}
				})

				let embed = new Discord.RichEmbed({
					'title': 'Karma Scoreboard',
					'color': 9224077,
					'timestamp': Date.now(),
					'footer': {
						'icon_url': bot.user.avatarURL,
						'text': bot.user.username
					},
					'fields': fields
				})

				msg.channel.send(embed)
					.then(m => {
						setInterval(() => {
							let fields = []
							let data = getAllUsers()

							data.forEach((e, i) => {
								let karma = Math.floor(e.karma * 100) / 100;
								if (karma !== 0) {
									fields.push({
										name: `#${i + 1} ${e.name}`,
										value: `\`\`\`Karma: ${karma}\`\`\``
									})
								}
							})

							let newEmbed = new Discord.RichEmbed({
								'title': 'Karma Scoreboard',
								'color': 9224077,
								'timestamp': Date.now(),
								'footer': {
									'icon_url': bot.user.avatarURL,
									'text': bot.user.username
								},
								'fields': fields
							})

							m.edit(newEmbed).catch(e => console.error(e))
						}, 15 * 60000)
					})

				setInterval(() => {

				}, 5 * 60000)

				return
			}

			if (msg.content.startsWith('!poll ')) { // !poll <messageID ?String> <broadcast ?boolean> <timeoutMin ?Float> <emojiOne ?String> <emojiTwo ?String> ...
				let options = msg.content.split(' ')

				if (options.length < 6) {
					msg.reply('required parameters not met').then((m) => {
						setTimeout(() => {
							m.delete()
						}, 5000)
					})
				}

				msg.delete()

				let msgID = options[1]
				let broadcast = (options[2] == 'true')
				let timeout = parseFloat(options[3])
				let emojis = []

				for (let i = 4; i < options.length; i++) {
					emojis.push(options[i])
				}

				msg.channel.fetchMessage(msgID).then(m => {
					addPollVote(m, broadcast, timeout, emojis)
				})

				return
			}

			if (msg.content.startsWith('!togglemute ')) {
				let user = msg.mentions.users.first()
				msg.delete()

				if (user.id === botID) {
					msg.reply('cannot mute bot')
					return
				}

				let data = getUser(user)
				let mutedStatus = !data.muted
				data.muted = !data.muted
				msg.channel.sendMessage(`Set <@${user.id}>'s muted status to \`${mutedStatus}\``)
				writeUser(user, data)
				return
			}
		}

		if (msg.content === '!help') {

			msg.channel.send({
				embed: {
					color: 4886754,
					title: 'Help Menu',
					fields: [{
						name: 'Assign Year Roles',
						value: '```!year <year>\nUse \'4\' if you are Alumni```'
					},
					{
						name: 'Assign Campus',
						value: '```!campus <campus name>```'
					},
					{
						name: 'View Help Menu',
						value: '```!help```'
					},
					{
						name: 'View Rules',
						value: '```!rules```'
					},
					{
						name: 'View Karma',
						value: '```!karma\n!karma @username```'
					},
					{
						name: 'Toggle Karma',
						value: '```!karmaToggle```'
					}
					],
					timestamp: new Date(),
					footer: {
						icon_url: bot.user.avatarURL,
						text: 'SDNE Bot'
					}
				}
			})

			return
		}

		if (msg.content === '!rules') {

			const embeds = [
				{
					title: 'Rule 1 - Keep it friendly and respectful. ',
					description: 'We\'re all mature here, please do not be disrespectful towards any users(no hateful nicknames!).Harassment or encouragement of harassment of any kind is not tolerated, including sexual harassment.',
					color: 13632027
				},
				{
					title: 'Rule 2 - Keep chats safe for work',
					description: 'Please do not post any NSFW pictures or links in any of the channels, a lot of us use Discord on our phone or on our computers when in class so keep that in mind.',
					color: 2818297
				},
				{
					title: 'Rule 3 - No spamming or trolling',
					description: 'Spamming is **not** allowed on this server. No excessive trolling is allowed on this server, do **not** deliberately make others uncomfortable or deliberately derail a conversation. \n Do not post any malicious links.',
					color: 1571072
				},
				{
					title: 'Rule 4 - Use the appropriate channels',
					description: 'We have multiple channels, so please make sure your discussion aligns with the channel you are in.',
					color: 12390624
				},
				{
					title: 'Rule 5 - Enforcing Academic Integrity',
					description: 'Please do not ask for any help on assignments you have for your classes. Academic integrity is taken very seriously at Sheridan and as students in the SDNE program, we all must follow these rules.',
					color: 16776969
				},
				{
					title: 'Information',
					description: 'To access all channels, you must assign which year you are in from 1-4 in the SDNE program. 4 represents Alumni. \n```!year <your year>``` in the <#619603429379014667> channel. \n \nEach year gets their own category where members of that year can add channels for whatever they would like to discuss.\nYou can also assign your campus with ```!campus <campus-name>```so you can find others on your campus!',
					color: 10197915
				}
			]

			if (msg.channel.id === rules_info) {
				msg.delete()
				embeds.forEach(function (i) {
					msg.channel.send({ embed: i })
				})
			}
			else {
				msg.reply('check your DMs!')
				embeds.forEach(function (i) {
					msg.author.send({ embed: i })
				})
			}

			return

		}

		if (msg.content === '!karmatoggle') {
			let data = getUser(msg.author)

			data.karmaToggle = !data.karmaToggle

			writeUser(msg.author, data)

			msg.channel.send({
				'embed': {
					'title': `${msg.author.username}'s Karma Info`,
					'color': 9224077,
					'timestamp': new Date(),
					'footer': {
						'icon_url': `${msg.author.avatarURL}`,
						'text': `${msg.author.username}`
					},
					'fields': [
						{
							'name': 'Karma Toggle',
							'value': `\`\`\`KarmaToggle: ${data.karmaToggle}\`\`\``
						}
					]
				}
			})

			return
		}

		if (msg.content.startsWith('!karma')) {
			let user

			if (msg.mentions.users.size > 0)
				user = msg.mentions.users.first()
			else
				user = msg.author

			let data = getUser(user)

			let tranString = 'No Transactions'

			if (data.transactions.length !== 0) {
				tranString = ''
				for (let i = data.transactions.length - 1; i > data.transactions.length - 6; i--) {
					tranString += (data.transactions[i] !== undefined ? `${data.transactions[i]}\n` : '')
				}
			}

			msg.channel.send({
				'embed': {
					'title': `${data.name}'s Karma Info`,
					'color': 9224077,
					'timestamp': new Date(),
					'footer': {
						'icon_url': `${user.avatarURL}`,
						'text': `${data.name}`
					},
					'fields': [
						{
							'name': 'Karma Level',
							'value': `\`\`\`Karma: ${Math.floor(data.karma * 100) / 100}\`\`\``
						},
						{
							'name': 'Karma Toggle',
							'value': `\`\`\`KarmaToggle: ${data.karmaToggle}\`\`\``
						},
						{
							'name': 'Karma Transactions',
							'value': `\`\`\`${tranString}\`\`\``
						}
					]
				}
			})

			return
		}

		msg.reply('that\'s not a vaild command, use `!help` to see commands you can use!')

	} else {
		// Message is a normal message
		let userData = getUser(msg.author)

		if (msg.channel.id === assign_year) {

			msg.delete()
			msg.reply(`this channel is only for assigning your year and campus, see <#${rules_info}> for more information or ask for help in <#${support}>.`).then(m => {
				setTimeout(() => {
					m.delete()
				}, 15000)
			})

			return

		}

		if (hasAttachment(msg) || hasURL(msg)) {
			addKarmaVote(msg.author, msg)
			return
		}

		if (msg.content.includes('boomer')) {
			(async () => {
				await msg.react('🆗')
				await msg.react('🇧')
				await msg.react('🇴')
				await msg.react('🅾')
				await msg.react('🇲')
				await msg.react('🇪')
				await msg.react('🇷')
			})
		}

		if (!userData.karmaToggle)
			return

		if (msg.content.length < Math.round(Math.random() * 5))
			return;

		modKarma(msg.author, userData, (Math.random() * 0.025) / (msg.content.length / 100), 'Message Karma')

	}

})

// Find & Get User from JSON
let getUser = (user) => {
	let data = JSON.parse(fs.readFileSync(__dirname + '/bot_data.json'))

	let userData = {
		'id': user.id,
		'name': user.username,
		'karma': 0,
		'karmaToggle': true,
		'muted': false,
		'transactions': []
	}

	data.forEach((e, i) => {
		if (e.id == user.id) {
			userData = {
				'id': e.id,
				'name': e.name,
				'karma': e.karma,
				'karmaToggle': e.karmaToggle,
				'muted': (e.muted !== undefined ? e.muted : false),
				'transactions': e.transactions
			}
		}
	})

	writeUser(user, userData)
	return userData
}

let getAllUsers = () => {
	let data = JSON.parse(fs.readFileSync(__dirname + '/bot_data.json'))
	return data
}

// See if User alreadly exists in JSON
let userExists = (user) => {
	let data = JSON.parse(fs.readFileSync(__dirname + '/bot_data.json'))

	let found = false
	data.forEach((e, i) => {
		if (e.id == user.id)
			found = true
	})

	return found
}

// Write User to JSON
function writeUser(user, userData) {
	let data = JSON.parse(fs.readFileSync(__dirname + '/bot_data.json'))

	if (userExists(user)) {
		data.forEach((e, i) => {
			if (e.id == user.id) {
				e.name = userData.name
				e.karma = userData.karma
				e.karmaToggle = userData.karmaToggle
				e.muted = userData.muted
				e.transactions = (userData.transactions !== undefined ? userData.transactions : [])
			}
		})
	} else {
		data.push(userData)
	}

	data.sort((a, b) => {
		return a.karma - b.karma
	})

	data.reverse()

	fs.writeFileSync(__dirname + '/bot_data.json', JSON.stringify(data))
}

function modKarma(user, userData, amount, source) {
	if (userData.transactions == undefined)
		userData.transactions = []

	let type = '';
	userData.karma += amount
	amount = Math.floor(amount * 100) / 100

	if (amount > 0)
		type = 'Added'
	else if (amount < 0)
		type = 'Removed'
	else
		return

	userData.transactions.push(`${type} ${Math.abs(amount)} from ${source.toString()}`)


	writeUser(user, userData)
}

function addKarmaVote(user, msg) {
	let userData = getUser(user)

	if (!userData.karmaToggle)
		return

	msg.react('👍').then(() => msg.react('👎')).then(() => {

		const filter = (reaction, user) => {
			return (reaction.emoji.name === '👍' || reaction.emoji.name === '👎') && user.id !== botID
		}

		const collector = msg.createReactionCollector(filter, { time: 15 * 60000 })

		collector.on('collect', (reaction, reactionCollector) => {
			let opposite = reaction.emoji.name === '👍' ? '👎' : '👍'
			let users = reaction.users.array()

			reactionCollector.collected.forEach(r => {
				let reactUsers = r.users.array()

				if (r.emoji.name === opposite) {
					for (let i = 0; i < users.length; i++) {
						for (let j = 0; j < reactUsers.length; j++) {
							if (users[i].id === reactUsers[j].id && users[i].id !== botID) {
								r.remove(reactUsers[j])
							}
						}
					}
				}
			})
		})

		collector.on('end', collected => {
			let plusCount = 0
			let minusCount = 0

			collected.forEach(reaction => {
				if (reaction.emoji.name === '👍') {
					plusCount = reaction.count - 1
				} else {
					minusCount = reaction.count - 1
				}
			})

			let total = (5 * plusCount) - (2.5 * minusCount)

			modKarma(user, userData, total, 'Attachment Karma')

		})
	})
}

function addPollVote(msg, broadcast, timeout, emojis) {
	timeout *= 60000

	emojis.forEach(async (emoji) => {
		await msg.react(emoji)
	})

	const filter = (reaction, user) => {
		return emojis.includes(reaction.emoji.name) && user.id !== botID
	}

	const collector = msg.createReactionCollector(filter, { time: timeout })

	collector.on('collect', (reaction, reactionCollector) => {

	})

	collector.on('end', collected => {
		let max = [0, '']

		collected.forEach(reaction => {
			if (max[0] < reaction.count) {
				max[0] = reaction.count
				max[1] = reaction.emoji.name
			}
		})

		if (broadcast)
			msg.channel.send(`Time's up!\n${max[1]} is the winner with ${max[0]} votes!`)
		else
			msg.channel.send(`Time's up!`)
	})
}

let hasAttachment = (msg) => {
	return (msg.attachments.size > 0)
}

let hasURL = (msg) => {
	return (msg.content.indexOf('https://') !== -1 || msg.content.indexOf('http://') !== -1)
}

String.prototype.toHHMMSS = function () {
	var sec_num = parseInt(this, 10); // don't forget the second param
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours < 10) { hours = "0" + hours; }
	if (minutes < 10) { minutes = "0" + minutes; }
	if (seconds < 10) { seconds = "0" + seconds; }
	var time = hours + ' hrs, ' + minutes + ' mins & ' + seconds + ' seconds';
	return time;
}

// Perform Async function as Sync & add user to role
async function addRole(member, roleID, reason = 'No Reason Given') {
	await member.addRole(roleID, reason).catch(console.error)
}

// Perform Async function as Sync & remove user from role
async function delRole(member, roleID, reason = 'No Reason Given') {
	await member.removeRole(roleID, reason).catch(console.error)
}