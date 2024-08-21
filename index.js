const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { Player } = require("discord-player");
const fs = require("fs");
require("dotenv").config({ path: "./config/.env" });

const client = new Client(clientSettings());

client.config = require("./config/config.json");

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.commandsData = [];

client.player = new Player(client);

if (client.config.debug) {
  console.log(`BOT :: Debug level = ${["player", "client", "all"].includes(client.config.debug) ? client.config.debug : "N/A"}`);
}

// File Listeners
const funcFold = fs.readdirSync('./src/func');
for (const folders of funcFold) {
  const funcFiles = fs.readdirSync(`./src/func/${folders}`)
    .filter((file) => file.endsWith('.js'));

  for (const files of funcFiles) {
    require(`./src/func/${folders}/${files}`)(client);
  }
}

client.login(process.env.TOKEN);

function clientSettings() {
  return {
    shards: "auto",
    failIfNotExists: false,
    intents: [ 
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
    ],
    partials: [
      Partials.Message,
      Partials.Reaction,
      Partials.User
    ],
    allowedMentions: {
      parse: [ "roles", "users" ],
      repliedUser: false
    }
  }
}
