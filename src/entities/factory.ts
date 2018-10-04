import {Entity} from "./entity";
import FastPriorityQueue from "fastpriorityqueue"

export interface FactoryOrder {
  priority: number;
  body: BodyPartConstant[];
  memory: CreepMemory;
  ordernr: number;
  clientId: string;
}

class Factory extends Entity {
  private _spawn: StructureSpawn;
  private _queue: FastPriorityQueue<FactoryOrder>

  public get energyCapacity(): number { return this._spawn.energyCapacity }

  constructor(spawn: StructureSpawn) {
    this._spawn = spawn;
    _queue = new FastPriorityQueue<FactoryOrder>((a: FactoryOrder, b: FactoryOrder) => {
      a.priority < b.priority;
    });
  }
}
