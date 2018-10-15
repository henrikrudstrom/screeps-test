const testSuite = require('../test-server/lib/server-test-suite');

(async () => {
    testSuite("testsuite", "./dist/server-tests/my-test.js", (test) => {
      console.log("suite")
      test("my-test", async (world) => {
        console.log("build")
        await world.addRoom("W0N1");
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
