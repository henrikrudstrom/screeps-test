/// <reference path="../../src/entities/types.d.ts" />
/// <reference path="../../node_modules/@types/screeps/index.d.ts" />
import { expect } from "chai";
import mocha from "mocha";
import * as TypeMoq from "typemoq";

import { initGame } from "../mocks/global";
import { Entities } from "entities/entities";
import { MockStructureSpawn } from "../mocks/structure-spawn";
import { Factory, FactoryClient } from "entities/factory";
import "../const.js"
import { Entity } from "entities/entity";
import { Kernel } from "os/kernel";
import { Process } from "os/process";
import { Programs } from "os/programs";

class TestClient extends Entity implements FactoryClient {

  constructor(public uuid: string, public callback: (() => void) | undefined = undefined){
    super({uuid: uuid, type: TestClient.name})
  }
  public orderCompleted(order: FactoryOrder) : void {
    if(this.callback) {
      this.callback()
    }
  }
}

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
    (global as any).Game.getObjectById = function(id: string){
      return new MockSpawn(id, "Spawn1");
    }
    kernel = new Kernel();
    tick();
    done();
  });

  function tick(){
    (Game as any).tick();
    kernel.start("RootProcess");
    Entities.init(kernel.scheduler);
    rootProcess = kernel.getRootProcess();
    kernel.run();
    kernel.shutdown();
  }

  it("should sort orders by priority", () => {
    const id = Factory.create({name: "Spawn1", id: "1234"});
    const factory = Entities.get<Factory>(id);
    const client = new TestClient("444");
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
    let notified = false;
    const client = new TestClient("444", () => {
      notified = true;
    });
    factory.order(client, 1, [WORK, MOVE, CARRY]);
    tick();
    factory = Entities.get<Factory>(id);
    expect(factory.memory.currentOrder).to.eql({priority: 1, clientId: client.uuid, body: [WORK, MOVE, CARRY], memory: null})
    expect(factory.remainingBuildTime).to.eql(3);
    tick();
    expect(factory.remainingBuildTime).to.eql(2);
    tick();
    tick();
    tick();
    tick();
    expect(notified).to.eql(true);
  })

  // it("should wake up its process if its sleeping", () => {
  //   const id = Factory.create({name: "Spawn1", id: "1234"});
  //   const pid = Factory.start(id, rootProcess);
  //   kernel.scheduler.sleep(pid);
  //   let factory = Entities.get<Factory>(id);
  //   const client = new TestClient("444");
  //   factory.order(client, 1, [WORK, MOVE, CARRY]);
  //   tick();
  //   factory = Entities.get<Factory>(id);
  //   expect(factory.currentOrder).to.eql({priority: 1, clientId: client.uuid, body: [WORK, MOVE, CARRY], memory: null})
  // })
});
