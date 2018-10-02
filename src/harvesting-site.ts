// import { HarvestingSiteMemory } from './types.d';
import { MessageBus, Subscriber } from "message-bus";
import { HasID } from "has-id";
import { RoomDirectory } from "room-directory";
import { CreepFactory } from "creep-factory";
import { CreepDesigner } from "creep-designer";

export class HarvestingSite implements Subscriber, HasID {
  public memory: HarvestingSiteMemory;
  public uuid: string;
  public source: Source;
  constructor(source: Source) {
    this.source = source;
    if (Memory.harvestingSites === undefined) {
      Memory.harvestingSites = {};
    }
    if (Memory.harvestingSites[source.id] === undefined) {
      Memory.harvestingSites[source.id] = {
        sourceId: source.id,
        spots: source.room
          .lookAtArea(source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true)
          .filter(res => res.type === "terrain" && res.terrain === "plain")
          .map(res => ({ x: res.x, y: res.y, creepName: null, reserved: false })),
        state: "inactive"
      };
    }
    this.memory = Memory.harvestingSites[source.id];
    this.uuid = `harvesting-site-${source.id}`;
  }

  public get state(): HarvestingSiteState {
    return this.memory.state;
  }

  public set state(state: HarvestingSiteState) {
    this.memory.state = state;
  }

  public get freeSpots(): HarvestingSpotMemory[] {
    return this.memory.spots.filter((spot: HarvestingSpotMemory) => !spot.reserved);
  }

  public recieve(message: any): void {
    throw new Error("Method not implemented.");
  }

  public get regenerationRate(){
    return this.source.energyCapacity / 300.0;
  }

  public get harvestingRate(){
    return _(this.memory.spots).map((spot: HarvestingSpotMemory) => {
      if(spot.creepName === null) {
        return 0;
      }
      return Game.creeps[spot.creepName].body.filter((part: BodyPartDefinition) => part.type === WORK).length * 2;
    }).sum();
  }

  public get droppedEnergy(){
    return _(this.memory.spots).map((spot: HarvestingSpotMemory) => {
      return _(this.source.room.lookForAt(LOOK_ENERGY, spot.x, spot.y))
        .map((res: Resource<RESOURCE_ENERGY>) => res.amount)
        .sum();
    }).sum();
  }

  public tick() {
    if (this.memory.state === "inactive"){
      return;
    }
    if (this.memory.state === "initial bootstrap" ) {
      console.log("Bootstrapping site");
      const factory = RoomDirectory.instance.find(CreepFactory)[0];
      const spot = _(this.freeSpots).first();
      const memory = {role: 'bootstrap-harvester', dest: {x: spot.x, y: spot.y}, sourceId: this.source.id }
      const body = [MOVE, WORK, WORK, CARRY];
      factory.requestCreep(body, memory, this);
      spot.reserved = true;
      this.memory.state = "normal operation";
      return;
    }
    if(this.memory.state === "normal operation"){
      if(this.freeSpots.length > 0){
        const spot = _(this.freeSpots).first();
        this.requestHarvester(spot);
        this.requestHauler();
      }
      if(this.freeSpots.length > 0){
        const spot = _(this.freeSpots).first();
        this.requestHarvester(spot);
      }
    }
  }


  private requestHarvester(spot: HarvestingSpotMemory) : void {
    const factory = RoomDirectory.instance.find(CreepFactory)[0];
    const memory = {role: 'harvester', dest: {x: spot.x, y: spot.y}, sourceId: this.source.id }
    const body = CreepDesigner.createFromBlueprintAndCost([WORK, MOVE, WORK, WORK, WORK], factory.spawn.energyCapacity);
    factory.requestCreep(body, memory, this);
    spot.reserved = true;
  }

  private requestHauler() : void {
    const factory = RoomDirectory.instance.find(CreepFactory)[0];
    const memory = {role: 'hauler'}
    const body = CreepDesigner.createFromBlueprintAndCost([MOVE, CARRY], factory.spawn.energyCapacity);
    factory.requestCreep(body, memory, this);
  }
}



export function PopulateHarvestingSites(room: Room): HarvestingSite[] {
  return room.find(FIND_SOURCES).map((source: Source) => new HarvestingSite(source));
}
