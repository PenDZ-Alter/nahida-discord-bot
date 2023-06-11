const fs = require('fs');

module.exports = (client) => {
  client.handleEvents = async() => {
    const eventFold = fs.readdirSync('./src/events');
    for (const folders of eventFold) {
      const eventFiles = fs.readdirSync(`./src/events/${folders}`)
        .filter((file) => file.endsWith('.js'));
      
      for (const files of eventFiles) {
        const event = require(`../../events/${folders}/${files}`);

        switch (folders) {
          case "client" :
            if (event.once) {
              client.once(event.name, (...args) => event.execute(client, ...args));
            } else {
              client.on(event.name, (...args) => event.execute(client, ...args));
            }
            break;
          
          case "player" : 
            client.player.events.on(event.name, (...args) => event.execute(client, ...args));
            break;
          
          default : 
            console.log("INFO :: Can't read events!");
            console.log("BOT :: Error Founded!");
            break;
        }
      }
    }
  }
}