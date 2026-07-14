import { GeneralEvent } from "../../func/utils/types";

const unhandledRejectionEvent: GeneralEvent = {
  name: "unhandledRejection",

  async execute(err: any): Promise<void> {
    // Reject the promise with the error
    console.log("BOT :: Error Founded!");
    console.log("INFO :: Unhandled promise rejection")
    console.error(err);
  }
}

export default unhandledRejectionEvent;