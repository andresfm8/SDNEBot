import * as Discord from 'discord.js'

export class ReactionRole {
	/** Emoji that assigns the role */
	public readonly emoji: string

	/** RoleId of the role to assign to user */
	public readonly roleId: string

	/** Role to assign to user */
	public role: Discord.Role

	/** Function to be called before roles are assigned */
	private beforeAssign: (member: Discord.GuildMember, allRoles: ReactionRole[]) => Promise<string>

	/** Create new ReactionRole */
	constructor(emoji: string, roleId: string, beforeAssign: (member: Discord.GuildMember, allRoles: ReactionRole[]) => Promise<string>) {
		this.emoji = emoji
		this.roleId = roleId
		this.beforeAssign = beforeAssign
	}

	/** DO NOT MANUALLY CALL THIS FUNCTION */
	public setRole(guild: Discord.Guild): Promise<string> {
		let p: Promise<string> = new Promise((res, rej) => {
			guild.roles.fetch(this.roleId)
				.then(role => {
					this.role = role
					res('Success')
				})
				.catch(err => rej(err))
		})
		return p
	}

	/** DO NOT MANUALLY CALL THIS FUNCTION */
	public assignRole(member: Discord.GuildMember, allRoles: ReactionRole[]): Promise<string> {
		let p: Promise<string> = new Promise((res, rej) => {
			this.beforeAssign(member, allRoles).then(() => {
				member.roles.add(this.role).then(() => res('Success')).catch(err => rej(err))
			}).catch(err => rej(err))
		})
		return p
	}
}