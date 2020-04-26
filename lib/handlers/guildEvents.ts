import * as Discord from 'discord.js'
import { Permissions } from 'discord.js'

import * as db from '../../database'
import { bot } from '../../bot'
import { roles } from '../globVars'

export async function handleNewMember(member: Discord.GuildMember | Discord.PartialGuildMember) {
    if (member.partial) await member.fetch()

    db.updateUser(member.id, member.user.username)
    let id = await db.getConfig('assignChannel')

    let members = await member.guild.members.fetch()

    let admins: string = ''

    members.array().forEach(m => {
        if (m.hasPermission(Permissions.FLAGS.ADMINISTRATOR) && !m.user.bot) {
            if (admins === '')
                admins += `<@${m.id}>`
            else
                admins += `, <@${m.id}>`
        }
    })

    member.send(`**Welcome to the SDNE Discord!**\nMake sure to assign your year and campus using the corresponding\nreactions in <#${id}> in order to access all the channels!\nDM ${admins} if you need help.`)

    member.roles.add(roles['👻'])
}