import * as Discord from 'discord.js'
import { Permissions } from 'discord.js'

export function help(member: Discord.GuildMember, page: number, channel?: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel, msg?: Discord.Message): number {

    let tips = [
        {
            'name': 'View Help',
            'value': '```!help```'
        },
        {
            'name': 'Placeholder Tip',
            'value': '```!placeHold```'
        },
        {
            'name': 'Placeholder Tip',
            'value': '```!placeHold```'
        },
        {
            'name': 'Placeholder Tip',
            'value': '```!placeHold```'
        },
        {
            'name': 'Placeholder Tip',
            'value': '```!placeHold```'
        }
    ]

    if (member.hasPermission(Permissions.FLAGS.MANAGE_ROLES))
        tips.push({ 'name': 'Assign Roles Embed', 'value': '```!assignInfo```' })

    if (member.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES))
        tips.push({ 'name': 'User Info', 'value': '```!info @user```' })

    let maxPages = Math.ceil(tips.length / 3)

    if (page > maxPages)
        page = maxPages

    if (page < 1)
        page = 1

    let embed = {
        'embed': {
            'title': 'Help Menu',
            'description': `Click the arrows to change pages. Page ${page} of ${maxPages}`,
            'color': 3553599,
            'timestamp': new Date(),
            'fields': []
        }
    }

    let toDisplay = [tips[((page - 1) * 3)], tips[((page - 1) * 3) + 1], tips[((page - 1) * 3) + 2]]

    toDisplay.forEach(t => {
        if (t !== undefined)
            embed['embed']['fields'].push(t)
    })

    if (channel !== undefined)
        channel.send(embed).then(m => { m.react('⬅').then(() => { m.react('➡').then(() => { m.react('💣') })}) })
    else if (msg !== undefined)
        msg.edit(embed)

    return page
}