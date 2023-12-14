const { ActivityType, Events } = require('discord.js');

module.exports = {
  name : Events.ClientReady,
  once : true,

  async execute(client) {
    client.user.setStatus('idle');
    client.user.setActivity('and singing', { type : ActivityType.Watching });
    console.log("BOT :: The bot is ready!");
  }
}