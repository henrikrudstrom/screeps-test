import {Entity} from "./entity";
import {Entities} from "./entities";
import { Process } from "os/process";
import randomCreepName from "util/creep-name-generator";
import { Scheduler } from "os/scheduler";
import { Programs } from "os/programs";

export interface FactoryClient extends Entity{
  orderCompleted(order: FactoryOrder) : void;
}

export class Factory extends Entity {
  public spawn: StructureSpawn
  public queue: FactoryOrder[];
  public memory: FactoryMemory;
  public currentOrder: FactoryOrder | undefined;

  public get energyCapacity(): number { return this.spawn.energyCapacity }
  public get remainingBuildTime(): number { return this.spawn.spawning === null ? 0 : this.spawn.spawning.remainingTime }

  static create(spawn: Partial<StructureSpawn>){
    const id = `factory-${spawn.name}`;
    Entities.create(id, Factory, { spawnId: spawn.id, orders: []});
    return id;
  }

  static start(uuid: string, parentProcess: Process) : number {
    const pid = parentProcess.launchChildProcess(`${uuid}-root`, FactoryProcess, { uuid: uuid })
    Entities.get<Factory>(uuid).memory.rootPid = pid;
    return pid;
  }

  constructor(memory: EntityMemory, scheduler: Scheduler) {
    super(memory, scheduler);
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
    if(this.scheduler !== null){
      this.scheduler.wake(this.memory.rootPid);
    }
  }
}

Entities.registerType(Factory);


class FactoryProcess extends Process {
  public main(): void {
    const factory = Entities.get<Factory>(this.data.uuid);
    if(factory.remainingBuildTime > 0){
      this.sleep(factory.remainingBuildTime);
      return;
    } else if(factory.currentOrder !== undefined) {
      const client = Entities.get(factory.currentOrder.clientId) as FactoryClient
      client.orderCompleted(factory.currentOrder);
      factory.currentOrder = undefined
    }

    if(factory.queue.length < 1){
      this.sleep();
      return;
    }
    console.log(`building next in queue. (queue length: ${factory.queue.length}) `)
    const nextTask = factory.queue[0];
    if(nextTask === undefined) return;

    const testName = "QWEQWQRQWEQWEQWRQWASFASFASF";
    if(factory.spawn.spawnCreep(nextTask.body, testName, {dryRun: true}) === OK){
      factory.spawn.spawnCreep(nextTask.body, randomCreepName(), { memory: nextTask.memory });
      console.log("spawned")
      factory.currentOrder = factory.queue.shift();
    }
    if(factory.spawn.spawning !== null){
      this.sleep(factory.remainingBuildTime)
    }
  }
}

Programs.register(FactoryProcess);
