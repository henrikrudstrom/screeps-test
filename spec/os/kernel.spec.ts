class MockCPU {
  public limit = 100;
  public tickLimit = 500;
  public bucket = 10000;
  getHeapStatistics(){
    return undefined;
  }
  getUsed() {
    return 10;
  }
}

class MockGame {
  time = 10;
  cpu = new MockCPU();
}
(global as any).Game = new MockGame();
(global as any).Memory = {};

import { expect } from 'chai';
import 'mocha';
import {Kernel} from "os/kernel";



describe('Kernel', () => {

  it('initialize without error', () => {
    const kernel = new Kernel();
    kernel.start();
    kernel.shutdown();
  });

});
