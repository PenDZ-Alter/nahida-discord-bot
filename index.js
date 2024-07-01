const { Client, Collection } = require("discord.js");
const { Player } = require("discord-player");
const ClientSettings = require("./config/client.json");
const fs = require("fs");

const client = new Client(ClientSettings);

client.config = require("./config/config.json");

client.commands = new Collection();
client.buttons = new Collection();
client.commandsData = [];

client.player = new Player(client);

// File Listeners
const funcFold = fs.readdirSync('./src/func');
for (const folders of funcFold) {
  const funcFiles = fs.readdirSync(`./src/func/${folders}`)
    .filter((file) => file.endsWith('.js'));

  for (const files of funcFiles) {
    require(`./src/func/${folders}/${files}`)(client);
  }
}

client.login(client.config.token);
