const TestServer = require('./server').TestServer;



async function suite(description, filename, cb) {
  const server = new TestServer();
  try {
    await server.loadTestCode(filename);

    const test = async (testName, build, run) => {
      console.log("run test")
      await server.init();
      console.log("init")
      await build(server.server.world)
      console.log("buildt")
      await run(server.server.world, server.bot, server.run.bind(server))
      console.log("done")
    }

    await cb(test);
  } catch (e) {
    console.log(e)
  } finally {
    server.stop();
    process.exit(); // required as there is no way to properly shutdown storage :(
  }
}

module.exports = suite;
