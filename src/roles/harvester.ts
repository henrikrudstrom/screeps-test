import { Process } from "os/process";
import { Programs } from "os/programs";

export class HarvesterProcess extends Process {
  public static Start(parent: Process, creep: Creep, sourceId: string, x: number, y: number){
    creep.memory.pid = parent.launchChildProcess(`${creep.name}-harvester`, HarvesterProcess, { sourceId, x, y });
  }

  public main(): void {
    const creep = Game.creeps[this.data.creepName];
    if(creep === undefined){
      this.suicide();
    }
    const source: Source | null = Game.getObjectById(this.data.sourceId)
    if(source === null){
      throw new Error(`Cannot find Source with id: ${this.data.sourceId}`)
    }

    if(!creep.pos.isEqualTo(this.data.x, this.data.y)){
      creep.moveTo(this.data.x, this.data.y);
    }
    else{
      creep.harvest(source);
    }
  }
}

Programs.register(HarvesterProcess);
