import { MockRoom } from "./room";
import { MockOwner } from "./owner";
import { MockRoomPosition } from "./room-position";

export class MockStructure<T extends StructureConstant = StructureConstant> {
    public hits: number = 0;

    public hitsMax: number = 0;

    public id: string;

    public room: Room = new MockRoom();

    public structureType: T;
    public pos: RoomPosition = new MockRoomPosition("W1N1", 0, 0);
    constructor(id: string, structureType: T){
      this.id = id;
      this.structureType = structureType;
    }

    public destroy(): ScreepsReturnCode {
      throw new Error("not implemented.")
    }

    public isActive(): boolean {
      throw new Error("not implemented.")
    }

    public notifyWhenAttacked(enabled: boolean): ScreepsReturnCode{
      throw new Error("not implemented.")
    }
}

export class MockOwnedStructure<T extends StructureConstant = StructureConstant> extends MockStructure<T> {
    //public readonly prototype: OwnedStructure;
    public my: boolean = true;
    public owner: Owner = new MockOwner();
}



export class MockStructureSpawn extends MockOwnedStructure<STRUCTURE_SPAWN> implements StructureSpawn {
  public prototype!: StructureSpawn;

  public energy: number = 0;

  public energyCapacity: number = 300;

  public memory: SpawnMemory = {};



  public spawning: Spawning | null = null;

  constructor(id: string, public name: string = "Spawn1"){
    super(id, "spawn");
  }

  public canCreateCreep(body: BodyPartConstant[], name?: string): ScreepsReturnCode {
    throw new Error("not implemented.")
  }

  public createCreep(body: BodyPartConstant[], name?: string, memory?: CreepMemory): ScreepsReturnCode | string{
    throw new Error("not implemented.")
  }

  public spawnCreep(body: BodyPartConstant[], name: string, opts?: SpawnOptions): ScreepsReturnCode{
    throw new Error("not implemented.")
  }

  public destroy(): ScreepsReturnCode{
    throw new Error("not implemented.")
  }

  public isActive(): boolean{
    throw new Error("not implemented.")
  }

  public notifyWhenAttacked(enabled: boolean): ScreepsReturnCode{
    throw new Error("not implemented.")
  }

  public renewCreep(target: Creep): ScreepsReturnCode{
    throw new Error("not implemented.")
  }

  public recycleCreep(target: Creep): ScreepsReturnCode{
    throw new Error("not implemented.")
  }
}
