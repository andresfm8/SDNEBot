import * as Discord from 'discord.js'
import * as db from '../../database'

import { Timestamp } from 'mongodb'
import { Permissions } from 'discord.js'
import { bot } from '../../bot'
import { setHelpPage } from '../globVars'
import { help, hasAttachment, hasURL } from '../funcs'

export function handleMessage(msg: Discord.Message) {
    if (msg.author === bot.user)
        return

    db.getUser(msg.author.id, (user: Object) => {
        if (user === undefined) return
        if (user['muted'] === true)
            msg.delete()
    })

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
        // Displays Role Assignment Embed
        if (m.startsWith('!assigninfo')) {
            let embed = {
                'embed': {
                    'title': 'Role Assignment Info',
                    'description': 'Click a corresponding reaction to set your year & campus and gain access to the other channels!',
                    'color': 3553599,
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
        // Displays Info on user
        if (m.startsWith('!info')) {
            if (msg.mentions.users.first() === undefined) {
                msg.react('❓')
                return
            }

            let mtd = msg.mentions.users.first()
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
                        'color': 3553599,
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

    if (m.startsWith('!')) {
        msg.react('❓')
        return
    }

    db.updateUser(msg.author.id, msg.author.username, undefined, undefined, undefined, (msg.content.length / 50) | 0, true)

    if (hasAttachment(msg) || hasURL(msg))
        msg.react('👍').then(() => msg.react('👎').then(() => { msg.react('📌') }))
}

export async function handleMessageDelete(msg: Discord.Message | Discord.PartialMessage) {
    if (msg.partial) await msg.fetch()

    if (msg.author === bot.user)
        return

    let id = await db.getConfig('deletedChannel')
    let channel = <Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel>bot.guilds.cache.first().channels.cache.get(id)

    if (msg.channel === channel)
        return

    let nick = (msg.member.nickname ? msg.member.nickname : msg.author.username)
    let ch = <Discord.TextChannel>msg.channel

    let embed = {
        'embed': {
            'title': `Message Deleted`,
            'description': `by ${nick} in ${ch.name}`,
            'color': 3553599,
            'timestamp': new Date(),
            'fields': []
        }
    }

    if (msg.author.avatarURL() !== null)
        embed['embed']['thumbnail'] = { 'url': msg.author.avatarURL({ dynamic: true, size: 4096 }) }

    if (msg.content !== '' && msg.content !== undefined)
        embed['embed']['fields'].push({ 'name': 'Message', 'value': `\`\`\`${msg.content}\`\`\`` })

    if (hasAttachment(msg))
        embed['embed']['fields'].push({ 'name': 'Attachments', 'value': `\`\`\`${msg.attachments.size}\`\`\`` })

    channel.send(embed)

}

export async function handleMessageEdit(oldMsg: Discord.Message | Discord.PartialMessage, newMsg: Discord.Message | Discord.PartialMessage) {
    if (oldMsg.partial) await oldMsg.fetch()
    if (newMsg.partial) await newMsg.fetch()

    if (oldMsg.author === bot.user)
        return
}