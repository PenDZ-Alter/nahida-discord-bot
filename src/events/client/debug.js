const { Events } = require("discord.js");

module.exports = {
  name : Events.Debug,

  async execute(client, msg) {
    if (client.debug === "client" || client.debug === "all") {
      console.log(`INFO (Client) :: ${msg}`);
    }
  }
}