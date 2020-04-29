import * as Discord from 'discord.js'
import * as db from '../../database'

import { Timestamp } from 'mongodb'
import { Permissions } from 'discord.js'
import { bot } from '../../bot'
import { setHelpPage, rules } from '../globVars'
import { help, hasAttachment, hasURL } from '../funcs'

export function handleMessage(msg: Discord.Message) {
    if (msg.author.bot || msg.system)
        return

    if (msg.channel.type === 'dm' || msg.channel.type === 'news')
        return

    db.getUser(msg.author.id, (user: Object) => {
        if (user['muted'] === true)
            msg.delete()
    })

    db.updateUser(msg.author.id, msg.author.username, undefined, undefined, undefined, (msg.content.length / 50) | 0, true)

    var m: string = msg.content.toLowerCase().trim()

    // View Help Menu
    if (m.startsWith('!help')) {
        setHelpPage(help(msg.member, 0, msg.channel))
        return
    }

    // View Rules
    if (m.startsWith('!rules')) {
        let dm = false

        rules.forEach(rule => {
            let embed = {
                'embed': {
                    'title': `${rule.title}`,
                    'description': `${rule.rule}`,
                    'color': 3553599
                }
            }

            if (msg.member.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES))
                msg.channel.send(embed).then(() => msg.delete())
            else {
                msg.member.send(embed)
                dm = true
            }
        })

        if (dm)
            msg.reply('check your DMs!')

        return
    }

    // For commands that modify Roles
    if (msg.member.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
        let color = 33023

        // Displays Role Assignment Embed
        if (m.startsWith('!assigninfo')) {
            let embed = {
                'embed': {
                    'title': 'Role Assignment Info',
                    'description': 'Click a corresponding reaction to set your year & campus and gain access to the other channels!',
                    'color': color,
                    'timestamp': new Date(),
                    'fields': [
                        {
                            'name': '📗',
                            'value': 'First Years',
                            'inline': true
                        },
                        {
                            'name': '📘',
                            'value': 'Second Years',
                            'inline': true
                        },
                        {
                            'name': '📙',
                            'value': 'Third Years',
                            'inline': true
                        },
                        {
                            'name': '🧾',
                            'value': 'Alumni',
                            'inline': true
                        },
                        {
                            'name': '1️⃣',
                            'value': 'Trafalgar Campus',
                            'inline': true
                        },
                        {
                            'name': '2️⃣',
                            'value': 'Davis Campus',
                            'inline': true
                        }
                    ]
                }
            }
            msg.delete()
            msg.channel.send(embed).then((m: Discord.Message) => {
                m.react('📗').then(() => { m.react('📘').then(() => { m.react('📙').then(() => { m.react('🧾').then(() => { m.react('1️⃣').then(() => { m.react('2️⃣').then(() => { }) }) }) }) }) })
                db.updateConfig('assign', m.id)
            })

            return
        }
    }

    // For commands that modify messages or require at least Mod role
    if (msg.member.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES)) {
        let color = 3553599

        // Displays Info on user
        if (m.startsWith('!info')) {
            if (msg.mentions.users.first() === undefined) {
                msg.react('❓')
                return
            }

            msg.mentions.users.array().forEach(mention => {
                let nick = (msg.guild.member(mention).nickname ? msg.guild.member(mention).nickname : mention.username)

                db.getUser(mention.id, (userData: Object) => {
                    let time: Timestamp = userData['lastUpdated']

                    let embed = {
                        'embed': {
                            'title': `${nick}'s Information`,
                            'description': `Get a user's information`,
                            'color': color,
                            'timestamp': new Date(time.toNumber()),
                            'footer': {
                                'text': 'Last Updated'
                            },
                            'fields': [
                                {
                                    'name': 'Warns',
                                    'value': `\`\`\`${userData['warns']}\`\`\``,
                                    'inline': true
                                },
                                {
                                    'name': 'Kicks',
                                    'value': `\`\`\`${userData['kicks']}\`\`\``,
                                    'inline': true
                                },
                                {
                                    'name': 'Muted',
                                    'value': `\`\`\`${userData['muted']}\`\`\``,
                                    'inline': true
                                },
                                {
                                    'name': 'Contribution Points',
                                    'value': `\`\`\`${userData['cbp']}\`\`\``,
                                    'inline': true
                                }
                            ]
                        }
                    }

                    if (mention.avatarURL() !== null)
                        embed['embed']['thumbnail'] = { 'url': mention.avatarURL({ dynamic: true, size: 4096 }) }

                    msg.channel.send(embed)
                })
            })

            return
        }

        // Cleans up Messages
        if (m.startsWith('!cleanup')) {
            if (m.indexOf(' ') === -1) {
                msg.react('❓')
                return
            }

            let amount: number = Number.parseInt(m.split(' ', 2)[1])

            if (isNaN(amount)) {
                msg.react('❓')
                return
            }

            if (amount < 1) {
                msg.react('❓')
                return
            }

            if (amount > 100)
                amount = 100

            msg.delete()
            msg.channel.bulkDelete(amount, true)
                .then((deleted) => {
                    msg.reply(`deleted ${deleted.size} messages`).then((r) => {
                        setTimeout(() => {
                            r.delete()
                        }, 5000)
                    })
                })
                .catch((err: Discord.DiscordAPIError) => {
                    msg.reply(`${err.message}`).then((r) => {
                        setTimeout(() => {
                            r.delete()
                        }, 10000)
                    })
                })

            return
        }
    }

    // For commands that inhibit user's speaking privs and/or could result in an auto kick
    if (msg.member.hasPermission(Permissions.FLAGS.KICK_MEMBERS)) {
        let color = 16725558

        // Mute User(s)
        if (m.startsWith('!mute')) {
            if (msg.mentions.users.first() === undefined) {
                msg.react('❓')
                return
            }

            let mutedUsers: string = ''

            msg.mentions.users.array().forEach(user => {
                if (msg.guild.member(user).hasPermission(Permissions.FLAGS.KICK_MEMBERS))
                    return

                db.updateUser(user.id, user.username, undefined, undefined, true)

                let nick: string = (msg.guild.member(user).nickname ? msg.guild.member(user).nickname : user.username)

                if (mutedUsers === '')
                    mutedUsers += nick
                else
                    mutedUsers += `, ${nick}`
            })

            let embed = {
                'embed': {
                    'title': `🔈 Mute Users`,
                    'color': color,
                    'timestamp': new Date(),
                    'fields': [
                        {
                            'name': 'Successfully Muted:',
                            'value': `\`\`\`${mutedUsers}\`\`\``,
                        }
                    ]
                }
            }

            if (mutedUsers !== '')
                msg.channel.send(embed)
            else
                msg.react('❓')

            return
        }

        // Unmute User(s)
        if (m.startsWith('!unmute')) {
            if (msg.mentions.users.first() === undefined) {
                msg.react('❓')
                return
            }

            let unmutedUsers: string = ''

            msg.mentions.users.array().forEach(mention => {
                if (msg.guild.member(mention).hasPermission(Permissions.FLAGS.KICK_MEMBERS))
                    return

                db.updateUser(mention.id, mention.username, undefined, undefined, false)

                let nick: string = (msg.guild.member(mention).nickname ? msg.guild.member(mention).nickname : mention.username)

                if (unmutedUsers !== '')
                    unmutedUsers += ', '

                unmutedUsers += nick
            })

            let embed = {
                'embed': {
                    'title': `🔊 Unmute Users`,
                    'color': color,
                    'timestamp': new Date(),
                    'fields': [
                        {
                            'name': 'Successfully Unmuted:',
                            'value': `\`\`\`${unmutedUsers}\`\`\``,
                        }
                    ]
                }
            }

            if (unmutedUsers !== '')
                msg.channel.send(embed)
            else
                msg.react('❓')

            return
        }

        // Warn User(s)
        if (m.startsWith('!warn')) {
            if (msg.mentions.users.first() === undefined) {
                msg.react('❓')
                return
            }

            let ruleNum = Number.parseInt(msg.content.split(' ', 3)[1])

            if (ruleNum === NaN || ruleNum > rules.length || ruleNum < 1) {
                msg.react('❓')
                return
            }

            var warned: string = ''

            var embed = {
                'embed': {
                    'title': `🚩 Rule Violation`,
                    'description': 'You violated:',
                    'color': color,
                    'timestamp': new Date(),
                    'fields': [
                        {
                            'name': `**${rules[ruleNum - 1].title}**`,
                            'value': `${rules[ruleNum - 1].rule}`,
                        }
                    ]
                }
            }

            msg.mentions.users.array().forEach(mention => {
                if (msg.guild.member(mention).hasPermission(Permissions.FLAGS.KICK_MEMBERS))
                    return

                db.getUser(mention.id, (userData: Object) => {
                    db.updateUser(mention.id, mention.username, 1, undefined, undefined, undefined, true)

                    userData['warns'] += 1

                    if (userData['warns'] % 3 === 0 && userData['warns'] !== 0) {
                        db.updateUser(mention.id, mention.username, undefined, 1, undefined, undefined, true)
                        userData['kicks'] += 1

                        if (userData['kicks'] % 3 === 0 && userData['kicks'] !== 0) {
                            msg.guild.member(mention).send(`**You have been banned for violating the rules:**`, embed).then(() => {
                                msg.guild.member(mention).ban({ reason: `${mention.username} banned because they have ${userData['kicks']} kicks.` })
                            })
                        } else {
                            msg.guild.member(mention).send(`**You have been kicked for violating the rules:**`, embed).then(() => {
                                msg.guild.member(mention).kick(`${mention.username} kicked because they have ${userData['warns']} warnings.`)
                            })
                        }
                    }
                })

                if (warned !== '')
                    warned += ', '

                warned += `<@${mention.id}>`
            })

            if (warned !== '')
                msg.channel.send(warned, embed).then(() => msg.delete())
            else
                msg.react('❓')

            return
        }
    }

    if (m.startsWith('!')) {
        msg.react('❓')
        return
    }

    if (hasAttachment(msg) || hasURL(msg))
        msg.react('👍').then(() => msg.react('👎').then(() => { msg.react('📌') }))
}

