import { BotClient, GeneralEvent } from "../../func/utils/types";

const shoukakuDisconnectEvent: GeneralEvent = {
  name: "disconnect",

  async execute(client: BotClient, name: any, count: any): Promise<void> {
    const players = [...client.kazagumo.shoukaku.players.values()].filter(p => p.node.name === name);
    players.map(player => {
      client.kazagumo.destroyPlayer(player.guildId);
      player.destroy();
    });
    console.warn(`NODE :: ${name} Disconnected!`);
  }
}

export default shoukakuDisconnectEvent;