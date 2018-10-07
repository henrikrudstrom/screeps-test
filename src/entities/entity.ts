export class Entity {
  public uuid: string;
  public type: string;
  constructor(memory: EntityMemory){
    this.uuid = memory.uuid;
    this.type = memory.type;
  }

}
