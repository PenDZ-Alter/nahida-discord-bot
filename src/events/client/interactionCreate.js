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
        console.log("Error Founded!");
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
    }
  }
}