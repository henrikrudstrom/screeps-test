import { Entity, EntityBase } from "entities/entity";
import { Entities } from "entities/entities";
import { Process } from "os/process";
import randomCreepName from "util/creep-name-generator";
import { Scheduler } from "os/scheduler";
import { Programs } from "os/programs";
import { createLogger } from "os/logger";

const logger = createLogger("factory");

export interface FactoryClient extends Entity {
  orderCompleted(order: FactoryOrder): void;
}

export class Factory extends EntityBase {
  public spawn: StructureSpawn;
  public queue: FactoryOrder[];
  public memory: FactoryMemory;

  public get energyCapacity(): number {
    return this.spawn.energyCapacity;
  }
  public get remainingBuildTime(): number {
    return this.spawn.spawning === null ? 0 : this.spawn.spawning.remainingTime;
  }

  public static create(spawn: Partial<StructureSpawn>) {
    const id = `factory-${spawn.name}`;
    Entities.create(id, Factory, { spawnId: spawn.id, orders: [] });
    return id;
  }

  public static start(uuid: string, parentProcess: Process): number {
    const pid = parentProcess.launchChildProcess(`${uuid}-root`, FactoryProcess, { uuid });
    Entities.get<Factory>(uuid).memory.rootPid = pid;
    return pid;
  }

  constructor(memory: EntityMemory) {
    super(memory);
    this.memory = memory as FactoryMemory;
    this.spawn = Game.getObjectById(this.memory.spawnId) as StructureSpawn;
    this.queue = this.memory.orders;
  }

  public order(client: FactoryClient, priority: number, body: BodyPartConstant[], memory: any = null) {
    const order = {
      clientId: client.uuid,
      priority,
      body,
      memory,
      creepName: undefined
    };
    for (let i = 0; i < this.queue.length; i++) {
      if (this.queue[i].priority < priority) {
        this.queue.splice(i, 0, order);
        return;
      }
    }
    this.queue.push(order);
    if (Scheduler.instance !== undefined) {
      Scheduler.instance.wake(this.memory.rootPid);
    }
  }
}

Entities.registerType(Factory);

class FactoryProcess extends Process {
  public main(): void {
    const factory = Entities.get<Factory>(this.data.uuid);
    logger.info("Factory awake!!!");
    if (factory.remainingBuildTime > 0) {
      logger.info(`Still building for ${factory.remainingBuildTime}, going back to sleep.`);
      this.sleep(factory.remainingBuildTime);
      return;
    } else if (factory.memory.currentOrder !== undefined) {
      logger.info(`Order completed, notifying client, uuid: ${factory.memory.currentOrder.clientId}...`);
      const client = Entities.get(factory.memory.currentOrder.clientId) as FactoryClient;
      client.orderCompleted(factory.memory.currentOrder);
      factory.memory.currentOrder = undefined;
    }

    if (factory.queue.length < 1) {
      logger.info("Nothing in queue, going back to sleep")
      this.sleep();
      return;
    }

    logger.info(`building next in queue. (queue length: ${factory.queue.length}) `);
    const nextTask = factory.queue[0];
    if (nextTask === undefined) {
      return;
    }

    const testName = "QWEQWQRQWEQWEQWRQWASFASFASF";
    if (factory.spawn.spawnCreep(nextTask.body, testName, { dryRun: true }) === OK) {
      const creepName = randomCreepName()
      factory.spawn.spawnCreep(nextTask.body, creepName, { memory: nextTask.memory });
      logger.info(`started spawning creep '${creepName}'`)
      factory.memory.currentOrder = factory.queue.shift() as FactoryOrder;
      factory.memory.currentOrder.creepName = creepName;
    }
    if (factory.spawn.spawning !== null) {
      logger.info(`spawing creep, ${factory.remainingBuildTime} ticks remaining, going back to sleep`);
      this.sleep(factory.remainingBuildTime);
    }
  }
}

Programs.register(FactoryProcess);
