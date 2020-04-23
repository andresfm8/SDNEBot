import * as Discord from 'discord.js'

import * as db from '../../database'
import { bot } from '../../bot'
import { help } from '../funcs'
import { pageNum, setPage, roles } from '../globVars'

export async function handleReactionAdd(rct: Discord.MessageReaction, usr: Discord.User | Discord.PartialUser) {

    if (rct.message.partial) await rct.message.fetch()

    var user = await usr.fetch()

    // Disallow actions for Bot
    if (user === bot.user)
        return

    // Disallow Reacting for Muted Users
    db.getUser(user.id, (usr: Object) => {
        if (usr === undefined) return
        if (usr['muted'] === true)
            rct.users.remove(user)
    })

    let assignId = await db.getConfig('assign').catch(err => console.error(err))

    let years = ['📗', '📘', '📙', '🧾']
    let campus = ['1️⃣', '2️⃣']

    let member: Discord.GuildMember = rct.message.guild.member(user)
    let eName: string = rct.emoji.name

    if (eName === '❓' && rct.users.cache.array().includes(bot.user)) {
        rct.remove()
        setPage(help(member, 0, rct.message.channel))
    } else if (eName === '➡' && rct.message.author === bot.user) {
        rct.users.remove(user)
        setPage(help(member, pageNum + 1, undefined, rct.message))
    } else if (eName === '⬅' && rct.message.author === bot.user) {
        rct.users.remove(user)
        setPage(help(member, pageNum - 1, undefined, rct.message))
    } else if (eName === '💣' && rct.message.author === bot.user) {
        rct.message.delete()
        setPage(0)
    } else if (years.includes(eName) && rct.message.id === assignId) {
        rct.message.reactions.cache.forEach(async function (r) {
            let users = await r.users.fetch()
            if (r.emoji.name != eName && users.array().includes(user) && !campus.includes(r.emoji.name))
                r.users.remove(user)
        })

        member.roles.remove([roles['📗'], roles['📘'], roles['📙'], roles['🧾']], 'Removed Conflicting Years').then(() => {
            member.roles.add(roles[eName], `Added ${roles[eName].name}`).catch(err => console.error(err))
        }).catch(err => console.error(err))
    } else if (campus.includes(eName) && rct.message.id === assignId) {
        rct.message.reactions.cache.forEach(async function (r) {
            let users = await r.users.fetch()
            if (r.emoji.name != eName && users.array().includes(user) && !years.includes(r.emoji.name))
                r.users.remove(user)
        })

        member.roles.remove([roles['1️⃣'], roles['2️⃣']], 'Removed Conflicting Campuses').then(() => {
            member.roles.add(roles[eName], `Added ${roles[eName].name}`).catch(err => console.error(err))
        }).catch(err => console.error(err))
    } else {
        let author: Discord.User = rct.message.author

        if (author === bot.user || author === user)
            return

        db.updateUser(author.id, author.username, undefined, undefined, undefined, 1, true)
    }
}