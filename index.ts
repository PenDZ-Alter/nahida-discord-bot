import { Client, Collection } from "discord.js";
import { Connectors } from "shoukaku";
import { Kazagumo } from "kazagumo";
import fs from "fs";
import dotenv from "dotenv";

import { clientSettings, kazagumoSettings } from "./src/func/utils/settings";
import { parseDebugArg, parseConfigArg } from "./src/func/utils/format";

import { BotClient } from "./src/func/utils/type";

dotenv.config({ path: "./config/.env" });

const client = new Client(clientSettings()) as BotClient;

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.commandsData = [];

client.debug = parseDebugArg();
client.config = parseConfigArg();

const nodes = client.config.nodes;

client.kazagumo = new Kazagumo(
  kazagumoSettings(client),
  new Connectors.DiscordJS(client),
  nodes
);

if (client.debug) {
  console.log(`BOT :: Debug level = ${client.debug}`);
}

runHandlers(client);

client.login(process.env.TOKEN);

function runHandlers(botClient: BotClient) {
  const funcFold = fs.readdirSync("./src/func");

  for (const folders of funcFold) {
    if (folders !== "handlers") {
      continue;
    }

    const funcFiles = fs
      .readdirSync(`./src/func/${folders}`)
      .filter((file) => file.endsWith(".ts"));

    for (const fileName of funcFiles) {
      const handler = require(`./src/func/${folders}/${fileName}`);

      if (typeof handler === "function") {
        handler(botClient);
      }
    }
  }
}