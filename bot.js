"use strict";
exports.__esModule = true;
// Imports
var Discord = require("discord.js");
var db = require("./database");
// Instances
var bot = new Discord.Client();
bot.on('ready', function () {
    console.log("Logged in as " + bot.user.tag);
});
//#region Event Listeners
// Listen for Messages
bot.on('message', function (msg) {
    db.getUser(msg.author.id, function (res) {
        console.log(res);
    });
});
//#endregion
// Login Bot
bot.login('NzAyMTkwNTIxNzMyMzAwODIw.Xp82MA.b3lKG2D8nniuMFq91BTJ_kvtFMQ');
