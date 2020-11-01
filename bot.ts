// Imports
import * as Discord from 'discord.js'

import * as db from './database'
import { botToken, dbFile } from './env'
import { roles } from './lib/globVars'
import { handleReactionAdd } from './lib/handlers/reactions'
import { handleMessage, handleMessageDelete, handleMessageEdit } from './lib/handlers/messages'
import { handleNewMember } from './lib/handlers/guildEvents';
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Config } from './lib/Entities/Config';
import { User } from './lib/Entities/User';

// Instances
export const bot = new Discord.Client({ partials: Object.values(Discord.Constants.PartialTypes) })

// Create the connection to the database
createConnection({
    type: 'sqlite',
    database: `./${dbFile}`,
    entities: [
        Config,
        User
    ],
    synchronize: true,
    logging: false
}).then(connection => {
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
    })

    // Setup the Database
    console.log(db.getConfig('db_initialized'))



    // Listen for Members joining
    bot.on('guildMemberAdd', member => handleNewMember(member))

    // Listen for Messages
    bot.on('message', message => handleMessage(message))

    // Listen for Reactions
    bot.on('messageReactionAdd', (reaction, user) => { handleReactionAdd(reaction, user) })

    // Login Bot
    bot.login(botToken)

    /** Older functions */
    // Listen for Message Deletions
    // bot.on('messageDelete', message => handleMessageDelete(message))

    // Listen for Message Edits
    // bot.on('messageUpdate', (oldMessage, newMessage) => handleMessageEdit(oldMessage, newMessage))
}).catch(error => console.log(error));