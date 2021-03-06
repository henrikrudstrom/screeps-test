// example declaration file - remove these and add your own custom typings

// interface Global {
//   DEFAULT_PRIORITY: number;
// }
// memory extension samples


interface Pos {
  x: number;
  y: number;
}

interface CreepMemory {
  role: string;
  pid: number;
  [name: string]: any
}

interface Memory {
  uuid: number;
  log: any;
  kernel: KernelMemory
  scheduler: SchedulerMemory
  entities: { [id: string]: EntityMemory }
  [name: string]: any;
}

//interface FlagMemory {}
//interface RoomMemory {}
// interface SpawnMemory {
// }


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
