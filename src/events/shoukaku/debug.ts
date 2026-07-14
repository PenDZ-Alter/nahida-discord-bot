import { BotClient, GeneralEvent } from "../../func/utils/types";

const shoukakuDebugEvent: GeneralEvent = {
  name : "debug",

  async execute(client: BotClient, name: any, info: any): Promise<void> {
    if (client.debug === "player" || client.debug === "all") {
      console.log(`NODE :: ${name} is in use!`);
      console.debug(`INFO (Player) :: ${info}`);
    }
  }
}

export default shoukakuDebugEvent;