module.exports = {
  name: "close",

  async execute(client, name, code, reason) {
    if (client.config.debug === "player" || client.config.debug === "all") {
      console.warn(`NODE :: ${name} closed!`);
      console.warn(`NODE :: Reason ${reason || 'No reason'}`);
      console.error(`ERR :: Error Code ${code || 0}`);
    }
  }
}