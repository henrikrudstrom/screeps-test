export default function tick(creep: Creep) {
    if (creep.carry.energy < creep.carryCapacity) {
      // console.log("harvest")
      const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
      if(target === null){
        return;
      }
      if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
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
