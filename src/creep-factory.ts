import randomCreepName from "./creep-name-generator";
import { MessageBus, Subscriber } from "message-bus";
import { RoomDirectory } from "./room-directory";
import { HasID } from "has-id";

export class CreepFactoryOrder implements CreepFactoryOrderMemory{
  public body: BodyPartConstant[];
  public memory: CreepMemory;
  public clientUUID: string;
  constructor(body: BodyPartConstant[], memory: CreepMemory, clientUUID: string) {
    this.body = body;
    this.memory = memory;
    this.clientUUID = clientUUID;
  }
}

export class CreepFactory implements Subscriber, HasID {
  public memory: CreepFactoryMemory;
  public uuid: string;
  public spawn: StructureSpawn;
  public get queue(): CreepFactoryOrder[] {
    return this.memory.queue;
  }

  constructor(spawn: StructureSpawn)  {
    this.spawn = spawn;
    if (Memory.creepFactories === undefined) {
      Memory.creepFactories = {};
    }

    if (Memory.creepFactories[spawn.name] === undefined) {
      Memory.creepFactories[spawn.name] = {
        queue: [],
        spawnName: spawn.name
      };
    }
    this.memory = Memory.creepFactories[spawn.name];
    this.uuid = `factory-${spawn.name}`
  }

  private bodyCost(body: BodyPartConstant[]): number {
    return body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
  }

  public requestCreep(body: BodyPartConstant[], memory: CreepMemory, client: HasID){
    this.queue.push(new CreepFactoryOrder(body, memory, client.uuid));
  }

  public tick() {
    if (this.spawn.spawning !== null) {
      return;
    }
    if(this.queue.length < 1){
      return;
    }
    console.log(`building next in queue. (queue length: ${this.queue.length}) `)
    const nextTask = this.queue[0];
    if (this.bodyCost(nextTask.body) <= this.spawn.room.energyAvailable) {
      const res = this.spawn.spawnCreep(nextTask.body, randomCreepName(nextTask.memory.role), { memory: nextTask.memory });
      if (res === OK) {
        console.log("build ok")
        this.queue.shift();
      } else {
        console.log("build failed")
      }

    }
  }

  public recieve(message: any): void {}
}

export function PopulateCreepFactory(room: Room) : CreepFactory[]{
  return _(Game.spawns)
     .filter((spawn: StructureSpawn) => spawn.room.name === room.name)
     .map((spawn: StructureSpawn) => new CreepFactory(spawn))
     .value();
}
