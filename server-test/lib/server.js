const _ = require("lodash");
const { ScreepsServer, TerrainMatrix } = require("screeps-server-mockup");
const fs = require("fs");
const glob = require('glob-promise');
async function createCreep(room, x, y, name, body, user, world) {
  body = body.map(part => ({ type: part, hits: 100 }));
  return world.addRoomObject(room, "creep", x, y, {
    name: name,
    body: body,
    energy: 0,
    energyCapacity: 0,
    user: user.id(),
    hits: body.sum((part) => part.hits),
    hitsMax: 300,
    spawning: false,
    fatigue: 0,
    ageTime: 1509,
    actionLog: {
      attacked: null,
      healed: null,
      attack: null,
      rangedAttack: null,
      rangedMassAttack: null,
      rangedHeal: null,
      harvest: null,
      heal: null,
      repair: null,
      build: null,
      say: null,
      upgradeController: null,
      reserveController: null
    }
  });
}

async function simpleWorld(world) {
  // Prepare the terrain for a new room
  const terrain = new TerrainMatrix();
  const walls = [[10, 10], [10, 40], [40, 10], [40, 40]];
  _.each(walls, ([x, y]) => terrain.set(x, y, "wall"));

  // Create a new room with terrain and basic objects
  await world.addRoom("W0N1");
  await world.setTerrain("W0N1", terrain);
  await world.addRoomObject("W0N1", "controller", 10, 10, { level: 0 });
  await world.addRoomObject("W0N1", "source", 10, 40, {
    energy: 1000,
    energyCapacity: 1000,
    ticksToRegeneration: 300
  });
  await world.addRoomObject("W0N1", "mineral", 40, 40, { mineralType: "H", density: 3, mineralAmount: 3000 });
}

class TestServer {
  constructor() {
    this.server = new ScreepsServer();
    this.started = false;
  }


  async readModules(){
    const modules = {};
    const files = (await glob('dist/src/**/*.js')).forEach(f => {
      const mod = f.replace('dist/src/', '').replace('.js', '');
      modules[mod] = fs.readFileSync(f, 'utf8');
    });
    // , async (error, files) => {
    //   files.forEach(f => {
    //     console.log(f)
    //     const mod = f.replace('dist/src', '').replace('.js', '');
    //     modules[mod] = fs.readFileSync(f, 'utf8');
    //   })
    // });
    delete modules['main'];
    return modules;
  }

  async init(codePath, builder) {
    if (this.started) this.server.stop();

    await this.server.world.reset(); // reset world but add invaders and source keepers bots
    await builder(this.server.world);
    const modules = await this.readModules();
    modules['lib/loglevel'] = fs.readFileSync("./node_modules/loglevel/lib/loglevel.js", "utf8");
    modules['main'] = fs.readFileSync(codePath, "utf8");
    console.log("MODULES:")
    console.log(_.keys(modules))
    // const code = fs.readFileSync(codePath, "utf8");
    // // Add a bot in W0N1
    // const llcode = fs.readFileSync("./node_modules/loglevel/lib/loglevel.js", "utf8");
    // const modules = {
    //   main: code,
    //   loglevel: llcode
    // };
    //await this.readModules();

    this.bot = await this.server.world.addBot({ username: "bot", room: "W0N1", x: 25, y: 25, modules });
    // Print console logs every tick

    // const { pubsub } = this.bot._server.common.storage;
    // console.log(this.bot._server.common.storage)
    // await pubsub.subscribe(`user:${this._id}/messages`, (event) => {
    //     const { messages } = JSON.parse(event);
    //     const { log = [], results = [] } = messages || {};
    //     this.emit('error', log, results, this._id, this.username);
    // });
    this.bot.on("error", (logs, results, userid, username) => {
      _.each(logs, line => console.log(line));
    });
    this.bot.on("console", (logs, results, userid, username) => {
      _.each(logs, line => console.log(line));
    });
  }

  async tick(n, onTick) {
    if (!this.started) {
      await this.server.start();
    }
    for (let i = 0; i < n; i++) {
      await this.server.tick();
      if (onTick) await onTick(this.server.world, this.bot);
    }
  }

  stop() {
    this.server.stop();
  }
}

module.exports = {
  TestServer,
  simpleWorld
};
