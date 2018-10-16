import { Entity } from "entities/entity";

export enum ResourceLocationType {
  Dropped, Structure
}

export interface ResourceLocation extends Entity{
  location: RoomPosition;
  structureId: string | null;
}
//
// export interface PickupLocation extends StorageLocation{
//   //predictedAmount(resource: Resource, time: number): number;
//   //deliver(creep: Creep, amount: number) : boolean;
//
// }
//
// export interface DropOffLocation extends StorageLocation {
//   //predictedCapacity(resource: Resource, time: number) : number;
//   //pickup(creep: Creep, amount: number): boolean;
// }
