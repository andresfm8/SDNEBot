// Imports
import * as Discord from 'discord.js'
import { Permissions } from 'discord.js'
import * as db from './database'

// Instances
const bot = new Discord.Client()

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`)
})

//#region Event Listeners

// Listen for Messages
bot.on('message', msg => {
    if (msg.author.id === bot.user.id)
        return

    db.getUser(msg.author.id, (user: JSON) => {
        if (user['muted'] === true)
            msg.delete()
    })

    if (msg.content.toLowerCase().startsWith('!assigninfo') && msg.member.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
        var embed = {
            "embed": {
                "title": "Role Assignment Info",
                "description": "Click a corresponding reaction to set your year & campus and gain access to the other channels!",
                "color": 3553599,
                "timestamp": Date.now().toLocaleString('YYYY-MM-DDTHH:MM:SS.MSSZ'),
                "footer": {
                    "icon_url": bot.user.avatarURL,
                    "text": "Sydney Bot"
                },
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
        msg.channel.send(embed)
    }
})

//#endregion

// Login Bot
bot.login('NzAyMTkwNTIxNzMyMzAwODIw.Xp82MA.b3lKG2D8nniuMFq91BTJ_kvtFMQ')