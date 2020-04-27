import * as Discord from 'discord.js'
import * as db from '../../database'

import { Timestamp } from 'mongodb'
import { Permissions } from 'discord.js'
import { bot } from '../../bot'
import { setHelpPage, rules } from '../globVars'
import { help, hasAttachment, hasURL } from '../funcs'

export function handleMessage(msg: Discord.Message) {
    if (msg.author.bot)
        return

    if (msg.channel.type === 'dm' || msg.channel.type === 'news')
        return

    db.getUser(msg.author.id, (user: Object) => {
        if (user === undefined) return
        if (user['muted'] === true)
            msg.delete()
    })

    db.updateUser(msg.author.id, msg.author.username, undefined, undefined, undefined, (msg.content.length / 50) | 0, true)

    if (msg.author.id !== '140948630919053312')
        return

    var m: string = msg.content.toLowerCase().trim()

    // View Help Menu
    if (m.startsWith('!help')) {
        setHelpPage(help(msg.member, 0, msg.channel))
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

            msg.mentions.users.array().forEach(mtd => {
                let nick = (msg.guild.member(mtd).nickname ? msg.guild.member(mtd).nickname : mtd.username)

                db.getUser(mtd.id, (user) => {
                    if (user === undefined) {
                        db.updateUser(mtd.id, mtd.username)
                        user = {}
                        user['lastUpdated'] = Timestamp.fromNumber(Date.now())
                        user['warns'] = 0
                        user['kicks'] = 0
                        user['muted'] = false
                        user['cbp'] = 0
                    }

                    let time: Timestamp = user['lastUpdated']

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
                                    'value': `\`\`\`${user['warns']}\`\`\``,
                                    'inline': true
                                },
                                {
                                    'name': 'Kicks',
                                    'value': `\`\`\`${user['kicks']}\`\`\``,
                                    'inline': true
                                },
                                {
                                    'name': 'Muted',
                                    'value': `\`\`\`${user['muted']}\`\`\``,
                                    'inline': true
                                },
                                {
                                    'name': 'Contribution Points',
                                    'value': `\`\`\`${user['cbp']}\`\`\``,
                                    'inline': true
                                }
                            ]
                        }
                    }

                    if (mtd.avatarURL() !== null)
                        embed['embed']['thumbnail'] = { 'url': mtd.avatarURL({ dynamic: true, size: 4096 }) }

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

            msg.mentions.users.array().forEach(user => {
                if (msg.guild.member(user).hasPermission(Permissions.FLAGS.KICK_MEMBERS))
                    return

                db.updateUser(user.id, user.username, undefined, undefined, false)

                let nick: string = (msg.guild.member(user).nickname ? msg.guild.member(user).nickname : user.username)

                if (unmutedUsers === '')
                    unmutedUsers += nick
                else
                    unmutedUsers += `, ${nick}`
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

            let warned: string = ''
            let actions: string = ''

            msg.mentions.users.array().forEach(mtd => {
                if (msg.guild.member(mtd).hasPermission(Permissions.FLAGS.KICK_MEMBERS))
                    return

                db.updateUser(mtd.id, mtd.username, 1, undefined, undefined, undefined, true)

                db.getUser(mtd.id, (user: Object) => {
                    if (user === undefined) {
                        db.updateUser(mtd.id, mtd.username)
                        user = {}
                        user['lastUpdated'] = Timestamp.fromNumber(Date.now())
                        user['warns'] = 0
                        user['kicks'] = 0
                        user['muted'] = false
                        user['cbp'] = 0
                    }
                    
                    if (user['warns'] % 4 === 0) {
                        db.updateUser(mtd.id, mtd.username, undefined, 1, undefined, undefined, true)
                        let days = user['warns'] / 4
                        msg.guild.member(mtd).ban({ days: days, reason: `${mtd.username} banned for ${days} day(s) because they have ${user['warns']} warnings.` })
                        let nick = (msg.guild.member(mtd).nickname ? msg.guild.member(mtd).nickname : mtd.username)

                        if (actions === '')
                            actions += `${nick} kicked for ${days} day(s)`
                        else
                            actions += `\n${nick} kicked for ${days} day(s)`
                    }
                })

                if (warned === '')
                    warned += `<@${mtd.id}>`
                else
                    warned += `, <@${mtd.id}>`
            })

            let embed = {
                'embed': {
                    'title': `🚩 Rule Violation`,
                    'description': 'You violated:',
                    'color': color,
                    'timestamp': new Date(),
                    'fields': [
                        {
                            'name': `**${rules[ruleNum + 1].title}**`,
                            'value': `${rules[ruleNum + 1].rule}`,
                        }
                    ]
                }
            }

            if (actions !== '')
                embed['embed']['fields'].push({ 'name': '**Actions Taken:**', 'value': actions })

            if (warned !== '')
                msg.channel.send(warned, embed)
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

    if (msg.author.bot)
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
        if (user === undefined) return
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