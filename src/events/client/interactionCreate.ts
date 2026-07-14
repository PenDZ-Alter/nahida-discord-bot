import { Events, Interaction } from "discord.js";
import { BotClient, BotEvent } from "../../func/utils/types";

const interactionCreateEvent: BotEvent = {
  name : Events.InteractionCreate,
  once: false,

  async execute(client: BotClient, interaction: Interaction): Promise<void> {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(client, interaction);
      } catch (err) {
        console.log("INFO :: Error Founded!");
        if (client.debug === "client" || client.debug === "player" || client.debug === "all")
          console.error(err);
      }
    } else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) console.warn("INFO :: There's no action to this button!");

      try {
        await button.execute(client, interaction);
      } catch (err) {
        console.error(err);
      }
    } else if (interaction.isStringSelectMenu()) {
      const selection = client.selectMenus.get(interaction.customId);
      if (!selection) console.warn("INFO :: There's no action to this selection!");

      try {
        await selection.execute(client, interaction);
      } catch (err) {
        console.error(err);
      }
    }
  }
}