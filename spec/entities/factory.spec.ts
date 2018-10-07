/// <reference path="../../src/entities/types.d.ts" />
/// <reference path="../../node_modules/@types/screeps/index.d.ts" />
import { expect } from "chai";
import mocha from "mocha";
import { Entities } from "entities/entities";
import { MockStructureSpawn } from "../mocks/structure-spawn";
import { Factory, FactoryClient } from "entities/factory";
import "../const.js"
(global as any).Memory = {};
(global as any).Game = {
    getObjectById(id: string){
      return new MockStructureSpawn(id);
    }
}

class TestClient implements FactoryClient {
  public type: string = TestClient.name;
  constructor(public uuid: string){

  }
  public orderCompleted(order: FactoryOrder) : void {

  }
}

describe("Factory", () => {
  beforeEach(done => {
    Memory.entities = {}
    Entities.init();
    done();
  });

  it("should sort orders by priority", () => {
    const spawn = new MockStructureSpawn("12345");
    const id = Factory.create(spawn);
    const factory = Entities.get<Factory>(id);
    const client = new TestClient("444");
    factory.order(client, 1, [WORK], { testData: 1 })
    factory.order(client, 1, [], { testData: 2 })
    factory.order(client, 4, [], { testData: 3 })
    factory.order(client, 1, [], { testData: 4 })

    const res = factory.queue.map((order: FactoryOrder) => order.memory.testData)
    expect(res).to.eql([3, 1, 2, 4])
  });
});
