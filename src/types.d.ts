// example declaration file - remove these and add your own custom typings
declare const LOG_FATAL = 5
declare const LOG_ERROR = 4
declare const LOG_WARN = 3
declare const LOG_INFO = 2
declare const LOG_DEBUG = 1
declare const LOG_TRACE = 0

type LOG_FATAL = 5
type LOG_ERROR = 4
type LOG_WARN = 3
type LOG_INFO = 2
type LOG_DEBUG = 1
type LOG_TRACE = 0

type LogLevel = LOG_FATAL | LOG_ERROR | LOG_WARN | LOG_INFO | LOG_DEBUG | LOG_TRACE

interface Global {
  DEFAULT_PRIORITY: number;
}
// memory extension samples
interface CreepMemory {
  role: string;
  [name: string]: any
}

interface Memory {
  uuid: number;
  log: any;
  harvestingSites: {
    [id: string]: HarvestingSiteMemory
  }
  creepFactories: {
    [id: string]: CreepFactoryMemory
  }
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
