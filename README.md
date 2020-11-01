# SDNE Bot

By Jacob Brasil

## What's it do?

The **SDNE Bot** or **Syndey** is a Discord Bot built for the **Software Design & Network Engineering** program's Discord Server. The Bot allows users to set their roles such as year & campus as well as interact with the bot to provide functionality not available in a *vanilla* Discord server.

## What's New

- Updated to Discord.js v12
- Reaction based interaction system
- Commands available based on permissions instead of role
- Uses database to save user info and get configurations
- React to a message with 📌 to save it
- Bot automatically welcomes new users once they assign a role for the first time
- Automatic Kick/Ban System based off warnings


## How to Install & Test the Bot
### Prerequisites
1. Install the latest version of node and include npm when installing - https://nodejs.org/en/
2. Install Typescript
   1. `> npm install -g typescript`
   2. `> npx tsc`
3. Install sqlite - https://www.servermania.com/kb/articles/install-sqlite/
4. Clone/Fork Github repo and make the appropriate changes
   1. Under the root directory, create an empty `database.db` file
5. Create test Discord server if you don't already have one
   1. Create a new application under the [Discord developers portal](https://discordapp.com/developers/applications/)
   2. Add a new application
   3. Open the **Bot** tab and make a new bot
   4. Turn off the public bot option (so then only you can invite the bot)
   5. Invite your bot to the new server
      1. In the **General Information** tab, copy your **Client ID**
      2. Replace `<CLIENT_ID>` in the following URL with your **Client ID** above and navigate to the URL
      `https://discordapp.com/api/oauth2/authorize?client_id=<CLIENT_ID_HERE>&permissions=8&scope=bot`
      1. Invite your bot to the testing server made in step 4.1
   6. Under `Server Settings > Roles`, add the roles that can be found in `env.example.ts`

### Setting up the Bot
1. Duplicate the `env.example.ts` to `env.ts`
2. Edit `env.ts`
   1. Add your **Bot Token** from the developers portal to **botToken** value
   2. After the roles are added to your server, make sure to copy the id and then pase to the respective role entry under `env.ts`
3. Once ready, run the following command and you're ready! `> npm start`

Install steps adapted from the following locations
- https://pythondiscord.com/pages/contributing/setting-test-server-and-bot-account/
- https://www.devdungeon.com/content/javascript-discord-bot-tutorial