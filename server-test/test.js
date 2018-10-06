const {TestServer, simpleWorld } = require("./lib/server");
const _ = require("lodash");
(async () => {
    const server = new TestServer();
    try {
      await server.init('server-test/test/dist/simple.js', simpleWorld);
      await server.tick(15, async (server) => {
        console.log("tick " + await server.world.gameTime)
        const { db } = server.common.storage;
        const objects = await server.world.roomObjects('W0N1');
        const creeps = _.find(objects, { type: 'creep' });
        console.log("creeps:")
        console.log(creeps);
      });
    } catch (e) {
      console.log(e)
    } finally {
      server.stop();
      process.exit(); // required as there is no way to properly shutdown storage :(
    }
})();
