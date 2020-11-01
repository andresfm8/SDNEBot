import * as Discord from 'discord.js'
import { Permissions } from 'discord.js'

import * as db from '../../database'
import { bot } from '../../bot'
import { roles } from '../globVars'

export function handleNewMember(member: Discord.GuildMember | Discord.PartialGuildMember) {
	member.fetch().then(async mem => {
		db.updateUser(mem.id, mem.user.username)
		let id = await db.getConfig('assignChannel')

		let members = await mem.guild.members.fetch()

		let admins: string = ''

		members.array().forEach(m => {
			if (m.hasPermission(Permissions.FLAGS.ADMINISTRATOR) && !m.user.bot) {
				if (admins === '')
					admins += `<@${m.id}>`
				else
					admins += `, <@${m.id}>`
			}
		})

		mem.send(`**Welcome to the SDNE Discord!**\nMake sure to assign your year and campus using the corresponding\nreactions in <#${id}> in order to access all the channels!\nDM ${admins} if you need help.`)

		mem.roles.add(roles['👻']).catch(err => console.error(err))
	})
}