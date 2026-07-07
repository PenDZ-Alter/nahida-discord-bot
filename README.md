# Nahida Discord Bot

[![Node.js](https://img.shields.io/badge/node-18.x%2B-brightgreen)](https://nodejs.org)
[![Bun](https://img.shields.io/badge/bun-1.3%2B-pink)](https://bun.com)
[![Discord.js](https://img.shields.io/badge/discord.js-14.x%2B-blue)](https://discord.js.org)


A basic Discord bot with music and AI capabilities.

> [!NOTE]
> Since, `discord-player` and `discord-player-youtubei` have many problems, i decided to change into `lavalink`, `shoukaku`, and `kazagumo`. But don't worry, i'm still updating the `discord-player` version in dev v6.x.

## Getting Started

### 1. Configure lavalink server
You also need to configure the lavalink.

> [!TIP]
> If there's any problem in youtube plugin, try to change youtube source version on this [repo](https://github.com/lavalink-devs/youtube-source) based on release tags

> [!NOTE]
> If you want to use spotify, you need to add the client id and client secret in `application.yml`

- Go to `server` folder.
- Lavalink server needs config file named `application.yml`, rename config file named :
    ```bash
    application.yml.example -> application.yml
    ```

- Run the lavalink, use this command : 
    ```bash
    java -jar Lavalink.jar
    ```

### 2. Configure Your Environment
Before running the bot, you need to set up your environment variables.

- Open the `.env.example` file (located in the `config` directory) and add the following:
  - **Bot Token:** Obtain it from the [Discord Developer Portal](https://discord.com/developers/docs/intro). Go to "Applications," select your bot, and copy the token.
  - **Client ID:** Get it from your bot's Discord profile.
  - **Guild ID (Optional):** This is your server ID. If you want the bot to be available globally, leave it empty.
  - **Spotify Credentials:** Variable named `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` is your spotify credentials, if you want to use spotify
- Rename `.env.example` to `.env`.

### 3. (Optional) Configure OpenAI API
If you want to enable AI functionality:

- Copy your OpenAI API key and add it to `api_key` inside the `.env` file.
- For additional security, add your role ID inside `config.json` under `ai_config` -> `role`.
- Specify the Channel ID under `ai_config` -> `channel` in `config.json`.
- **Note:** You must have an active OpenAI subscription. Refer to [OpenAI Rate Limits](https://platform.openai.com/account/rate-limits) for more details.

---

## How It Works?

Nahida is built using `discord.js`, `lavalink`, `shoukaku`, `kazagumo` and `openai`.
- The **bot token** is required for authentication.
- The **client ID** identifies the bot.
- The **guild ID** (optional) ensures slash commands are registered only in a specific server.
- The **Lavalink** is required for audio nodes (as server).
- The **shoukaku** and **kazagumo** is required for music player.
---

## Installation & Setup

### 1. Install Dependencies
Run the following command to install required packages: <br>
If you are using bun, use this commands : 
```bash
bun install
```
or, if you are using node, use this commands :
```bash
npm install
```
If you encounter warnings, you can safely ignore them.

### 2. Run the bot
To start the bot, run : 
```bash
npm run def
```
or, if you're using bun, use this instead :
```bash
npm run fast
```
Ensure you are in the bot's directory before executing the command.

---

## Branch Information
> [!WARNING]
> This branch contains explicit content. Use it responsibly.

For a safer version, switch to the dev-safe branch:
```bash
git checkout dev-safe
```

---

## Troubleshooting
Having trouble connecting to APIs? Check the [HOSTS.md](docs/HOSTS.md) file for possible solutions.

Having trouble with the bot? Run the bot with the `--debug={debug_level}` flag to see what's the problem with bot. Or, you can do like this : 
```bash
bun run debug
```
---

Enjoy using Nahida! 🎵🤖