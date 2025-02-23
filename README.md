# discord-bot
A Basic discord bot with music and AI inside of it <br>
Nahida is just my discord bot's name :) 


## Getting Started
1. Open file named `.env.example` (located in `config` directory), copy your bot token, client_id, guild_id.
    - The token, you can get from discord developer website in this [link](https://discord.com/developers/docs/intro), go to application and go to your bot get your token there.
    - The Client ID, you can get it from discord server and copy the ID from your bot.
    - The Guild ID, you can get it from discord server and copy the ID from your server ID. This is optional, if you want to make the bot can used globally, simply don't add it.
    - Don't forget to rename the file from `.env.example` to `.env` .

2. (OPTIONAL) Configure OpenAI Key
    - Copy your API Key from openai and copy to `api_key` inside file `.env` (the token, guild, and client that you set in number 1)
    - For more secure, Copy your Role ID into `ai_config` -> `role` inside file `config.json`
    - To make this AI Works, you need Channel ID into `ai_config` -> `channel` inside file `config.json`

NOTE! Make sure you have subscription/billing in OpenAI Platform. Otherwise, this will not work for you! if you want to change the model, see this documentation : <br>
https://platform.openai.com/account/rate-limits

## How it Works?
I'm using `discord.js`, `discord-player`, and `openai` packages from npm and running it using node. <br>
The token it'll needed to authenticate your bot into discord API. Also, client ID and guild ID is the identity of your bot user and server user. <br>
Actually, guild ID isn't necessary to adding it. This just make to load slash commands into directed server! But, you really need client ID


## How to run it?
1. Installing Packages <br>
    Use command 
    ```bash
    npm i
    ```
    and wait until done! <br>
    if there's something error, just ignore it :)

2. (DEPRECATED!! Please don't use this for a while) Get the auth token for youtube <br>
    **WARNING!** When getting the auth token from youtube, please don't use your main account. Because is too risky, and the biggest disaster is your account will get permanently ban. <br>
    You can see the documentation and reason about in :  <br> https://github.com/retrouser955/discord-player-youtubei/blob/master/LEGAL.md <br> <br>
    Use command 
    ```bash
    node getAuth.js
    ```
    or you can use 
    ```bash
    npx --no discord-player-youtubei
    ```

    Copy all cookies data into `.env` file, inside `YT_CREDENTIAL_USER`.

3. Run the bot :) <br>
    Use command 
    ```bash
    node .
    ```
    Done! :)

NOTE! Remember to always direct directory into bot folder before you do the step!

## Notes this branch
This branch is free from explicit content :)
If you want to try explicit content, please using `dev-main` branch.

Having problem to connect API's? <br>
Check this [link](docs/HOSTS.md), maybe help you to solve the problem :)