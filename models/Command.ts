import * as Discord from "discord.js";

export class Command {
	/** Names to call the command (Don't include Prefix here) */
	public readonly alias: string[]

	/** Ignore the defined prefix (Useful for commands replying to messages) */
	public readonly ignorePrefix: boolean = false

	/** Ignore the capitalization of the command */
	public readonly ignoreCase: boolean = true

	/** Array of required Permissions to run this command */
	public readonly perms: Discord.Permissions[]

	/** Function to run before the run function */
	private evaluate: Function

	/** Create a new Command */
	constructor(alias: string[], ignorePrefix: boolean, ignoreCase: boolean, perms: Discord.Permissions[], evaluate: (msg: Discord.Message) => any) {
		this.alias = alias
		this.perms = perms
		this.ignorePrefix = ignorePrefix
		this.ignoreCase = ignoreCase
		this.evaluate = evaluate
	}

	/** DO NOT MANUALLY CALL THIS FUNCTION */
	public run(msg: Discord.Message) {
		let foundPerms: number = 0

		this.perms.forEach(p => {
			if (msg.member.hasPermission(p))
				foundPerms++;
		})

		if (foundPerms < this.perms.length)
			return console.error("Member Missing Permissions")

		this.evaluate(msg)
	}
}
