import { BotClient, GeneralEvent } from "../../func/utils/types";
import { KazagumoPlayer } from "kazagumo";

const playerEmptyEvent: GeneralEvent = {
  name : "playerEmpty",

  async execute(client: BotClient, player: KazagumoPlayer): Promise<void> {
    if (client.debug === "player" || client.debug === "all") {
      console.log("INFO (Player) :: Queue is empty, player session end!");
    }
    player.destroy();
  }
}

export default playerEmptyEvent;