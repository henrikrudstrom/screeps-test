const { TerrainMatrix } = require('screeps-server-mockup');

function builder(server) {
  const world = server.world;
  this.createCreep = async function(room, x, y, name, body) {
    if (!this.bot) {
      throw new Error('need to create a spawn before creating creeps');
    }
    body = body.map(part => ({ type: part, hits: 100 }));
    return await world.addRoomObject(room, 'creep', x, y, {
      name: name,
      body: body,
      energy: 0,
      energyCapacity: 0,
      user: server.bot.id(),
      hits: body.sum(part => part.hits),
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
  };
  this.createController = async function(room, x, y, level) {
    await world.addRoomObject(room, 'controller', x, y, { level });
  };

  this.createSource = async function(room, x, y, energy = 1000, energyCapacity = 1000) {
    await world.addRoomObject(room, 'source', x, y, {
      energy,
      energyCapacity,
      ticksToRegeneration: 300
    });
  };
  this.createMineral = async function(room, x, y, mineralType, density = 3, mineralAmount = 3000) {
    await world.addRoomObject(room, 'mineral', x, y, { mineralType, density, mineralAmount });
  };
  this.createRoom = async function(name) {
    await world.addRoom(name);
  };
  this.setTerrain = async function(room, data) {
    const terrain = new TerrainMatrix();
    data.forEach(d => {
      terrain.set(d[0], d[1], d[2]);
    });
    await world.setTerrain(room, terrain);
  };

  this.createSpawn = async function(room, x, y) {
    server.bot = await this.server.world.addBot({ x, y, room, username: 'bot', modules: this.modules });
    server.bot.on('console', (logs, results, userid, username) => {
      _.each(logs, line => console.log(line));
    });
  };
}

module.exports = builder;
