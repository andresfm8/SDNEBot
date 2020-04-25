import * as Discord from 'discord.js'

export var roles: Object = {}
export var helpPage: number = 0

export function setHelpPage(num: number) {
    helpPage = num
}