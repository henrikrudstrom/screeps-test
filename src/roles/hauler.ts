import { Process } from "os/process";
import { Programs } from "os/programs";
import { ResourceLocation } from "entities/depot";
import { Entities } from "entities/entities";

enum TaskState {
  Pickup, Deliver, Completed, Cancelled, Aborted
}

interface HaulerTaskMemory {
  resourceType: ResourceConstant,
  amount: number,
  pickupEntity: string,
  deliverEntity: string,
  state: TaskState
}

export class HaulerProcess extends Process {
  public main(): void {
    const creep = Game.creeps[this.data.creepName];
    if(creep === undefined) {
      this.suicide();
    }
    const task = creep.memory.task as HaulerTaskMemory;
    if(task.state === TaskState.Aborted || task.state === TaskState.Cancelled || task.state === TaskState.Completed){
      creep.memory.task === null;
      return;
    }

    if(creep.memory.state === TaskState.Pickup){
      const pickup = Entities.get<ResourceLocation>(task.pickupEntity);
      if(!creep.pos.inRangeTo(pickup.location, 1)) {
        creep.moveTo(pickup.location);
      }
      else {
        if(pickup.structureId === null){
          const energy = creep.room.lookAt(pickup.location).filter(obj => obj.type === 'resource' && obj.resource!.resourceType === task.resourceType)[0];
          if(energy === undefined) {
            //TODO either wait for energy or cancel task
            return;
          }
          creep.pickup(energy.resource!)

        } else {
          const structure = Game.getObjectById(pickup.structureId) as Structure
          creep.withdraw(structure, task.resourceType, task.amount)
        }
        task.state = TaskState.Deliver;
      }
    } else {
      const deliverTo = Entities.get<ResourceLocation>(task.deliverEntity);
      if(!creep.pos.inRangeTo(deliverTo.location, 1)) {
        creep.moveTo(deliverTo.location);
      }
      else {
        if(deliverTo.structureId === null){
          creep.drop(task.resourceType);
        } else {
          const structure = Game.getObjectById(deliverTo.structureId) as Structure
          creep.transfer(structure, task.resourceType, task.amount)
        }
        task.state = TaskState.Completed;
        creep.memory.task = null;
      }
    }
  }

}

Programs.register(HaulerProcess);
