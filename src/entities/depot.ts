import { Entity } from "./entity";


export abstract class Depot extends Entity {
    public abstract get position(): RoomPosition;
    public predictedAmount(resource: Resource, time: number): number {

    }
    public predictedCapacity(resource: Resource, time: number): number {

    }


}

export class DroppedEnergyDepot extends Depot {

}

export class ContainerDepot extends Depot {

}
