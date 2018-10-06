class MockCPU {
  public limit = 100;
  public tickLimit = 500;
  public bucket = 10000;
  public getHeapStatistics(): object | undefined{
    return undefined;
  }
  public getUsed(): number {
    return 10;
  }
}

class MockGame {
  public time = 10;
  public cpu = new MockCPU();
  public rooms = {};
}
(global as any).Game = new MockGame();
(global as any).Memory = {};

import { expect } from 'chai';
//import mocha from 'mocha';
import { Kernel } from "os/kernel";
import { Process, Programs } from 'os/process';


class TestProcess extends Process {
  public main(): void {
    console.log("Test run")
  }
}
Programs.register("test", TestProcess)

describe('Kernel', () => {

  it('initialize without error', () => {
    const kernel = new Kernel();
    kernel.start("test");
    kernel.run()
    kernel.shutdown();
  });

});
