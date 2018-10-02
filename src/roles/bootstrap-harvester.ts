export default function tick(creep: Creep) {
  if(creep.carry.energy < creep.carryCapacity){
    if (creep.pos.x !== creep.memory.dest.x || creep.pos.y !== creep.memory.dest.y) {
      creep.moveTo(creep.memory.dest.x, creep.memory.dest.y);
    } else {
      const source: Source | null = Game.getObjectById(creep.memory.sourceId)
      if(source === null){
        throw new Error(`Cannot find Source with id: ${creep.memory.sourceId}`)
      }
      creep.harvest(source);
    }
  } else {
    const target = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
    if(target === null) {
      throw new Error("No spawn found, cannot haul");
    }
    const result = creep.transfer(target, RESOURCE_ENERGY);
    if (result === ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
}
