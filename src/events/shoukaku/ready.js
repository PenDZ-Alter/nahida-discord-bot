module.exports = {
  name : "ready",

  async execute(client, name) {
    console.log(`NODE :: ${name} is ready!`);
  }
}