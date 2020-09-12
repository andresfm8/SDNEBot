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

    db.getRoles((res: Array<Object>) => {
        res.forEach(resRole => {
            bot.guilds.cache.first().roles.cache.forEach(role => {
                if (resRole['rid'] == role.id)
                    roles[resRole['name']] = role
            })
        })
    })

    // setTimeout(() => {
    //     process.exit(0)
    // }, 9e+6)
})

// Listen for Members joining
bot.on('guildMemberAdd', member => handleNewMember(member))

// Listen for Messages
bot.on('message', message => handleMessage(message) )

// Listen for Message Deletions
bot.on('messageDelete', message => handleMessageDelete(message))

// Listen for Message Edits
bot.on('messageUpdate', (oldMessage, newMessage) => handleMessageEdit(oldMessage, newMessage))

// Listen for Reactions
bot.on('messageReactionAdd', (reaction, user) => { handleReactionAdd(reaction, user) })

// Login Bot
bot.login(botToken)