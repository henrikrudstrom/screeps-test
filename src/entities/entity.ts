import {Scheduler} from "os/scheduler";

export interface Entity{
  uuid: string;
  entityType: string;
}

export class EntityBase {
  public uuid: string;
  public entityType: string;
  constructor(public memory: EntityMemory){
    this.uuid = memory.uuid;
    this.entityType = memory.entityType;
  }
}
