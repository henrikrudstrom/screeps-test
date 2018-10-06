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



Memory.created = false;
export const loop = () => {
  console.log("should create: " + Memory.created)
  if(!Memory.created) {
    console.log("created creep")
    Game.spawns.Spawn1.spawnCreep([WORK, MOVE, MOVE], "Mycreep");
  }
  Memory.created = true;
  // console.log(`Current game tick is ${Game.time}`)
  // const kernel = new Kernel();
  // kernel.start("test");
  // kernel.run()
  // kernel.shutdown();
};
