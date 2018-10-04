import { Entity } from "entity";

type PopulateFunction = (room: Room) => Entity[];

export class Phonebook {
  private _entities: {[name: string]: Entity};
  public get entities(): Entity[] {
    return _.values(this._entities);
  }
  public static instance: Phonebook;

  public static Initialize(room: Room, populators: PopulateFunction[]){
    Phonebook.instance = new Phonebook(room, populators);
  }

  constructor(room: Room, populators: PopulateFunction[]) {
    this._entities = {};
    populators
      .map((populate: PopulateFunction) => populate(room))
      .forEach((ents: Entity[]) => {
        ents.forEach((ent: Entity) => {
          if(this._entities[ent.uuid] !== undefined){
            throw new Error(`Duplicate uuid: ${ent.uuid}.`)
          }
          this._entities[ent.uuid] = ent;
        })
      });
  }

  public get(uuid: string) : Entity{
    return this._entities[uuid];
  }

  public find<T extends Entity>(c: new (...params : any[]) => T, pos: RoomPosition | undefined) : T[] {
    return this.entities.filter((ent: Entity) => {
        return ent instanceof c;
      }).map((ent: Entity) => ent as T)
      //TODO implement sorting by distance
  }
}
