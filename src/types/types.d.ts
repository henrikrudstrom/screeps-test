// example declaration file - remove these and add your own custom typings

// interface Global {
//   DEFAULT_PRIORITY: number;
// }
// memory extension samples

interface ProcessesMemory {
  index: {[pid: number]: ProcessMemory};
  running: null | number;
  completed: number[];
  queues: number[][];
  sleep: SleepingProcessesMemory;
  hitwall: boolean;
}

interface SleepingProcessesMemory {
  newProcesses: number[];
  list: number[];
  nextCheck: number | null;
}

interface SchedulerMemory {
  processes: ProcessesMemory;
  lastPid: number;
}

interface ProcessMemory {
  n: string
  d: any;
  p: number | null;
}

interface KernelMemory{
  gc: number
  lastBuildBucket: number
  buildBucket: boolean
}


interface CreepMemory {
  role: string;
  [name: string]: any
}

interface Memory {
  uuid: number;
  log: any;
  kernel: KernelMemory
  scheduler: SchedulerMemory
}

interface CreepFactoryMemory {
  spawnName: string;
  queue: CreepFactoryOrderMemory[];
}

interface CreepFactoryOrderMemory {
  body: BodyPartConstant[];
  memory: CreepMemory;
  clientUUID: string;
}

type INACTIVE = "inactive";
type INITIAL_BOOTSTRAP = "initial bootstrap";
type NORMAL_OPERATION = "normal operation";

type HarvestingSiteState =
  INACTIVE | INITIAL_BOOTSTRAP | NORMAL_OPERATION

interface HarvestingSiteMemory {
  sourceId: string;
  spots: HarvestingSpotMemory[];
  state: HarvestingSiteState  ;
}

interface HarvestingSpotMemory {
  x: number;
  y: number;
  creepName: string|null;
  reserved: boolean;
}



// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
