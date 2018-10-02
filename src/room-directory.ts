import { HasID } from "has-id";

type PopulateFunction = (room: Room) => HasID[];

export class RoomDirectory {
  private _entities: {[name: string]: HasID};
  public get entities(): HasID[] {
    return _.values(this._entities);
  }
  public static instance: RoomDirectory;

  public static Initialize(room: Room, populators: PopulateFunction[]){
    RoomDirectory.instance = new RoomDirectory(room, populators);
  }

  constructor(room: Room, populators: PopulateFunction[]) {
    this._entities = {};
    populators
      .map((populate: PopulateFunction) => populate(room))
      .forEach((ents: HasID[]) => {
        ents.forEach((ent: HasID) => {
          if(this._entities[ent.uuid] !== undefined){
            throw new Error(`Duplicate uuid: ${ent.uuid}.`)
          }
          this._entities[ent.uuid] = ent;
        })
      });
  }

  public get(uuid: string) : HasID{
    return this._entities[uuid];
  }

  public find<T extends HasID>(c: new (...params : any[]) => T) : T[] {
    return this.entities.filter((ent: HasID) => {
        return ent instanceof c;
      }).map((ent: HasID) => ent as T)
  }
}
