const {TestServer, simpleWorld } = require("./lib/server");
const _ = require("lodash");
(async () => {
    const server = new TestServer();
    try {
      await server.loadMainCode('server-test/just-testing.js');
      await server.init(simpleWorld);
      await server.run(15, async (world, bot) => {
        console.log("tick " + await world.gameTime)
        //console.log(await bot.memory)
      });
    } catch (e) {
      console.log(e)
    } finally {
      server.stop();
      process.exit(); // required as there is no way to properly shutdown storage :(
    }
})();
