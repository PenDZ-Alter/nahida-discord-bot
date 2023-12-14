const { Events } = require("discord.js");

module.exports = {
  name : Events.InteractionCreate,

  async execute(client, interaction) {
    // isCommand() is not deprecated but we recommend you to use isChatInputCommand() function
    if (!interaction.isChatInputCommand()) return; // if you're using buttons and another, delete this code
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(client, interaction);
      } catch (err) {
        console.log("Error Founded!");
        console.error(err);
      }
    }
  }
}