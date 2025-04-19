const { Events } = require("discord.js");

module.exports = {
  name : Events.InteractionCreate,

  async execute(client, interaction) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(client, interaction);
      } catch (err) {
        console.log("INFO :: Error Founded!");
        if (client.config.debug === "client" || client.config.debug === "player" || client.config.debug === "all")
          console.error(err);
      }
    } else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) return new Error("There's no action to this button!");

      try {
        await button.execute(client, interaction);
      } catch (err) {
        console.error(err);
      }
    } else if (interaction.isStringSelectMenu()) {
      const selection = client.selectMenus.get(interaction.customId);
      if (!selection) return new Error("ERR (Clients) :: There's no action to this selection!");

      try {
        await selection.execute(client, interaction);
      } catch (err) {
        console.error(err);
      }
    }
  }
}