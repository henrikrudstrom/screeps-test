Memory.created = false;
export const loop = () => {
  console.log("should create: " + Memory.created)
  if(!Memory.created) {
    console.log("created creep")
    Game.spawns.Spawn1.spawnCreep([WORK, MOVE, MOVE], "Mycreep");
  }
  Memory.created = true;
};
