export default function tick(creep: Creep) {
  if (creep.pos.x !== creep.memory.dest.x || creep.pos.y !== creep.memory.dest.y) {
    creep.moveTo(creep.memory.dest.x, creep.memory.dest.y);
  } else {
    const source: Source | null = Game.getObjectById(creep.memory.sourceId)
    if(source === null){
      throw new Error(`Cannot find Source with id: ${creep.memory.sourceId}`)
    }
    creep.harvest(source);
  }
}
