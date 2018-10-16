const testSuite = require('../test-server/lib/server-test-suite');

(async () => {
    await testSuite("testsuite", "./dist/server-tests/my-test.js", async (test) => {
      console.log("suite")
      await test("my-test", async (world) => {
        console.log("build")
        await world.addRoom("W0N1");
        await world.addRoomObject("W0N1", "controller", 10, 10, { level: 0 });
        await world.placeSpawn(25, 25, "W0N1");
      }, async (world, bot, run) => {
        console.log(await bot.memory)
        await run(10, () => {
          console.log("tick")
        });
        console.log(await bot.memory)
      })
    })
})();
