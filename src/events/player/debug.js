module.exports = {
  name : 'debug',

  async execute(client, queue, msg) {
    if (client.config.debug === "player" || client.config.debug === "all") {
      console.log(msg);
    }
  }
}