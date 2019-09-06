const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity("!plsHelp");
});

bot.on('message', msg => {
    if (msg.content.startsWith("!year ")) {
        let txt = msg.content.split(" ");
        let year = txt[1];
        let usr = msg.member;
        if (year === "1") {
            usr.addRole("619581998574469120"); // 1st Year
            usr.removeRole("619582112936362020"); // 2nd Year
            usr.removeRole("619582159899852802") // 3rd Year
            usr.removeRole("619582173522952233") //Alumni
            msg.reply('you are now in the role associated with your year!');
        } else if (year === "2") {
            usr.removeRole("619581998574469120"); // 1st Year
            usr.addRole("619582112936362020"); // 2nd Year
            usr.removeRole("619582159899852802") // 3rd Year
            usr.removeRole("619582173522952233") //Alumni
            msg.reply('you are now in the role associated with your year!');
        } else if (year === "3") {
            usr.removeRole("619581998574469120"); // 1st Year
            usr.removeRole("619582112936362020"); // 2nd Year
            usr.addRole("619582159899852802") // 3rd Year
            usr.removeRole("619582173522952233") //Alumni
            msg.reply('you are now in the role associated with your year!');
        } else if (year === "4") {
            usr.removeRole("619581998574469120"); // 1st Year
            usr.removeRole("619582112936362020"); // 2nd Year
            usr.removeRole("619582159899852802") // 3rd Year
            usr.addRole("619582173522952233") //Alumni
            msg.reply('you are now in the role associated with your year!');
        }else {
            msg.reply("that's not a vaild year, try between 1-4!");
        }
    } else if (msg.content === "!plsHelp") {
        msg.delete();
        msg.channel.send({embed: {
            color: 4886754,
            author: {
              name: bot.user.username,
              icon_url: bot.user.avatarURL
            },
            title: "Help Menu",
            description: "See what Sydney can do for you",
            fields: [{
                name: "Assign Year Roles",
                value: "```!year <year>\nUse \"4\" if you are Alumni```"
              },
              {
                name: "View Help Menu",
                value: "```!plsHelp```"
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: "Sydney"
            }
          }
        });
    }
});

bot.login('NjE5NTkwOTQ5MzAzMDkxMjEx.XXKdeQ.bLymm-XWu37fp5GYFZq5HUjugUE');