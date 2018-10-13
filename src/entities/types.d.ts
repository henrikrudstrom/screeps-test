interface FactoryOrder {
  priority: number;
  body: BodyPartConstant[];
  memory: any;
  clientId: string;
  creepName: string | undefined
}


interface EntityMemory {
  uuid: string;
  type: string;
  //[name: string]: any
}

interface FactoryMemory extends EntityMemory{
  orders: FactoryOrder[];
  currentOrder: FactoryOrder | undefined;
  spawnId: string;
  rootPid: number;
}

interface HarvestingSiteSpotMemory {
  x: number;
  y: number;
  creep: string | null;
}

interface HarvestingSiteMemory extends EntityMemory {
  harvesters: string[];
  sourceId: string;
  rootPid: number;
  spots: HarvestingSiteSpotMemory[];

}
