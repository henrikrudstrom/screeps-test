export abstract class Asset {
  abstract get value(): number;
  abstract get ttl(): number;
  abstract get costPerTick(): number;
}

export class CreepSpecification {
  public cost: number;
  constructor(public body: BodyPartConstant[]){
    this.cost = body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
  }
}

export class CreepAsset extends Asset
{
  public creep: Creep;
  public value: number;
  public costPerTick: number;
  public get ttl(): number { return this.creep.ticksToLive as number };

  constructor(creep: Creep){
    super();
    this.creep = creep;
    this.value = this.creep.body.reduce((cost, part) => cost + BODYPART_COST[part.type], 0);
    this.costPerTick = this.value / CREEP_LIFE_TIME;
  }
}
