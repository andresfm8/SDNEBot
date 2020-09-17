import { ReactionRole } from "../models/ReactionRole";

const yearOneRole = new ReactionRole('📗', '619581998574469120', (member, allRoles) => {
    let p: Promise<string> = new Promise((res, rej) => {
        let roles = []

        allRoles.forEach(r => {
            if ((r.emoji === '📘' || r.emoji === '📙' || r.emoji === '📜' || r.emoji === '👻') // Add conflicting roles to array
                && r.role.guild == yearOneRole.role.guild) // Ensure roles are in the same guild
                roles.push(r.role)
        })

        member.roles.remove(roles)
            .then(() => res('Success'))
            .catch(err => rej(err))
    })

    return p
})