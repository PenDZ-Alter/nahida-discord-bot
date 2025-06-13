# Nahida Discord Bot
A basic Discord bot with music and AI capabilities.

> [!NOTE]
> Since, `discord-player` and `discord-player-youtubei` have many problems, i decided to change into `lavalink`, `shoukaku`, and `kazagumo`. But don't worry, i'm still updating the `discord-player` version in dev v6.x.

## Getting Started

### 1. Configure lavalink
You also need to configure the lavalink.

- Go to `server` folder.
- Copy the `application.yml.default.example` and rename it into `application.yml`.
  - if you want to make youtube support, copy the `application.yml.example` and rename it into `application.yml`.
  - You can also configure the server, such as password, url, and port as you want.
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
  - **Lavalink Credentials:** This is your lavalink credentials and it's important to fill it
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
Run the following command to install required packages:
```bash
npm install
```
If you encounter warnings, you can safely ignore them.

### 2. Run the bot
To start the bot, run : 
```bash
node .
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

---

Enjoy using Nahida! 🎵🤖