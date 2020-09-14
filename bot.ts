// Imports
import * as Discord from 'discord.js'

import * as db from './database'
import { botToken } from './env'
import { roles } from './lib/globVars'
import { handleReactionAdd } from './lib/handlers/reactions'
import { handleMessage, handleMessageDelete, handleMessageEdit } from './lib/handlers/messages'
import { handleNewMember } from './lib/handlers/guildEvents'

// Instances
export const bot = new Discord.Client({ partials: Object.values(Discord.Constants.PartialTypes) })

// Bot startup
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`)
    bot.user.setPresence({ activity: { type: 'WATCHING', name: 'for !help' }, status: 'online' })

    let roleList = [{
        "name": "📗",
        "rid": "619581998574469120"
    }, {
        "name": "📘",
        "rid": "619582112936362020"
    }, {
        "name": "📙",
        "rid": "619582159899852802"
    }, {
        "name": "🧾",
        "rid": "619582173522952233"
    }, {
        "name": "1️⃣",
        "rid": "620641262101463070"
    }, {
        "name": "2️⃣",
        "rid": "620641321908043798"
    }, {
        "name": "👻",
        "rid": "663060867490775071"
    }]


    roleList.forEach(resRole => {
        bot.guilds.cache.first().roles.cache.forEach(role => {
            if (resRole.rid == role.id)
                roles[resRole.name] = role
        })
    })


    // setTimeout(() => {
    //     process.exit(0)
    // }, 9e+6)
})

// Listen for Members joining
bot.on('guildMemberAdd', member => handleNewMember(member))

// Listen for Messages
bot.on('message', message => handleMessage(message))

// Listen for Message Deletions
// bot.on('messageDelete', message => handleMessageDelete(message))

// Listen for Message Edits
// bot.on('messageUpdate', (oldMessage, newMessage) => handleMessageEdit(oldMessage, newMessage))

// Listen for Reactions
bot.on('messageReactionAdd', (reaction, user) => { handleReactionAdd(reaction, user) })

// Login Bot
bot.login(botToken)