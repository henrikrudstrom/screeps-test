import { Kernel } from "os/kernel";
import { Entities } from "entities/entities";
import { Process } from "os/process";
import { Programs } from "os/programs";
try {
  const testFunction = require("./test-process").testFunction;

  class TestProcess extends Process {
    public main(): void {
      if(Memory.__testrun === undefined){
        Memory.__testrun = {};
      }
      Memory.__testrun.started = true;
      testFunction(() => {
        Memory.__testrun.done = true;
      });
    }
  }
  Programs.register(TestProcess);

} catch(e) {
  console.log(e)
}
export const loop = () => {
  try{
    console.log("Started")
    const kernel = new Kernel();
    kernel.start("TestProcess");
    Entities.init();
    kernel.run();
    kernel.shutdown();
  }catch(e){
    console.log(e)
    console.log(e.stack)
  }
};
