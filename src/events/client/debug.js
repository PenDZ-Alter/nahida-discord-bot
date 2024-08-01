const { Events } = require("discord.js");

module.exports = {
  name : Events.Debug,

  async execute(client, msg) {
    if (client.config.debug === "client" || client.config.debug === "all") {
      console.log(msg);
    }
  }
}