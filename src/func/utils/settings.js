const { GatewayIntentBits, Partials } = require("discord.js");
const { Plugins } = require("kazagumo");

module.exports = {
  clientSettings: () => {
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
        parse: ["roles", "users"],
        repliedUser: false
      }
    }
  },
  
  kazagumoSettings: (client) => {
    return {
      defaultSearchEngine: "youtube",
      send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
      },
      plugins: [
        new Plugins.PlayerMoved(client)
      ]
    }
  }
}