const { generateOauthTokens } = require("discord-player-youtubei");

(async() => {
  console.log("WARNING!");
  console.log("DON'T USE YOUR MAIN ACCOUNT. THIS AUTH IS ACTUALLY ILLEGAL FROM YOUTUBE, CAUSING YOU'LL GET PERMANENTLY BANNED\n");

  await generateOauthTokens();
})().then(() => {
  console.log("\nPut the access_token and refresh_token into .env");
  console.log("And, put the expiry_date into config.json named yt_exp");
})