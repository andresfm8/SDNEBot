"use strict";
exports.__esModule = true;
// Imports
var Discord = require("discord.js");
var discord_js_1 = require("discord.js");
var db = require("./database");
// Instances
var bot = new Discord.Client();
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
    if (msg.author.id !== '140948630919053312')
        return;
    if (msg.author === bot.user)
        return;
    db.getUser(msg.author.id, function (user) {
        if (user === undefined)
            return;
        if (user['muted'] === true)
            msg["delete"]();
    });
    // Assign Roles Embed
    if (msg.content.toLowerCase().startsWith('!assigninfo') && msg.member.hasPermission(discord_js_1.Permissions.FLAGS.MANAGE_ROLES)) {
        var embed = {
            "embed": {
                "title": "Role Assignment Info",
                "description": "Click a corresponding reaction to set your year & campus and gain access to the other channels!",
                "color": 3553599,
                "timestamp": new Date(),
                "fields": [
                    {
                        "name": "📗",
                        "value": "First Years",
                        "inline": true
                    },
                    {
                        "name": "📘",
                        "value": "Second Years",
                        "inline": true
                    },
                    {
                        "name": "📙",
                        "value": "Third Years",
                        "inline": true
                    },
                    {
                        "name": "🧾",
                        "value": "Alumni",
                        "inline": true
                    },
                    {
                        "name": "1️⃣",
                        "value": "Trafalgar Campus",
                        "inline": true
                    },
                    {
                        "name": "2️⃣",
                        "value": "Davis Campus",
                        "inline": true
                    }
                ]
            }
        };
        msg["delete"]();
        msg.channel.send(embed).then(function (m) {
            m.react('📗').then(function () { m.react('📘').then(function () { m.react('📙').then(function () { m.react('🧾').then(function () { m.react('1️⃣').then(function () { m.react('2️⃣').then(function () { }); }); }); }); }); });
        });
    }
});
// Listen for Reactions
bot.on('messageReactionAdd', function (rct, user) {
    if (user === bot.user)
        return;
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
});
//#endregion
// Login Bot
bot.login('NzAyMTkwNTIxNzMyMzAwODIw.Xp82MA.b3lKG2D8nniuMFq91BTJ_kvtFMQ');
