module.exports = {
  name : "debug",

  async execute(client, name, info) {
    if (client.debug === "player" || client.debug === "all") {
      console.log(`NODE :: ${name} is in use!`);
      console.debug(`INFO (Player) :: ${info}`);
    }
  }
}