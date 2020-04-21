// Imports
import * as Discord from 'discord.js'
import * as db from './database'

// Instances
const bot = new Discord.Client()

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`)
})

//#region Event Listeners

// Listen for Messages
bot.on('message', msg => {
    db.getUser(msg.author.id, (res) => {
        console.log(res)
    })
})

//#endregion

// Login Bot
bot.login('NzAyMTkwNTIxNzMyMzAwODIw.Xp82MA.b3lKG2D8nniuMFq91BTJ_kvtFMQ')