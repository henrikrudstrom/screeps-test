/// <reference path="../../src/entities/types.d.ts" />
/// <reference path="../../node_modules/@types/screeps/index.d.ts" />
import { expect } from "chai";
import  "mocha";
import _ from "lodash"
import "../const.js"
import { initGame } from "../mocks/global";
import { Entities } from "entities/entities";
import { Factory, FactoryClient } from "entities/factory";
import { Entity, EntityBase } from "entities/entity";
import { Kernel } from "os/kernel";
import { Process } from "os/process";
import { Programs } from "os/programs";
import { Scheduler } from "os/scheduler";

class TestClient extends EntityBase implements FactoryClient {

  constructor(memory: EntityMemory){
    super({uuid: memory.uuid, type: TestClient.name})
    this.memory = memory;
  }
  public orderCompleted(order: FactoryOrder) : void {
    (this.memory as any).completed = true;
  }
}

Entities.registerType(TestClient)

class RootProcess extends Process {
  public main(): void {

  }
}
Programs.register(RootProcess);

class MockSpawning {
  public endTime: number;
  public get remainingTime(): number {
    return this.endTime - Game.time;
  }
  constructor(period: number){
    this.endTime = Game.time + period;
  }
}

class MockSpawn {
  public spawning: MockSpawning | null;
  constructor(public id: string, public name: string){
    this.spawning = null
  }

  public spawnCreep(...args: any[]){
    this.spawning = new MockSpawning(3);
    return OK;
  }
}

describe("Factory", () => {
  let kernel: Kernel;
  let rootProcess: Process;
  beforeEach(done => {
    initGame();
    (global as any).Game.getObjectById = (id: string) => {
      return new MockSpawn(id, "Spawn1");
    }
    kernel = new Kernel();
    tick();
    done();
  });

  function tick(){
    (Game as any).tick();
    kernel.start("RootProcess");
    Entities.init();
    rootProcess = kernel.getRootProcess();
    kernel.run();
    kernel.shutdown();
  }

  it("should sort orders by priority", () => {
    const id = Factory.create({name: "Spawn1", id: "1234"});
    const factory = Entities.get<Factory>(id);
    const client = new TestClient({uuid: "444", type: 'TestClient'});
    factory.order(client, 1, [], { testData: 1 })
    factory.order(client, 1, [], { testData: 2 })
    factory.order(client, 4, [], { testData: 3 })
    factory.order(client, 1, [], { testData: 4 })

    const res = factory.queue.map((order: FactoryOrder) => order.memory.testData)
    expect(res).to.eql([3, 1, 2, 4])
  });

  it("should start build if it has enough resources and notify when its done", () => {
    const id = Factory.create({name: "Spawn1", id: "1234"});
    Factory.start(id, rootProcess);
    let factory = Entities.get<Factory>(id);
    const clientId = Entities.create('444', TestClient)
    let client = Entities.get<TestClient>(clientId);
    factory.order(client, 1, [WORK, MOVE, CARRY]);
    tick();
    factory = Entities.get<Factory>(id);
    expect(_.omit(factory.memory.currentOrder!, 'creepName')).to.eql({priority: 1, clientId: client.uuid, body: [WORK, MOVE, CARRY], memory: null})
    expect(factory.remainingBuildTime).to.eql(3);
    tick();
    expect(factory.remainingBuildTime).to.eql(2);
    tick();
    tick();
    tick();
    tick();
    client = Entities.get<TestClient>(clientId);
    expect((client.memory as any).completed).to.eql(true);
  })
});
