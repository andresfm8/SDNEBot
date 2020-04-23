"use strict";
exports.__esModule = true;
// Imports
var Discord = require("discord.js");
var discord_js_1 = require("discord.js");
var db = require("./database");
var mongodb_1 = require("mongodb");
// Instances
var bot = new Discord.Client({
    messageCacheMaxSize: -1,
    messageCacheLifetime: 3600,
    messageSweepInterval: 300
});
var roles = {};
bot.on('ready', function () {
    console.log("Logged in as " + bot.user.tag);
    db.getRoles(function (res) {
        res.forEach(function (resRole) {
            bot.guilds.first().roles.forEach(function (role) {
                if (resRole['rid'] == role.id)
                    roles[resRole['name']] = role;
            });
        });
    });
});
//#region Event Listeners
// Listen for Messages
bot.on('message', function (msg) {
    if (msg.author === bot.user)
        return;
    db.getUser(msg.author.id, function (user) {
        if (user === undefined)
            return;
        if (user['muted'] === true)
            msg["delete"]();
    });
    db.updateUser(msg.author.id, msg.author.username, undefined, undefined, undefined, (msg.content.length / 50) | 0, true);
    if (msg.author.id !== '140948630919053312')
        return;
    // Assign Roles Embed
    if (msg.content.toLowerCase().startsWith('!assigninfo') && msg.member.hasPermission(discord_js_1.Permissions.FLAGS.MANAGE_ROLES)) {
        var embed = {
            'embed': {
                'title': 'Role Assignment Info',
                'description': 'Click a corresponding reaction to set your year & campus and gain access to the other channels!',
                'color': 3553599,
                'timestamp': new Date(),
                'fields': [
                    {
                        'name': '📗',
                        'value': 'First Years',
                        'inline': true
                    },
                    {
                        'name': '📘',
                        'value': 'Second Years',
                        'inline': true
                    },
                    {
                        'name': '📙',
                        'value': 'Third Years',
                        'inline': true
                    },
                    {
                        'name': '🧾',
                        'value': 'Alumni',
                        'inline': true
                    },
                    {
                        'name': '1️⃣',
                        'value': 'Trafalgar Campus',
                        'inline': true
                    },
                    {
                        'name': '2️⃣',
                        'value': 'Davis Campus',
                        'inline': true
                    }
                ]
            }
        };
        msg["delete"]();
        msg.channel.send(embed).then(function (m) {
            m.react('📗').then(function () { m.react('📘').then(function () { m.react('📙').then(function () { m.react('🧾').then(function () { m.react('1️⃣').then(function () { m.react('2️⃣').then(function () { }); }); }); }); }); });
            db.updateConfig('assign', m.id);
        });
        return;
    }
    // View info on a User
    if (msg.content.toLowerCase().startsWith('!info') && msg.member.hasPermission(discord_js_1.Permissions.FLAGS.MANAGE_MESSAGES)) {
        if (msg.mentions.users.first() === undefined) {
            msg.react('❓');
            return;
        }
        var mtd_1 = msg.mentions.users.first();
        var nick_1 = (msg.guild.member(mtd_1).nickname ? msg.guild.member(mtd_1).nickname : mtd_1.username);
        db.getUser(mtd_1.id, function (user) {
            if (user === undefined) {
                db.updateUser(mtd_1.id, mtd_1.username);
                user = {};
                user['lastUpdated'] = mongodb_1.Timestamp.fromNumber(Date.now());
                user['warns'] = 0;
                user['kicks'] = 0;
                user['muted'] = false;
                user['cbp'] = 0;
            }
            var time = user['lastUpdated'];
            var embed = {
                'embed': {
                    'title': nick_1 + "'s Information",
                    'description': "Get a user's information",
                    'color': 3553599,
                    'timestamp': new Date(time.toNumber()),
                    'footer': {
                        'text': 'Last Updated'
                    },
                    'fields': [
                        {
                            'name': 'Warns',
                            'value': "```" + user['warns'] + "```",
                            'inline': true
                        },
                        {
                            'name': 'Kicks',
                            'value': "```" + user['kicks'] + "```",
                            'inline': true
                        },
                        {
                            'name': 'Muted',
                            'value': "```" + user['muted'] + "```",
                            'inline': true
                        },
                        {
                            'name': 'Contribution Points',
                            'value': "```" + user['cbp'] + "```",
                            'inline': true
                        }
                    ]
                }
            };
            if (mtd_1.avatarURL !== undefined)
                embed['embed']['thumbnail'] = { 'url': mtd_1.avatarURL };
            msg.channel.send(embed);
        });
        return;
    }
});
// Listen for Reactions
bot.on('messageReactionAdd', function (rct, user) {
    // Disallow actions for Bot
    if (user === bot.user)
        return;
    // Disallow Reacting for Muted Users
    db.getUser(user.id, function (usr) {
        if (usr === undefined)
            return;
        if (usr['muted'] === true)
            rct.remove(user);
    });
    var years = ['📗', '📘', '📙', '🧾'];
    var campus = ['1️⃣', '2️⃣'];
    if (years.includes(rct.emoji.name)) {
        var m_1 = rct.message.guild.member(user);
        var e_1 = rct.emoji.name;
        rct.message.reactions.forEach(function (r) { if (r.emoji.name != e_1 && r.users.array().includes(user) && !campus.includes(r.emoji.name))
            r.remove(user); });
        m_1.removeRoles([roles['📗'], roles['📘'], roles['📙'], roles['🧾']], 'Removed Conflicting Years').then(function () {
            m_1.addRole(roles[e_1], "Added " + roles[e_1].name)["catch"](function (err) { return console.error(err); });
        })["catch"](function (err) { return console.error(err); });
    }
    else if (campus.includes(rct.emoji.name)) {
        var m_2 = rct.message.guild.member(user);
        var e_2 = rct.emoji.name;
        rct.message.reactions.forEach(function (r) { if (r.emoji.name != e_2 && r.users.array().includes(user) && !years.includes(r.emoji.name))
            r.remove(user); });
        m_2.removeRoles([roles['1️⃣'], roles['2️⃣']], 'Removed Conflicting Campuses').then(function () {
            m_2.addRole(roles[e_2], "Added " + roles[e_2].name)["catch"](function (err) { return console.error(err); });
        })["catch"](function (err) { return console.error(err); });
    }
    else {
        var author = rct.message.author;
        if (author === bot.user || author === user)
            return;
        db.updateUser(author.id, author.username, undefined, undefined, undefined, 1, true);
    }
});
//#endregion
// Login Bot
bot.login('NzAyMTkwNTIxNzMyMzAwODIw.Xp82MA.b3lKG2D8nniuMFq91BTJ_kvtFMQ');
