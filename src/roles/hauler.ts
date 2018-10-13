import { Process } from "os/process";
import { Programs } from "os/programs";

export class HaulerProcess extends Process {
  public main(): void {
    const creep = Game.creeps[this.data.creepName];
    if(creep === undefined){
      this.suicide();
    }
    let idle = false;
    if (creep.carry.energy < creep.carryCapacity) {
      // console.log("harvest")
      const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
      if(target === null){
        idle = true;
        return;
      }
      const result = creep.pickup(target);
      if (result === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      } else if(result === OK && creep.carry.energy < creep.carryCapacity){
        idle = true;
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
}

Programs.register(HaulerProcess);
