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

// === CLI Debug Option Handling ===
client.debug = parseDebugArg();
client.config = parseEnvArg();

const nodes = client.config.nodes;

client.kazagumo = new Kazagumo(
  kazagumoSettings(client),
  new Connectors.DiscordJS(client),
  nodes
);

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