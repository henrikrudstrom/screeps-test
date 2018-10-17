const testSuite = require('../test-server/lib/server-test-suite');

function createTerrain(builder){
  builder.setTerrainArea(3, 3, 3, 46, 'wall');
  builder.setTerrainArea(3, 46, 46, 46, 'wall');
  builder.setTerrainArea(46, 46, 46, 3, 'wall');
  builder.setTerrainArea(46, 3, 3, 3, 'wall');

}



(async () => {
  await testSuite('testsuite', './dist/server-tests/my-test.js', async test => {
    console.log('suite');
    await test(
      'my-test',
      async builder => {
        console.log('build');
        await builder.createRoom('W0N1');
        builder.setTerrain('W0N1', [[10, 10, 'wall'], [20, 20, 'wall']]);
        await builder.createController('W0N1', 10, 10, 1);
        await builder.createSource('W0N1', 20, 20);
        await builder.createSpawn('W0N1', 10, 20);
        //await builder.createCreep('W0N1', 2,2, 'runner', ['move','tough', 'tough', 'tough'])
        await builder.applyTerrain('W0N1');
      },
      async (world, bot, run) => {
        console.log(await bot.memory);
        await run(500, () => {
          console.log('tick');
        });
        console.log(await bot.memory);
      }
    );
  });
})();
