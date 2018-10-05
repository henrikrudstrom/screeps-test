import { ErrorMapper } from "utils/ErrorMapper";
//import { createLogger } from "os/logger"
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
//const logger = createLogger("main");
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`)

  if(typeof Game.cpu.getHeapStatistics === "function"){
    console.log(Game.cpu.getHeapStatistics());
  } else {
    console.log("nope")
    console.log(Game.cpu.getUsed())
    console.log(Game.cpu.limit, Game.cpu.tickLimit, Game.cpu.bucket)
  }
});
