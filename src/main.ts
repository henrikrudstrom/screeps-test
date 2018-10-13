import { Programs } from "os/programs";
import { Process } from "os/process";
import { Kernel } from "os/kernel";
import { Entities } from "entities/entities";
import { Factory } from "entities/factory";
import { HarvestingSite } from "entities/harvesting-site";
import { ErrorMapper } from "os/error-mapper";
import { setLogLevel } from "os/logger";

// import { ErrorMapper } from "utils/ErrorMapper";
// import { Kernel } from "os/kernel";
// import { Programs, Process } from "os/process";
// //import { createLogger } from "os/logger"
// // When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// // This utility uses source maps to get the line numbers and file names of the original, TS source code
// //const logger = createLogger("main");
// //
//
// class TestProcess extends Process {
//   public main(): void {
//     console.log("Test run")
//   }
// }
//Programs.register("test", TestProcess)

// let created = false;
// export const loop = ErrorMapper.wrapLoop(() => {
//   if(!created) {
//     console.log("created creep")
//     Game.spawns.spawn1.createCreep([WORK, MOVE, MOVE]);
//   }
//   created = true;
//   // console.log(`Current game tick is ${Game.time}`)
//   // const kernel = new Kernel();
//   // kernel.start("test");
//   // kernel.run()
//   // kernel.shutdown();
// });

class RootProcess extends Process {
  public main(): void {
    if(Memory.done) {
      return;
    }
    if(Entities.find(Factory).length === 0){
      const uuid = Factory.create(Game.spawns.Spawn1);
      Factory.start(uuid, this);
    }
    const factory = Entities.find(Factory)[0];

    if(Entities.find(HarvestingSite).length === 0){
      const source = factory.spawn.pos.findClosestByPath(FIND_SOURCES);
      if(source === null) {
        throw new Error("no sources found");
      }
      const uuid = HarvestingSite.create(source);
      HarvestingSite.start(uuid, this);
    }
    const harvestingSite = Entities.find(HarvestingSite)[0];

    factory.order(harvestingSite, 1, [MOVE, CARRY, WORK, WORK], {role: 'bootstrap-harvester'});
    Memory.done = true;
  }
}

Programs.register(RootProcess);
setLogLevel('DEBUG', 'scheduler');
export const loop = ErrorMapper.wrapLoop(() => {
  const kernel = new Kernel();
  kernel.start("RootProcess");
  Entities.init(kernel.scheduler);
  kernel.run();
  kernel.shutdown();
});
