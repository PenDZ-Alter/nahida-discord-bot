module.exports = {
  name : "debug",

  async execute(client, name, info) {
    if (client.config.debug === "player" || client.config.debug === "all") {
      console.log(`NODE :: ${name} is in use!`);
      console.debug(`INFO (Player) :: ${info}`);
    }
  }
}