export async function handleMessageDelete(msg: Discord.Message | Discord.PartialMessage) {
    if (msg.partial) await msg.fetch()

    if (msg.author.bot || msg.system)
        return

    let id = await db.getConfig('deletedChannel')
    let channel = <Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel>bot.guilds.cache.first().channels.cache.get(id)

    if (msg.channel === channel)
        return

    let nick = (msg.member.nickname ? msg.member.nickname : msg.author.username)

    let content = msg.content.replace(/`/g, '')

    channel.send(`**${nick}'s message in <#${msg.channel.id}> was deleted:**\`\`\`${content}\`\`\``)
}

export async function handleMessageEdit(oldMsg: Discord.Message | Discord.PartialMessage, newMsg: Discord.Message | Discord.PartialMessage) {
    if (oldMsg.partial) await oldMsg.fetch()
    if (newMsg.partial) await newMsg.fetch()

    if (oldMsg.author.bot)
        return

    db.getUser(oldMsg.author.id, (user: Object) => {
        if (user['muted'] === true)
            newMsg.delete()
    })

    let id = await db.getConfig('editedChannel')
    let channel = <Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel>bot.guilds.cache.first().channels.cache.get(id)

    let nick = (oldMsg.member.nickname ? oldMsg.member.nickname : oldMsg.author.username)

    let oldContent = oldMsg.content.replace(/`/g, '')
    let newContent = newMsg.content.replace(/`/g, '')

    channel.send(`**${nick} changed their message in <#${oldMsg.channel.id}> from:**\`\`\`${oldContent}\`\`\`**to:**\`\`\`${newContent}\`\`\``)
}