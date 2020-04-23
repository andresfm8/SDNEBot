// Imports
import * as Discord from 'discord.js'
import { Permissions } from 'discord.js'
import * as db from './database'
import { Timestamp } from 'mongodb'

// Instances
const bot = new Discord.Client()

var roles: Object = {}

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`)

    db.getRoles((res: Array<Object>) => {
        res.forEach(resRole => {
            bot.guilds.first().roles.forEach(role => {
                if (resRole['rid'] == role.id)
                    roles[resRole['name']] = role
            })
        })
    })
})

function help(msg: Discord.Message, page: number) {
    
}

//#region Event Listeners

// Listen for Messages
bot.on('message', msg => {
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
})

// Listen for Reactions
bot.on('messageReactionAdd', (rct, user) => {
    // Disallow actions for Bot
    if (user === bot.user)
        return

    // Disallow Reacting for Muted Users
    db.getUser(user.id, (usr: Object) => {
        if (usr === undefined) return
        if (usr['muted'] === true)
            rct.remove(user)
    })

    let years = ['📗', '📘', '📙', '🧾']
    let campus = ['1️⃣', '2️⃣']

    if (years.includes(rct.emoji.name)) {
        let m: Discord.GuildMember = rct.message.guild.member(user)
        let e: string = rct.emoji.name

        rct.message.reactions.forEach(function (r) { if (r.emoji.name != e && r.users.array().includes(user) && !campus.includes(r.emoji.name)) r.remove(user) })

        m.removeRoles([roles['📗'], roles['📘'], roles['📙'], roles['🧾']], 'Removed Conflicting Years').then(() => {
            m.addRole(roles[e], `Added ${roles[e].name}`).catch(err => console.error(err))
        }).catch(err => console.error(err))
    } else if (campus.includes(rct.emoji.name)) {
        let m: Discord.GuildMember = rct.message.guild.member(user)
        let e: string = rct.emoji.name

        rct.message.reactions.forEach(function (r) { if (r.emoji.name != e && r.users.array().includes(user) && !years.includes(r.emoji.name)) r.remove(user) })

        m.removeRoles([roles['1️⃣'], roles['2️⃣']], 'Removed Conflicting Campuses').then(() => {
            m.addRole(roles[e], `Added ${roles[e].name}`).catch(err => console.error(err))
        }).catch(err => console.error(err))
    } else {
        let author: Discord.User = rct.message.author

        if (author === bot.user || author === user)
            return

        db.updateUser(author.id, author.username, undefined, undefined, undefined, 1, true)
    }
})

//#endregion

// Login Bot
bot.login('NzAyMTkwNTIxNzMyMzAwODIw.Xp82MA.b3lKG2D8nniuMFq91BTJ_kvtFMQ')