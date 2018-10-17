export function testFunction(done: () => void){
  // const spawn = _.values<StructureSpawn>(Game.spawns)[0]
  // if(_.size(Game.creeps) === 0 && spawn.spawning === null){
  //   spawn.spawnCreep([MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH], "runner");
  //   console.log("Spawn")
  // }
  const creep = Game.creeps['runner'];
  if(creep !== undefined && creep.spawning === false){
    if(creep.pos.inRangeTo(30, 30, 0)){
      done();
    } else {
      creep.moveTo(30, 30);
    }
    console.log(Game.time, creep.pos)
  }


}
