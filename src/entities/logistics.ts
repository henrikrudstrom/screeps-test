import { Entity } from "./entity";
import { Scheduler } from "os/scheduler";

export class Logistics extends Entity {
  //public haulers: HaulerAsset[];

  public Logistics(memory: EntityMemory, scheduler?: Scheduler){

  }

  public calculateHaulRate(): number {
    return 0
    // _(this.haulers)
    //   .sum((hauler: HaulerAsset) => hauler.haulRate)
  }
  public totalIdleRatio(): number{
    //return _(this.haulers).sum((hauler) => hauler.idleRatio);
  }

  // public estimateTransportNeed(){
  //   return _(Phonebook.instance.find(HarvestingCompany)).sum((hc: HarvestingCompany) => hc.harvestingRate);
  // }

  public tick(){
    // const totalHaulerRate = _(Phonebook.instance.find(Logistics))
    //   .sum((log: Logistics) => log.calculateHaulRate())
    // if(this.estimateTransportNeed() > 0 && totalHaulerRate === 0){
    //   this.acquireHauler();
    // }
    // else if(this.haulers.length > 0 && this.totalIdleRatio() < 0.01) {
    //   this.acquireHauler();
    // }

  }

  private acquireHauler(){

  }

}
