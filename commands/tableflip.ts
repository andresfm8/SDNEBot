import { Command } from "../models/Command";

// Create new command to reply to a user when they use Discord's /tableflip
export const tableflip = new Command(['(╯°□°）╯︵ ┻━┻'], true, true, [], msg => {
	msg.reply('┬─┬ ノ( ゜-゜ノ)')
})