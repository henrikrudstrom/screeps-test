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
  public time = 0;
  public cpu = new MockCPU();
  public rooms = {};
  public getObjectById(id: string){
    return null;
  }
  public creeps = {};
  public tick(): void {
    this.time += 1;
  }
}


export function initGame(){
  (global as any).Game = new MockGame();
  (global as any).Memory = {};
}
