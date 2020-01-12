const Discord = require('discord.js');
const fs = require('file-system');
const bot = new Discord.Client();

var botData = JSON.parse(fs.readFileSync(__dirname + '/bot_data.json'));

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  bot.user.setActivity("!help commands", { type: "LISTENING" });
});

bot.on('message', msg => {
  if (msg.content.startsWith("!year ")) { // Assign Year
    if (msg.channel.id === "619603429379014667") {
      let txt = msg.content.split(" ");
      let year = txt[1];
      const usr = msg.member;
      if (year === "1") {
        usr.addRole("619581998574469120"); // 1st Year
        usr.removeRole("619582112936362020"); // 2nd Year
        usr.removeRole("619582159899852802") // 3rd Year
        usr.removeRole("619582173522952233") //Alumni
        usr.removeRole("663060867490775071") // Remove Unassigned
        msg.reply('you are now in the role associated with your year!');
      } else if (year === "2") {
        usr.removeRole("619581998574469120"); // 1st Year
        usr.addRole("619582112936362020"); // 2nd Year
        usr.removeRole("619582159899852802") // 3rd Year
        usr.removeRole("619582173522952233") //Alumni
        usr.removeRole("663060867490775071") // Remove Unassigned
        msg.reply('you are now in the role associated with your year!');
      } else if (year === "3") {
        usr.removeRole("619581998574469120"); // 1st Year
        usr.removeRole("619582112936362020"); // 2nd Year
        usr.addRole("619582159899852802") // 3rd Year
        usr.removeRole("619582173522952233") //Alumni
        usr.removeRole("663060867490775071") // Remove Unassigned
        msg.reply('you are now in the role associated with your year!');
      } else if (year === "4") {
        usr.removeRole("619581998574469120"); // 1st Year
        usr.removeRole("619582112936362020"); // 2nd Year
        usr.removeRole("619582159899852802") // 3rd Year
        usr.addRole("619582173522952233") //Alumni
        usr.removeRole("663060867490775071") // Remove Unassigned
        msg.reply('you are now in the role associated with your year!');
      } else {
        msg.reply("that's not a valid year, try between 1-4!");
      }
    } else {
      msg.reply("You must do that in <#619603429379014667>");
    }
  } else if (msg.content.startsWith("!campus ")) { // Assign Campus
    if (msg.channel.id === "619603429379014667") {
      let txt = msg.content.split(" ");
      let campus = txt[1];
      let usr = msg.member;
      if (campus.toLowerCase() === "trafalgar") {
        usr.addRole("620641262101463070"); // Trafalgar
        usr.removeRole("620641321908043798"); // Davis
        msg.reply("welcome to Trafalgar!");
      } else if (campus.toLowerCase() === "davis") {
        usr.removeRole("620641262101463070"); // Trafalgar
        usr.addRole("620641321908043798"); // Davis
        msg.reply("welcome to Davis!");
      } else {
        msg.reply("that is an invalid campus. <:catSad:619611587577249853>");
      }
    } else {
      msg.reply("You must do that in <#619603429379014667>");
    }
  } else if (msg.content === "!help") { // View Commands
    msg.delete();
    msg.channel.send({
      embed: {
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
          name: "Assign Campus",
          value: "```!campus <campus name>```"
        },
        {
          name: "View Help Menu",
          value: "```!help```"
        },
        {
          name: "View Rules",
          value: "```!rules```"
        },
        {
          name: "View Karma",
          value: "```!karma\n!karma @username```"
        },
        {
          name: "Toggle Karma",
          value: "```!karmaToggle```"
        }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: "Sydney"
        }
      }
    });
  } else if (msg.content === "!rules") { // View Rules
    const embeds = [
      {
        title: "Rule 1 - Keep it friendly and respectful. ",
        description: "We're all mature here, please do not be disrespectful towards any users (no hateful nicknames!). Harassment or encouragement of harassment of any kind is not tolerated, including sexual harassment.",
        color: 13632027
      },
      {
        title: "Rule 2 - Keep chats safe for work",
        description: "Please do not post any NSFW pictures or links in any of the channels, a lot of us use Discord on our phone or on our computers when in class so keep that in mind.",
        color: 2818297
      },
      {
        title: "Rule 3 - No spamming or trolling",
        description: "Spamming is **not** allowed on this server. No excessive trolling is allowed on this server, do **not** deliberately make others uncomfortable or deliberately derail a conversation. \n Do not post any malicious links.",
        color: 1571072
      },
      {
        title: "Rule 4 - Use the appropriate channels",
        description: "We have multiple channels, so please make sure your discussion aligns with the channel you are in.",
        color: 12390624
      },
      {
        title: "Rule 5 - Enforcing Academic Integrity",
        description: "Please do not ask for any help on assignments you have for your classes. Academic integrity is taken very seriously at Sheridan and as students in the SDNE program, we all must follow these rules.",
        color: 16776969
      },
      {
        title: "Information",
        description: "To access all channels, you must assign which year you are in from 1-4 in the SDNE program. 4 represents Alumni. \n```!year <your year>``` in the <#619603429379014667> channel. \n \nEach year gets their own category where members of that year can add channels for whatever they would like to discuss.\nYou can also assign your campus with ```!campus <campus-name>```so you can find others on your campus!",
        color: 10197915
      }
    ]

    if (msg.channel.id == "619585833636200449") {
      msg.delete();
      embeds.forEach(function (i) {
        msg.channel.send({ embed: i });
      });
    }
    else {
      msg.reply("check your DMs!");
      embeds.forEach(function (i) {
        msg.author.send({ embed: i });
      });
    }

  } else if (!msg.content.startsWith("!year ") && !msg.content.startsWith("!campus ") &&
    msg.channel.id == "619603429379014667" && msg.author.id != "619590949303091211") { // Delete Messages in incorrect channel

    msg.delete();
    msg.reply("this channel is for assigning your year and campus only with `!year #` & `!campus Campus`").then(msg => {
      setTimeout(() => {
        msg.delete();
      }, 5000);
    });
  } else if (msg.content === "!invite" && msg.member.highestRole.id == "619581765345869844") { // Generates Invite from Bot
    msg.guild.channels.get("id", "619585833636200449").createInvite({
      maxAge: 0,
      unique: false,
      temporary: false,
      maxUses: 0
    }, "New Invite Created by Bot").then(function (invite) {
      msg.reply("a new Invite Link has been generated, " + invite.url);
    });
  } else if (msg.content.startsWith("!warn ") && msg.member.highestRole.id == "619581765345869844") { // Warn User
    let mentioned = msg.mentions.users.first();
    msg.delete();
    msg.channel.send("<@" + mentioned.id + ">, you have been warned, please refer to <#619585833636200449> for the rules");
  } else if (msg.content === "!reassign" && msg.member.highestRole.id == "619581765345869844") {
    let members = [];
    members = msg.channel.members;
    members.forEach(function (e, i) {
      if (e.highestRole.id == "619560877405896714") {
        addRole("663060867490775071", "Default Unassigned Role");
      }
    });
    msg.delete();
    msg.reply("it is done").then(() => {
      setTimeout(() => {
        msg.delete();
      }, 5000);
    })
  } else if (msg.content === "!uptime" && msg.member.highestRole.id == "619581765345869844") {
    let time = process.uptime();
    let uptime = (time + "").toHHMMSS();
    msg.channel.send("I've been awake for `" + uptime + "` now!").then((m) => {
      var updateMS = Math.round(Math.random() * (30000 - 5000)) + 5000;;
      setInterval(() => {
        time = process.uptime();
        uptime = (time + "").toHHMMSS();
        m.edit("I've been awake for `" + uptime + "` now!");
      }, updateMS);
    });
  } else if (msg.content.startsWith("!edits ") && msg.member.highestRole.id == "619581765345869844") {
    let txt = msg.content.split(" ");
    let msgID = txt[1];
    let fields = [];
    msg.channel.fetchMessage(msgID).then(edited => {
      edited.edits.forEach((m, i) => {
        if (i == 0) {
          fields.push(
            {
              "name": `Latest`,
              "value": `\`\`\`${m.content}\`\`\``
            }
          );
        } else {
          fields.push(
            {
              "name": `Version ${edited.edits.length - i}`,
              "value": `\`\`\`${m.content}\`\`\``
            }
          );
        }
      });

      msg.channel.send({
        "embed": {
          "title": "Previous Versions",
          "color": 15684432,
          "footer": {
            "icon_url": "https://cdn.discordapp.com/app-icons/619590949303091211/e9f2a8fadac81f5334a01f641fc6e504.png",
            "text": "SDNE Bot"
          },
          "fields": fields
        }
      });
    });
  } else if (msg.content.startsWith("!karmaToggle ") && msg.member.highestRole.id == "619581765345869844") {
    let mention = msg.mentions.users.first();

    let found = false;
    let setTo;
    botData.forEach((e, i) => {
      if (e.id === mention.id) {
        found = true;
        e.karmaToggle = !e.karmaToggle;
        setTo = e.karmaToggle;
      }
    })

    if (found == false) {
      botData.push({
        "id": mention.id,
        "name": mention.username,
        "karma": 0,
        "karmaToggle": false
      })
      setTo = false;
    }

    msg.channel.send({
      "embed": {
        "title": `${mention.username}'s Karma Info`,
        "color": 9224077,
        "footer": {
          "icon_url": `${mention.avatarURL}`,
          "text": `${mention.username}`
        },
        "fields": [
          {
            "name": "Karma Toggle",
            "value": `\`\`\`KarmaToggle: ${setTo}\`\`\``
          }
        ]
      }
    })

    fs.writeFileSync('bot_data.json', JSON.stringify(botData))
  } else if (msg.content === "!karmaToggle") {
    let found = false;
    let setTo;
    botData.forEach((e, i) => {
      if (e.id === msg.author.id) {
        found = true;
        e.karmaToggle = !e.karmaToggle;
        setTo = e.karmaToggle;
      }
    })

    if (found == false) {
      botData.push({
        "id": msg.author.id,
        "name": msg.author.username,
        "karma": 0,
        "karmaToggle": false
      })
      setTo = false;
    }

    msg.channel.send({
      "embed": {
        "title": `${msg.author.username}'s Karma Info`,
        "color": 9224077,
        "footer": {
          "icon_url": `${msg.author.avatarURL}`,
          "text": `${msg.author.username}`
        },
        "fields": [
          {
            "name": "Karma Toggle",
            "value": `\`\`\`KarmaToggle: ${setTo}\`\`\``
          }
        ]
      }
    })

    fs.writeFileSync('bot_data.json', JSON.stringify(botData))
  } else if (msg.content.startsWith("!karma ")) {
    let mention = msg.mentions.users.first();

    let found = false;
    let setTo;
    let karmaLvl;
    botData.forEach((e, i) => {
      if (e.id === mention.id) {
        found = true;
        karmaLvl = e.karma;
        setTo = e.karmaToggle;
      }
    })

    if (found == false) {
      botData.push({
        "id": mention.id,
        "name": mention.username,
        "karma": 0,
        "karmaToggle": true
      })
      karmaLvl = 0;
      setTo = true;
    }

    msg.channel.send({
      "embed": {
        "title": `${mention.username}'s Karma Info`,
        "color": 9224077,
        "footer": {
          "icon_url": `${mention.avatarURL}`,
          "text": `${mention.username}`
        },
        "fields": [
          {
            "name": "Karma Level",
            "value": `\`\`\`Karma: ${karmaLvl}\`\`\``
          },
          {
            "name": "Karma Toggle",
            "value": `\`\`\`KarmaToggle: ${setTo}\`\`\``
          }
        ]
      }
    })

    fs.writeFileSync('bot_data.json', JSON.stringify(botData))
  } else if (msg.content === "!karma") {
    let found = false;

    let setTo;
    let karmaLvl;
    botData.forEach((e, i) => {
      if (e.id === msg.author.id) {
        found = true;
        karmaLvl = e.karma;
        setTo = e.karmaToggle;
      }
    })

    if (found == false) {
      botData.push({
        "id": msg.author.id,
        "name": msg.author.username,
        "karma": 0,
        "karmaToggle": true
      })
      karmaLvl = 0;
      setTo = true;
    }

    msg.channel.send({
      "embed": {
        "title": `${msg.author.username}'s Karma Info`,
        "color": 9224077,
        "footer": {
          "icon_url": `${msg.author.avatarURL}`,
          "text": `${msg.author.username}`
        },
        "fields": [
          {
            "name": "Karma Level",
            "value": `\`\`\`Karma: ${karmaLvl}\`\`\``
          },
          {
            "name": "Karma Toggle",
            "value": `\`\`\`KarmaToggle: ${setTo}\`\`\``
          }
        ]
      }
    })

    fs.writeFileSync('bot_data.json', JSON.stringify(botData))
  } else if (msg.content.startsWith("!")) { // If user tries a commond that doesn't exist
    msg.reply("invaild command, use `!help` for a list of commands");
  } else if ((msg.channel.id === "619592144390455303" || msg.channel.id === "619584468927250440") && msg.author.id !== "619590949303091211") {
    let karmaToggle;

    let found = false;
    botData.forEach((e, i) => {
      if (e.id === msg.author.id) {
        found = true;
        karmaToggle = e.karmaToggle;
      }
    })

    if (found == false) {
      botData.push({
        "id": msg.author.id,
        "name": msg.author.username,
        "karma": 0,
        "karmaToggle": true
      })
      karmaToggle = true;
    }

    if (!karmaToggle)
      return;

    msg.react("👍").then(() => msg.react("👎")).then(() => {

      const filter = (reaction, user) => {
        return (reaction.emoji.name === '👍' || reaction.emoji.name === '👎') && user.id !== "619590949303091211";
      };

      const collector = msg.createReactionCollector(filter, { time: 300000 });

      collector.on('collect', (reaction, reactionCollector) => {

      });

      collector.on('end', collected => {
        collected.forEach(reaction => {
          if (reaction.emoji.name === "👍") {
            let found = false;
            botData.forEach((e, i) => {
              if (e.id === msg.author.id) {
                found = true;
                e.karma += 5;
              }
            })

            if (found == false) {
              botData.push({
                "id": msg.author.id,
                "name": msg.author.username,
                "karma": 5,
                "karmaToggle": true
              })
            }

          } else {
            let found = false;
            botData.forEach((e, i) => {
              if (e.id === msg.author.id) {
                found = true;
                e.karma -= 2.5;
              }
            })

            if (found == false) {
              botData.push({
                "id": msg.author.id,
                "name": msg.author.username,
                "karma": -2.5,
                "karmaToggle": true
              })
            }
          }
        });
        fs.writeFileSync('bot_data.json', JSON.stringify(botData))
      })

    })
  }
});

String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  var time = hours + ' hrs, ' + minutes + ' mins & ' + seconds + ' seconds';
  return time;
}

async function addRole(member, roleID, reason) {
  await member.addRole(roleID, reason).catch(console.error);
}

bot.on('guildMemberAdd', member => {
  const e =
  {
    title: "Information",
    description: "To access all channels, you must assign which year you are in from 1-4 in the SDNE program. 4 represents Alumni. \n```!year <your year>``` in the #assign-year channel. \n \nEach year gets their own category where members of that year can add channels for whatever they would like to discuss.\nYou can also assign your campus with ```!campus <campus-name>```so you can find others on your campus!",
    color: 10197915
  }

  member.send("Welcome to the SDNE Discord Server!");
  member.send({ embed: e });
  member.addRole("663060867490775071", "Default Unassigned Role");

});

bot.login('NjE5NTkwOTQ5MzAzMDkxMjEx.XXKdeQ.bLymm-XWu37fp5GYFZq5HUjugUE');