import {Entity} from "./entity";
import {Entities} from "./entities";
import FastPriorityQueue from "fastpriorityqueue"
import { Process } from "os/process";
import randomCreepName from "util/creep-name-generator";
import { MockStructureSpawn } from "../../spec/mocks/structure-spawn";

export interface FactoryClient extends Entity{
  orderCompleted(order: FactoryOrder) : void;
}

class MyPriorityQueue<T> extends FastPriorityQueue<T>{
  public array!: T[];
  public setValues(array: T[]) : void{
    /* tslint:disable */
    this.array = array;
    this.size = array.length;
  }
  public getValues() : T[] {
    return this.array as T[];
  }
}

function initFactoryMemory(){
  return {
    orders: []
  }
}

export class Factory extends Entity {
  public spawn: StructureSpawn
  public queue: FactoryOrder[];
  public memory: FactoryMemory;
  public currentOrder: FactoryOrder | null = null;

  public get energyCapacity(): number { return this.spawn.energyCapacity }

  static create(spawn: StructureSpawn){
    const id = `factory-${spawn.name}`;
    Entities.create(id, Factory, { spawnId: spawn.id, orders: []});
    return id;
  }

  static start(spawn: StructureSpawn, process: Process) {
    const id = `factory-${spawn.name}`;
    process.launchProcess(id, 'factory-root', { uuid: id })
  }

  constructor(memory: EntityMemory) {
    super(memory)
    this.memory = memory as FactoryMemory;

    this.spawn = Game.getObjectById(this.memory.spawnId) as StructureSpawn;
    this.queue = this.memory.orders;
  }

  public order(client: FactoryClient, priority: number, body: BodyPartConstant[], memory: any = null){
    const order = {
      clientId: client.uuid,
      priority: priority,
      body: body,
      memory: memory
    }
    for(let i = 0; i < this.queue.length; i++){
      if(this.queue[i].priority < priority){
        this.queue.splice(i, 0, order);
        return;
      }
    }
    this.queue.push(order);
  }
}

Entities.registerType(Factory);


class FactoryProcess extends Process {
  public main(): void {
    const factory = Entities.get<Factory>(this.data.uuid);

    if (factory.spawn.spawning !== null) {
      return;
    }
    if(factory.queue.length < 1){
      return;
    }
    console.log(`building next in queue. (queue length: ${factory.queue.length}) `)
    const nextTask = factory.queue[0];
    if(nextTask === undefined) return;

    const testName = "QWEQWQRQWEQWEQWRQWASFASFASF";
    if(factory.spawn.spawnCreep(nextTask.body, testName, {dryRun: true}) === OK){
      factory.spawn.spawnCreep(nextTask.body, randomCreepName(nextTask.memory.role), { memory: nextTask.memory });
      factory.queue.shift();
    }
  }

}
