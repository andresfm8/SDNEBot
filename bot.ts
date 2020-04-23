// Imports
import * as Discord from 'discord.js'

import * as db from './database'
import { botToken } from './env'
import { roles } from './lib/globVars'
import { handleReactionAdd } from './lib/handlers/reactions'
import { handleMessage } from './lib/handlers/messages'

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
})

// Listen for Messages
bot.on('message', message => { handleMessage(message) })

// Listen for Reactions
bot.on('messageReactionAdd', (reaction, user) => { handleReactionAdd(reaction, user) })

// Login Bot
bot.login(botToken)