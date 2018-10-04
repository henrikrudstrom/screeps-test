import {CreepAsset, CreepSpecification} from "./asset";
import {Phonebook} from "./phonebook"
import * as utils from "./utils";
export class Entity {
  public credits: number = 0;
  constructor(public uuid: string){}

}


class HaulerAsset extends CreepAsset {
  public haulSpeed: number;
  public moveSpeed: number;
  public carryCapacity: number;
  public idleRatio: number;
  public get haulRate(): number {
    return this.carryCapacity * (this.haulSpeed + this.moveSpeed) / 2;
  }

}

class Logistics extends Entity {
  public haulers: HaulerAsset[];
  public calculateHaulRate(): number {
    return _(this.haulers)
      .sum((hauler: HaulerAsset) => hauler.haulRate)
  }
  public totalIdleRatio(): number{
    return _(this.haulers).sum((hauler) => hauler.idleRatio);
  }

  public estimateTransportNeed(){
    return _(Phonebook.instance.find(HarvestingCompany)).sum((hc: HarvestingCompany) => hc.harvestingRate);
  }

  public tick(){
    const totalHaulerRate = _(Phonebook.instance.find(Logistics))
      .sum((log: Logistics) => log.calculateHaulRate())
    if(this.estimateTransportNeed() > 0 && totalHaulerRate === 0){
      this.acquireHauler();
    }
    else if(this.haulers.length > 0 && this.totalIdleRatio() < 0.01) {
      this.acquireHauler();
    }

  }

  private acquireHauler(){

  }

}
