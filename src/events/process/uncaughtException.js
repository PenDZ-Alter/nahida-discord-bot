module.exports = {
  name: "uncaughtException",

  async execute(err) {
    // Reject the promise with the error
    console.log("BOT :: Error Founded!");
    console.log("INFO :: Uncaught Exception error")
    console.error(err);
  }
}