const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { Player } = require("discord-player");
const fs = require("fs");

const client = new Client(clientSettings());

client.config = require("./config/config.json");

client.commands = new Collection();
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

// Executing handlers
client.handleCommands();
client.handleEvents();

client.login(client.config.token);

function clientSettings() {
  return {
    shards : 'auto',
    failIfNotExists : false,
    intents : [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent
    ],
    partials : [
      Partials.Message,
      Partials.Reaction,
      Partials.User
    ],
    allowedMentions : {
      parse : [ 'roles', 'users' ],
      repliedUser : false
    }
  }
}