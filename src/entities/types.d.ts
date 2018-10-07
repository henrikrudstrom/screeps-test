interface FactoryOrder {
  priority: number;
  body: BodyPartConstant[];
  memory: any;
  clientId: string;
}


interface EntityMemory {
  uuid: string;
  type: string;
  //[name: string]: any
}

interface FactoryMemory extends EntityMemory{
  orders: FactoryOrder[];
  spawnId: string;
}
