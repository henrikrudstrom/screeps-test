/// <reference path="../../src/entities/types.d.ts" />
import { expect } from "chai";
import mocha from "mocha";
import { Entities } from "entities/entities";
import { Entity } from "entities/entity";

(global as any).Memory = {};

interface TestEntityMemory extends EntityMemory {
  additionalProp: string;
}

class TestEntity extends Entity {
  public additionalProp: string;
  public memory: TestEntityMemory;
  constructor(memory: EntityMemory) {
    super(memory);
    this.memory = memory as TestEntityMemory;
    this.additionalProp = this.memory.additionalProp;
  }
}

class AnotherEntityType extends Entity {

}

Entities.registerType(TestEntity);
Entities.registerType(AnotherEntityType);

describe("Entities", () => {
  beforeEach(done => {
    Memory.entities = {}
    Entities.init();
    done();
  });

  it("should be able to retrieve entity from memory", () => {
    const id = "myid";
    Entities.create("myid", TestEntity, { additionalProp: "myValue"})
    const ent = Entities.get<TestEntity>(id);
    expect(ent.additionalProp).to.eql("myValue");
  });

  it("should return a fresh instance on reset", () => {
    const id = "myid";
    Entities.create("myid", TestEntity, { additionalProp: "myValue"})
    const ent = Entities.get<TestEntity>(id);
    Entities.init();
    const ent2 = Entities.get<TestEntity>(id);
    expect(ent).to.eql(ent2);
    expect(ent).to.not.equal(ent2);
  });

  it("should find entities by type", () => {
    Entities.create("id1", TestEntity, { additionalProp: "myValue"})
    Entities.create("id2", AnotherEntityType)
    Entities.create("id3", AnotherEntityType)
    expect(Entities.find(TestEntity).map(ent => ent.uuid)).to.eql(["id1"])
    expect(Entities.find(AnotherEntityType).map(ent => ent.uuid)).to.eql(["id2", "id3"])
  })
});
