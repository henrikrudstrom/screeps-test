// import { Entities } from "./entities";
// import { Factory } from "./factory";
// import { Logistics } from "./logistics";
// import * as calculate from "util/creep-calculate"
//
// interface Oppurtunity {
//   roi: number;
//   risk: number;
//   spec: any;
// }
//
// interface HarvesterSpec {
//   body: BodyPartConstant[];
//   cost: number;
//   harvestingRate: number;
// }
//
// function designHarvester(baseBody: BodyPartConstant[], add: BodyPartConstant[], maxCost: number, maxHarvestingRate: number): HarvesterSpec{
//   let body: BodyPartConstant[] = [];
//   let nextBody: BodyPartConstant[] = baseBody;
//   let cost = calculate.energyCost(nextBody);
//   let harvestingRate = calculate.harvestingSpeed(nextBody)
//   while(cost < maxCost && harvestingRate <= maxHarvestingRate + harvestingRate % 2){
//     body = nextBody;
//     nextBody = nextBody.concat(add);
//     cost = calculate.energyCost(nextBody);
//     harvestingRate = calculate.harvestingSpeed(nextBody)
//   }
//   return {
//     body, cost, harvestingRate
//   }
// }
//
//
// class HarvestingCompany extends Entity {
//   public source: Source;
//   public harvesters: Harvester[];
//
//
//   public get harvestingRate(): number {
//     return Math.min(_(this.harvesters).sum((h: Harvester) => h.harvestingRate), this.maxHarvestingRate;
//   }
//
//   public get maxHarvestingRate(): number {
//     return this.source.energyCapacity / ENERGY_REGEN_TIME;
//   }
//
//
//
//   public findOppurtunities() : Oppurtunity[] {
//     if (this.harvestingRate >= this.maxHarvestingRate) {
//       return [];
//     }
//     const remainingHarvestingRate = this.maxHarvestingRate - this.harvestingRate;
//     const factory = Entities.find(Factory)[0];
//     let spec = null
//     if(_.sum(Entities.find(Logistics), ent => ent.calculateHaulRate()) > 0){
//       spec = designHarvester([MOVE, WORK], [WORK], factory.energyCapacity, remainingHarvestingRate);
//     }
//     else {
//       spec = designHarvester([MOVE, WORK, CARRY], [WORK], factory.energyCapacity, remainingHarvestingRate);
//     }
//     const rateImprovement = Math.min(remainingHarvestingRate, spec.harvestingRate);
//     const roi = rateImprovement * CREEP_LIFE_TIME - spec.cost;
//
//     return [{
//       roi, risk: 0, spec
//     }];
//   }
//
//
//   public tick(){
//
//   }
// }
