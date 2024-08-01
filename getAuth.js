const { generateOauthTokens } = require("discord-player-youtubei");

(async() => {
  console.log("WARNING!");
  console.log("DON'T USE YOUR MAIN ACCOUNT. THIS AUTH IS ACTUALLY ILLEGAL FROM YOUTUBE, CAUSING YOU'LL GET PERMANENTLY BANNED\n");

  await generateOauthTokens();
})().then(() => {
  console.log("\nPut the access_token, refresh_token, and expiry_date into .env");
})