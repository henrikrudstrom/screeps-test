export class MockRoom implements Room {
  public visual!: RoomVisual;
  public readonly prototype!: Room;

  public controller?: StructureController;
  public energyAvailable: number = 0;
  public energyCapacityAvailable: number = 0;
  public memory: RoomMemory = {};
  public mode: string = "";
  public name: string;
  public storage?: StructureStorage;
  public terminal?: StructureTerminal;
  public eventLog!: EventItem[];

  constructor(name: string = "W1N1") {
    this.name = name;
  }

  public createConstructionSite(...args: any[]): ScreepsReturnCode  {
    throw new Error("Not implemented.");
  }

  public createFlag(...args: any[]): ERR_NAME_EXISTS | ERR_INVALID_ARGS | string {
    throw new Error("Not implemented.");
  }
  public find<T extends Structure>(...args: any[]): T[] {
    throw new Error("Not implemented.");
  }

  public findExitTo(room: string | Room): ExitConstant | ERR_NO_PATH | ERR_INVALID_ARGS {
    throw new Error("Not implemented.");
  }

  public findPath(fromPos: RoomPosition, toPos: RoomPosition, opts?: FindPathOpts): PathStep[] {
    throw new Error("Not implemented.");
  }

  public getPositionAt(x: number, y: number): RoomPosition | null {
    throw new Error("Not implemented.");
  }

  public lookAt(...args: any[]): LookAtResult[] {
    throw new Error("Not implemented.");
  }

  public lookAtArea(...args: any[]): any {
    throw new Error("Not implemented.");
  }

  public lookForAt<T extends keyof AllLookAtTypes>(...args: any[]): Array<AllLookAtTypes[T]> {
    throw new Error("Not implemented.");
  }

  public lookForAtArea<T extends keyof AllLookAtTypes>(...args: any[]): any {
    throw new Error("Not implemented.");
  }
}
