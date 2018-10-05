import { ErrorMapper } from "utils/ErrorMapper";
import {PopulateHarvestingSites, HarvestingSite} from "harvesting-site";
import {PopulateCreepFactory} from "creep-factory";
import {MessageBus} from "message-bus";
import { RoomDirectory } from "room-directory";
import { HasID } from "has-id";
import harvesterRole from "roles/harvester";
import haulerRole from "roles/hauler";
import bootstrapHarvesterRole from "roles/bootstrap-harvester";

const roles: {[name: string]: (creep: Creep) => void} = {
  "bootstrap-harvester": bootstrapHarvesterRole,
  "harvester": harvesterRole,
  "hauler": haulerRole,
}
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  MessageBus.Initialize();
  RoomDirectory.Initialize(Game.spawns.Spawn1.room, [PopulateCreepFactory, PopulateHarvestingSites])
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
  console.log("checking harvesting sites")
  const activeHarvestingSites = RoomDirectory.instance.find(HarvestingSite)
    .filter((site: HarvestingSite) => site.state !== "inactive");
  if(activeHarvestingSites.length === 0){
    console.log("Finding nearest harvesting site.")
    const nearestSite = _(RoomDirectory.instance.find(HarvestingSite))
      .sortBy((site: HarvestingSite) => Game.spawns.Spawn1.pos.getRangeTo(site.source.pos))
      .first();
    nearestSite.state = "initial bootstrap";
  }

  RoomDirectory.instance.entities.forEach((ent: HasID) => {
    ent.tick();
  });
  console.log("running creeps.")
  for(const creepName in Game.creeps){
  //_(Game.creeps).forEach((creepName: string) => {
    const creep = Game.creeps[creepName];
    console.log(`running creep: ${creep.name}`)
    const role = roles[creep.memory.role];
    role(creep);
  //})
  //})
  }
});
