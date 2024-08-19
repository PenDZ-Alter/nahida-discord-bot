module.exports = {
  data: { name: "unhandledRejection" },

  async execute(err) {
    // Reject the promise with the error
    console.log("BOT :: Error Founded!");
    console.log("INFO :: Unhandled promise rejection")
    console.error(err);
  }
}