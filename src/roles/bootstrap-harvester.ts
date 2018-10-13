import { Process } from "os/process";
import { Programs } from "os/programs";
import { createLogger } from "os/logger";

const logger = createLogger('bootstrap-harvester-process');

export class BootstrapHarvesterProcess extends Process {
  public static Start(parent: Process, creep: Creep, sourceId: string, destId: string) {
    creep.memory.pid = parent.launchChildProcess(`${creep.name}-bootstrap-harvester`, BootstrapHarvesterProcess, { creepName: creep.name, sourceId, destId });
  }


  public main(): void {
    logger.info(`Processing creep ${this.data.creepName}`);
    logger.debug(`data`)
    logger.debug(this.data);
    const creep = Game.creeps[this.data.creepName];

    if(creep === undefined){
      this.suicide();
    }

    if(creep.carry.energy < creep.carryCapacity){
      const source: Source | null = Game.getObjectById(this.data.sourceId)
      if(source === null){
        throw new Error(`Cannot find Source with id: ${this.data.sourceId}`)
      }

      if(!creep.pos.inRangeTo(source.pos, 1)){
        creep.moveTo(source.pos);
      }
      else{
        creep.harvest(source);
      }
    } else {
      const target = Game.getObjectById(this.data.destId) as Structure
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

Programs.register(BootstrapHarvesterProcess);
