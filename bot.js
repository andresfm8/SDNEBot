"use strict";
exports.__esModule = true;
// Imports
var Discord = require("discord.js");
var discord_js_1 = require("discord.js");
var db = require("./database");
// Instances
var bot = new Discord.Client();
bot.on('ready', function () {
    console.log("Logged in as " + bot.user.tag);
});
//#region Event Listeners
// Listen for Messages
bot.on('message', function (msg) {
    if (msg.author.id === bot.user.id)
        return;
    db.getUser(msg.author.id, function (user) {
        if (user['muted'] === true)
            msg["delete"]();
    });
    if (msg.content.toLowerCase().startsWith('!assigninfo') && msg.member.hasPermission(discord_js_1.Permissions.FLAGS.MANAGE_ROLES)) {
        var embed = {
            "embed": {
                "title": "Role Assignment Info",
                "description": "Click a corresponding reaction to set your year & campus and gain access to the other channels!",
                "color": 3553599,
                "timestamp": Date.now().toLocaleString('YYYY-MM-DDTHH:MM:SS.MSSZ'),
                "footer": {
                    "icon_url": bot.user.avatarURL,
                    "text": "Sydney Bot"
                },
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
        msg.channel.send(embed);
    }
});
//#endregion
// Login Bot
bot.login('NzAyMTkwNTIxNzMyMzAwODIw.Xp82MA.b3lKG2D8nniuMFq91BTJ_kvtFMQ');
