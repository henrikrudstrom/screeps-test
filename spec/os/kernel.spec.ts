

import { expect } from 'chai';
import mocha from 'mocha';
import {initGame} from "../mocks/global";
import { Kernel } from "os/kernel";
import { Process } from 'os/process';
import { Programs} from "os/programs"
import { setLogLevel } from "os/logger"


setLogLevel('warn', 'kernel');

class TestProcess extends Process {
  public main(): void {
    Memory.hits.push('test')
  }
}

class SleepyProcess extends Process {
  public main(): void {
    if(Game.time === 2){
      this.sleep(2);
    } else {
      Memory.hits.push('sleepy'+Game.time)
    }
  }
}

class ParentProcess extends Process {
  public main(): void {
    if(Memory.hits.length === 2){
      this.launchChildProcess('child', 'ChildProcess', {})
      this.sleep();
    } else if(Memory.hits.length === 6){
      this.suicide();
    }
    else {
      Memory.hits.push('parent'+Game.time)
    }
  }
}

class ChildProcess extends Process {
  public main(): void {
    if(Memory.hits.length >= 4){
      this.suicide();
      this.wakeParent();
    } else {
      Memory.hits.push('child'+Game.time);
    }
  }
}

Programs.register(TestProcess)
Programs.register(ParentProcess)
Programs.register(ChildProcess)
Programs.register(SleepyProcess)




describe('Kernel', () => {
  beforeEach((done) => {
    initGame();
    (Memory as any).hits = [];
    done();
  });

  it('should run a simple process', () => {
    const kernel = new Kernel();
    Memory.hits = []
    for(let i = 0; i < 2; i++){
      kernel.start("TestProcess");
      kernel.run()
      kernel.shutdown();
    }

    expect(Memory.hits).to.eql(['test', 'test'])
  });

  it('should be able to put a process to sleep', (done) => {
    const kernel = new Kernel();
    for(let i = 0; i < 7; i++){
      kernel.start("SleepyProcess");
      kernel.run();
      kernel.shutdown();
      Game.time += 1;
    }

    expect(Memory.hits).to.eql(['sleepy0', 'sleepy1', 'sleepy5', 'sleepy6'])
    done();
  });

  it('should run parent with child process', (done) => {
    const kernel = new Kernel();
    for(let i = 0; i < 8; i++){
      kernel.start("ParentProcess");
      kernel.run();
      kernel.shutdown();
      Game.time += 1;
    }

    expect(Memory.hits).to.eql(['parent0', 'parent1', 'child2', 'child3', 'parent4', 'parent5'])
    done();
  });

});
