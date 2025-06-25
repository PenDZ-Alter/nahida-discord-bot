const { Client, Collection } = require("discord.js");
const { Connectors } = require("shoukaku");
const { Kazagumo } = require("kazagumo");
const fs = require("fs");

const { clientSettings, kazagumoSettings } = require("./src/func/utils/settings");
const { parseDebugArg, parseEnvArg } = require("./src/func/utils/format");
require("dotenv").config({ path: "./config/.env" });

const client = new Client(clientSettings());

// Properties of data
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();

client.commandsData = [];

const lavalink_name = process.env.LAVALINK_NAME ?? "local"
const lavalink_url = process.env.LAVALINK_URL ?? "localhost"
const lavalink_port = process.env.LAVALINK_PORT
const lavalink_pass = process.env.LAVALINK_PASS

const nodes = [
  {
    name: lavalink_name,
    url: `${lavalink_url}${lavalink_port ? `:${lavalink_port}` : ""}`,
    auth: lavalink_pass,
    ssl: false
  }
]

client.kazagumo = new Kazagumo(
  kazagumoSettings(client),
  new Connectors.DiscordJS(client),
  nodes
);

// === CLI Debug Option Handling ===
client.debug = parseDebugArg();
client.config = parseEnvArg();

if (client.debug) {
  console.log(`BOT :: Debug level = ${client.debug}`);
}

// File Listeners (For Handlers only)
runHandlers();

client.login(process.env.TOKEN);

function runHandlers() {
  const funcFold = fs.readdirSync('./src/func');
  for (const folders of funcFold) {
    const funcFiles = fs.readdirSync(`./src/func/${folders}`)
      .filter((file) => file.endsWith('.js'));

    switch (folders) {
      case "handlers":
        for (const files of funcFiles) {
          require(`./src/func/${folders}/${files}`)(client);
        }
        break;
      default:
        break;
    }
  }
}