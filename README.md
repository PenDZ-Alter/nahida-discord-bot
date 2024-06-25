# discord-bot
Basic discord bot with music and AI inside of it <br>
Nahida is just my discord bot's name :) 


## Getting Started

1. Open file named `config.json`, copy your token, client_id, guild_id.

  - The token, you can get from discord developer website in this link `https://discord.com/developers/docs/intro`, go to application and go to your bot get your token there.
  - The Client ID, you can get it from discord server and copy ID of your bot.
  - The Guild ID, you can get it from discord server and copy ID your server ID.

2. (OPTIONAL) Configure OpenAI Key

   - Copy your API Key from openai and copy to `api_key` inside file `config.json`
   - For more secure, Copy your Role ID into `ai_config` -> `role` inside file `config.json`
   - To make this AI Works, you need Channel ID into `ai_config` -> `channel` inside file `config.json`

NOTE! Make sure you have subscription in OpenAI Platform. Otherwise, this will not be work for you!

## How it Works?
I'm using `discord.js`, `discord-player`, and `openai` packages from npm and running it using node. <br>
The token it'll needed to authenticate your bot into discord API. Also client ID and guild ID is the identity of your bot user and server user. <br>
Actually, guild ID isn't necessary to adding it. This just make to load slash commands into directed server! But, you really need client ID


## How to run it?
STEP 1 : Installing Packages <br>
    Use command `npm i` and wait until done!

STEP 2 : Run it :) <br>
    Use command `node .` and Done! :)

NOTE! Remember to always direct directory into bot folder before you do the step!

## Notes about the AI from OpenAI Platform
You can changes the model from his official website
https://platform.openai.com/account/rate-limits
