const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const fs = require('fs');

module.exports = (client) => {
  client.handleCommands = async() => {
    const commandsFold = fs.readdirSync('./src/commands');
    for (const folders of commandsFold) {
      const commandsFiles = fs.readdirSync(`./src/commands/${folders}`)
        .filter((file) => file.endsWith('.js'));
        
      for (const files of commandsFiles) {
        const command = require(`../../commands/${folders}/${files}`);

        client.commands.set(command.data.name, command);
        client.commandsData.push(command.data.toJSON());
        console.log(`BOT :: Registered command '${command.data.name}'`);
      }
    }

    const client_id = client.config.ids.client;
    const guild_id = client.config.ids.guild;
    const rest = new REST({ version : 10 }).setToken(client.config.token);
    try {
      await rest.put(Routes.applicationGuildCommands(client_id, guild_id), {
        body : client.commandsData
      });

      console.log("BOT :: Reloaded Slash Commands Application!");
    } catch (err) {
      console.log("BOT :: Error Founded!");
      console.error(err);
    }
  }
}
