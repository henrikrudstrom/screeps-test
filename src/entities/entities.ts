/// <reference path="./types.d.ts" />
import {Entity } from "entities/entity"
import _ from "lodash"
import { Scheduler } from "os/scheduler";

type EntityConstructor<T extends Entity> = new (memory: EntityMemory) => T

export class Entities{
  private static _entities: {[id: string]: Entity};
  private static _memory: {[id: string]: EntityMemory}
  private static _constructors: {[id: string]: EntityConstructor<Entity> } = {}
  public static init(){
    this._entities = {};
    if(!Memory.entities) {
      Memory.entities = {};
    }
    this._memory = Memory.entities;
  }

  public static registerType<T extends Entity>(ctor: EntityConstructor<T>): void{
    this._constructors[ctor.name] = ctor;
  }

  public static create<T extends Entity>(uuid: string,  type: EntityConstructor<T>, data: any = {}) : string {
    data.uuid = uuid;
    data.entityType = type.name;
    this._memory[uuid] = data;
    return uuid;
  }

  public static get<T extends Entity>(uuid: string) : T{
    if(!this._entities[uuid]){
      const mem = this._memory[uuid];
      if(!mem) {
        throw new Error(`No entity with id '${uuid}' was found.`);
      }
      const ctor = this._constructors[mem.entityType];
      if(!ctor){
        throw new Error(`No constructor for type '${mem.entityType} was found.`);
      }
      this._entities[uuid] = new ctor(mem);
    }
    return this._entities[uuid] as T;
  }

  public static find<T extends Entity>(type: EntityConstructor<T>) : T[]{
    return _.values<EntityMemory>(this._memory)
      .filter((mem) => mem.entityType === type.name)
      .map((mem) => this.get<T>(mem.uuid))
  }
}
