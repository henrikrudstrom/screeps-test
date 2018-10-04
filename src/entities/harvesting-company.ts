abstract class HarvesterSpecification extends CreepSpecification {
  public harvestingRate: number;
}

class DropHarvesterSpecification extends HarvesterSpecification {
  constructor(maxEnergyCost: number, requiredHarvestingRate: number){
    const body = [MOVE, WORK]
    while(utils.creepCost(body) < maxEnergyCost && utils.harvestingRate(body) < requiredHarvestingRate){
      body.push(WORK);
    }
    super(body);
  }
}

abstract class Harvester extends CreepAsset {
  public harvestingRate: number;
}

class DropHarvester extends CreepAsset {

}

class HaulingHarvester extends CreepAsset {
  public dropOffSite: Structure | RoomPosition;
}

class HarvestingCompany extends Entity {

  public source: Source;
  public harvesters: Harvester[];
  public get harvestingRate(): number {
    return Math.min(_(this.harvesters).sum((h: Harvester) => h.harvestingRate), this.maxHarvestingRate;
  }
  public get maxHarvestingRate(): number {
    return this.source.energyCapacity / ENERGY_REGEN_TIME;
  }



  public tick(){
    if (this.harvestingRate < this.maxHarvestingRate){
      const factory = Phonebook.instance.find(Factory, this.source.pos)[0];
      const diff = this.maxHarvestingRate - this.harvestingRate;
      const spec = new DropHarvesterSpecification(factory.energyCapacity, this.maxHarvestingRate - this.harvestingRate);
      const rateImprovement = Math.min(diff, spec.harvestingRate);
      const returnOnInvestment = rateImprovement * CREEP_LIFE_TIME - spec.cost;
    }
  }
}
