const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { Connectors } = require("shoukaku");
const { Kazagumo } = require("kazagumo");
const fs = require("fs");
require("dotenv").config({ path: "./config/.env" });

const client = new Client(clientSettings());

client.config = require("./config/config.json");

// Properties of data
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();

client.commandsData = [];

const lavalink_name = process.env.LAVALINK_NAME ?? "local"
const lavalink_url = process.env.LAVALINK_URL ?? "localhost"
const lavalink_port = process.env.LAVALINK_PORT ?? 2333
const lavalink_pass = process.env.LAVALINK_PASS

const nodes = [
  {
    name: lavalink_name,
    url: `${lavalink_url}:${lavalink_port}`,
    auth: lavalink_pass,
  }
]

client.kazagumo = new Kazagumo(
  kazagumoSettings(),
  new Connectors.DiscordJS(client),
  nodes
);

if (client.config.debug) {
  console.log(`BOT :: Debug level = ${["player", "client", "all"].includes(client.config.debug) ? client.config.debug : "N/A"}`);
}

// File Listeners (For Handlers only)
const funcFold = fs.readdirSync('./src/func');
for (const folders of funcFold) {
  const funcFiles = fs.readdirSync(`./src/func/${folders}`)
    .filter((file) => file.endsWith('.js'));

  switch (folders) {
    case "handlers" :
      for (const files of funcFiles) {
        require(`./src/func/${folders}/${files}`)(client);
      }
      break;
    default : 
      break;
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

function kazagumoSettings() {
  return {
    defaultSearchEngine: "youtube",
    send: (guildId, payload) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(payload);
    }
  }
}