import { Kernel } from "os/kernel";
import { Entities } from "entities/entities";
import { ErrorMapper } from "os/error-mapper";
import { Process } from "os/process";
import { testFunction } from "./test-process";

export class TestProcess extends Process {
  public main(): void {
    this.data.started = true;
    testFunction(() => {
      this.data.done = true;
    });
  }
}

export const loop = ErrorMapper.wrapLoop(() => {
  const kernel = new Kernel();
  kernel.start("RootProcess");
  Entities.init();
  kernel.run();
  kernel.shutdown();
});
