import {Scheduler} from "os/scheduler";

export class Entity {
  public uuid: string;
  public type: string;
  constructor(memory: EntityMemory, protected scheduler: Scheduler | null = null){
    this.uuid = memory.uuid;
    this.type = memory.type;
  }

}
