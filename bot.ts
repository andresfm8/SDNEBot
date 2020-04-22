// Imports
import * as Discord from 'discord.js'
import { Permissions } from 'discord.js'
import * as db from './database'
import { ObjectId } from 'mongodb'

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

//#region Event Listeners

// Listen for Messages
bot.on('message', msg => {
    if (msg.author.id !== '140948630919053312')
        return

    if (msg.author === bot.user)
        return

    db.getUser(msg.author.id, (user: Object) => {
        if (user === undefined) return
        if (user['muted'] === true)
            msg.delete()
    })

    // Assign Roles Embed
    if (msg.content.toLowerCase().startsWith('!assigninfo') && msg.member.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
        var embed = {
            "embed": {
                "title": "Role Assignment Info",
                "description": "Click a corresponding reaction to set your year & campus and gain access to the other channels!",
                "color": 3553599,
                "timestamp": new Date(),
                "fields": [
                    {
                        "name": "📗",
                        "value": "First Years",
                        "inline": true
                    },
                    {
                        "name": "📘",
                        "value": "Second Years",
                        "inline": true
                    },
                    {
                        "name": "📙",
                        "value": "Third Years",
                        "inline": true
                    },
                    {
                        "name": "🧾",
                        "value": "Alumni",
                        "inline": true
                    },
                    {
                        "name": "1️⃣",
                        "value": "Trafalgar Campus",
                        "inline": true
                    },
                    {
                        "name": "2️⃣",
                        "value": "Davis Campus",
                        "inline": true
                    }
                ]
            }
        };
        msg.delete()
        msg.channel.send(embed).then((m: Discord.Message) => {
            m.react('📗').then(() => { m.react('📘').then(() => { m.react('📙').then(() => { m.react('🧾').then(() => { m.react('1️⃣').then(() => { m.react('2️⃣').then(() => { }) }) }) }) }) })
        })
    }
})

// Listen for Reactions
bot.on('messageReactionAdd', (rct, user) => {
    if (user === bot.user)
        return

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
    }
})

//#endregion

// Login Bot
bot.login('NzAyMTkwNTIxNzMyMzAwODIw.Xp82MA.b3lKG2D8nniuMFq91BTJ_kvtFMQ')