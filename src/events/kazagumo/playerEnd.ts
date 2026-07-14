import { BotClient, GeneralEvent } from "../../func/utils/types";
import { KazagumoPlayer } from "kazagumo";

const playerEndEvent: GeneralEvent = {
  name : "playerEnd",

  async execute(client: BotClient, player: KazagumoPlayer): Promise<void> {
    if (client.debug === "player" || client.debug === "all") {
      console.log("INFO (Track) :: Track end, going to next track!");
    }
  }
}

export default playerEndEvent;