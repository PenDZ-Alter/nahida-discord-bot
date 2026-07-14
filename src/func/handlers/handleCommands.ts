import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import fs from "fs";
import { BotClient } from "../utils/types";

export default (client: BotClient): void => {
  client.handleCommands = async (): Promise<void> => {
    const commandsFold = fs.readdirSync('./src/commands');
    
    for (const folders of commandsFold) {
      // Biar aman pas masa transisi, filter file .js DAN .ts sekaligus!
      const commandsFiles = fs.readdirSync(`./src/commands/${folders}`)
        .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));
        
      for (const files of commandsFiles) {
        const command = require(`../../commands/${folders}/${files}`);

        // Pastikan format command data ada sebelum dimasukkan ke Collection
        if (command && command.data) {
          client.commands.set(command.data.name, command);
          client.commandsData.push(command.data.toJSON());
          console.log(`BOT :: Registered command '${command.data.name}'`);
        }
      }
    }

    const client_id = process.env.CLIENT_ID || "";
    const guild_id = process.env.GUILD_ID;
    const token = process.env.TOKEN || "";

    const rest = new REST({ version: "10" }).setToken(token);

    try {
      if (!guild_id) {
        // Global Server
        await rest.put(Routes.applicationCommands(client_id), {
          body: client.commandsData
        });
      } else {
        // Directed Server (Spesifik Guild)
        await rest.put(Routes.applicationGuildCommands(client_id, guild_id), {
          body: client.commandsData
        });
      }
      
      console.log("BOT :: Reloaded Slash Commands Application!");
    } catch (err) {
      console.log("BOT :: Error Founded!");
      console.error(err);
    }
  };

  // Langsung jalankan fungsinya
  client.handleCommands();
};