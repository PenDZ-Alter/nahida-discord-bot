import { BotClient, GeneralEvent } from "../../func/utils/types";

const shoukakuCloseEvent: GeneralEvent = {
  name: "close",

  async execute(client: BotClient, name: any, code: any, reason: any): Promise<void> {
    if (client.debug === "player" || client.debug === "all") {
      console.warn(`NODE :: ${name} closed!`);
      console.warn(`NODE :: Reason ${reason || 'No reason'}`);
      console.error(`ERR :: Error Code ${code || 0}`);
    }
  }
}

export default shoukakuCloseEvent;