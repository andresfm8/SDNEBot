import * as Discord from 'discord.js'
import { Permissions } from 'discord.js'
import * as db from '../database'

export function help(member: Discord.GuildMember, page: number, channel?: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel, msg?: Discord.Message): number {

    let tips = [
        {
            'name': 'View Help',
            'value': '```!help```'
        },
        {
            'name': 'Pin Message',
            'value': '```React with 📌 on any message to save it```'
        }
    ]

    tips.push({ 'name': 'Create Channel', 'value': '```!make channelName```'})

    tips.push({ 'name': 'User(s\') Info', 'value': '```!info @user[]```' })

    tips.push({ 'name': 'View RateMyProfessor info', 'value': '```!rmp profName```'})

    if (member.hasPermission(Permissions.FLAGS.MANAGE_ROLES))
        tips.push({ 'name': 'Assign Roles Embed', 'value': '```!assignInfo```' })

    if (member.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES)) {
        tips.push({ 'name': 'Cleanup Messages', 'value': '```!cleanup #num_messages```' })
    }

    if (member.hasPermission(Permissions.FLAGS.KICK_MEMBERS)) {
        tips.push({ 'name': 'Mute User(s)', 'value': '```!mute @non_admin_user[]```' })
        tips.push({ 'name': 'Unmute User(s)', 'value': '```!unmute @non_admin_user[]```' })
        tips.push({ 'name': 'Warn User(s)', 'value': '```!warn #rule_num @non_admin_user[]```' })
    }

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
        channel.send(embed).then(m => { m.react('⬅️').then(() => { m.react('➡️').then(() => { m.react('🗑️') }) }); db.updateConfig('help', m.id) })
    else if (msg !== undefined)
        msg.edit(embed)

    return page
}

export function hasAttachment(msg: Discord.Message | Discord.PartialMessage): boolean {
    return (msg.attachments.size > 0)
}

export function hasURL(msg: Discord.Message | Discord.PartialMessage): boolean {
    return (msg.content.indexOf('https://') !== -1 || msg.content.indexOf('http://') !== -1)
}