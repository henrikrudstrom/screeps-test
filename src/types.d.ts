// example declaration file - remove these and add your own custom typings

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
