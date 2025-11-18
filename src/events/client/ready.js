const { ActivityType, Events } = require('discord.js');

module.exports = {
  name : Events.ClientReady,
  once : false,

  async execute(client) {
    const activityType = client.config.events.ready.activity;
    const activity = client.config.events.ready.activityText;
    const status = client.config.events.ready.status;

    client.user.setStatus(status);
    client.user.setActivity(activity, { type : ActivityType[activityType] });
    console.log("BOT :: The bot is ready!");
  }
}