import * as Discord from 'discord.js'
import * as db from '../../database'

import { Timestamp } from 'mongodb'
import { Permissions } from 'discord.js'
import { bot } from '../../bot'
import { setPage } from '../globVars'
import { help } from '../funcs'

export function handleMessage(msg: Discord.Message) {
    if (msg.author === bot.user)
        return

    db.getUser(msg.author.id, (user: Object) => {
        if (user === undefined) return
        if (user['muted'] === true)
            msg.delete()
    })

    db.updateUser(msg.author.id, msg.author.username, undefined, undefined, undefined, (msg.content.length / 50) | 0, true)

    if (msg.author.id !== '140948630919053312')
        return

    // View Help Menu
    if (msg.content.toLowerCase().startsWith('!help')) {
        setPage(help(msg.member, 0, msg.channel))
    }

    // Assign Roles Embed
    if (msg.content.toLowerCase().startsWith('!assigninfo') && msg.member.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
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

    // View info on a User
    if (msg.content.toLowerCase().startsWith('!info') && msg.member.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES)) {
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

            if (mtd.avatarURL !== undefined)
                embed['embed']['thumbnail'] = { 'url': mtd.avatarURL }

            msg.channel.send(embed)
        })

        return
    }
}