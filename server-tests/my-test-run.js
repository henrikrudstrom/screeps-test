const testSuite = require('../test-server/lib/server-test-suite');

(async () => {
  await testSuite('testsuite', './dist/server-tests/my-test.js', async test => {
    console.log('suite');
    await test(
      'my-test',
      async builder => {
        console.log('build');
        await builder.createRoom('W0N1');
        await builder.setTerrain('W0N1', [[10, 10, 'wall'], []]);
        await builder.createController('W0N1', 10, 10, 1);
        await builder.createSource('W0N1', 20, 20);
        await builder.createSpawn('W0N1', 10, 20);
      },
      async (world, bot, run) => {
        console.log(await bot.memory);
        await run(10, () => {
          console.log('tick');
        });
        console.log(await bot.memory);
      }
    );
  });
})();
