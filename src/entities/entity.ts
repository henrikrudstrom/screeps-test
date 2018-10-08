import {Scheduler} from "os/scheduler";

export class Entity {
  public uuid: string;
  public type: string;
  constructor(public memory: EntityMemory, protected scheduler?: Scheduler | undefined){
    this.uuid = memory.uuid;
    this.type = memory.type;
  }

}
