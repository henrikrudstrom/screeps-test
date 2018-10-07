export class MockRoomPosition implements RoomPosition{
  public readonly prototype!: RoomPosition;

  constructor(public roomName: string, public x: number, public y: number){

  }

  public createConstructionSite(...params: any[]): ScreepsReturnCode {
    throw new Error("not implemented.");
  }

  public createFlag(name?: string, color?: ColorConstant, secondaryColor?: ColorConstant): ScreepsReturnCode {
    throw new Error("Not implemented.");
  }
  public findClosestByPath<K extends FindConstant>(...params: any[]): FindTypes[K] | null {
    throw new Error("Not implemented.");
  }
  public findClosestByRange<K extends FindConstant>(...params: any[]): FindTypes[K] | null {
    throw new Error("Not implemented.");
  }
  public findInRange<K extends FindConstant>(...params: any[]): Array<FindTypes[K]> {
    throw new Error("Not implemented.");
  }
  public findPathTo(...params: any[]): PathStep[] {
    throw new Error("Not implemented.");
  }
  public getDirectionTo(...params: any[]): DirectionConstant {
    throw new Error("Not implemented.");
  }
  public getRangeTo(...params: any[]): number {
    throw new Error("Not implemented.");
  }
  public inRangeTo(...params: any[]): boolean {
    throw new Error("Not implemented.");
  }
  public isEqualTo(...params: any[]): boolean {
    throw new Error("Not implemented.");
  }
  public isNearTo(...params: any[]): boolean {
    throw new Error("Not implemented.");
  }
  public look(): LookAtResult[] {
    throw new Error("Not implemented.");
  }
  public lookFor<T extends keyof AllLookAtTypes>(type: T): Array<AllLookAtTypes[T]> {
    throw new Error("Not implemented.");
  }
}
