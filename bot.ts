// Imports
import * as Discord from 'discord.js'

import * as db from './database'
import { roles } from './globVars'
import { handleReactionAdd } from './lib/handlers/reactions'
import { handleMessage } from './lib/handlers/messages'

// Instances
export const bot = new Discord.Client({ partials: Object.values(Discord.Constants.PartialTypes) })

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

//#region Event Listeners

// Listen for Messages
bot.on('message', message => { handleMessage(message) })

// Listen for Reactions
bot.on('messageReactionAdd', (reaction, user) => { handleReactionAdd(reaction, user) })

//#endregion

// Login Bot
bot.login('NzAyMTkwNTIxNzMyMzAwODIw.Xp82MA.b3lKG2D8nniuMFq91BTJ_kvtFMQ')