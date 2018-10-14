import { Entity } from "./entity";
import { Scheduler } from "os/scheduler";


export interface ResourceRequest {
  type: Resource,
  amount: number,
  priority: number,
  pos: {
    x: number,
    y: number,
    room: string
  }
}

export interface HaulerTask {
  type: Resource,
  amount: number
  pickup: {
    x: number,
    y: number,
    room: string
  }
  deliver: {
    x: number,
    y: number,
    room: string
  }
}

export function MatchOrders(resourceFlows: ResourceFlow[], creeps: Creep[]) {




}

interface Position {
  x: number,
  y: number
}

function distance(a: Position, b: Position): number{
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

function totalDistance(positions: Position[]) : number {
  let sum = 0
  for(let i = 0; i < positions.length - 1; i++){
    sum += distance(positions[i], positions[i+1])
  }
  return sum;
}

interface Hauler {
  capacity: number,
  pos: Position,
}

interface Request {
  quantity: number
  pos: Position,
}

interface Buffer {
  pos: Position
}

function ranks(hauler: Hauler, requests: Request[], buffers: Buffer[]){
  const dist = _.min(_.map(buffers, buf => {
    const points = [hauler.pos, buf.pos].concat(_.map(requests, req => req.pos))
    return totalDistance(points)
  }));
  const amt = Math.min(hauler.capacity, _.sum(requests, req => req.quantity));
  return amt / dist;
}



export class Matching<TM, TW> {
  private _menPrefs: { [man: string]: string[] } = {};
  private _womenPrefs:{ [woman: string]: string[] } = {};
  private _womenFree: {[woman: string]: boolean} = {};
  private matchings: { [man: string]: string } = {};

  constructor(public men: TM[], manKey: (man: TM) => string, public women: TW[], womanKey: (woman: TW) => string, public rank: (man: TM, woman: TW) => number){
    const score: number[][] = [];
    for(let m = 0; m < men.length; m++){
      const row: number[] = [];
      for(let w = 0; w < women.length; w++){
        row.push(rank(men[m], women[w]))
      }
      score.push(row);
      this._menPrefs[manKey(men[m])] = _.sortBy(_.range(women.length), i => row[i]).map(i => manKey(men[i]));
    }
    for(let w = 0; w < women.length; w++){
      this._womenPrefs[womanKey(women[w])] = _.sortBy(_.range(men.length), i => score[i][w]).map(i => womanKey(women[i]));
      this._womenFree[womanKey(women[w])] = true;
    }
  }

  private prefers(woman: string, man1: string, man2: string): boolean {
  		return _.indexOf(this._womenPrefs[woman], man1) < _.indexOf(this._womenPrefs[woman], man2);
  }

  private engage(man: string, woman: string): void {
  		_.remove(this._menPrefs[man], w => w === woman); // Remove the woman that the man proposed to
      this._womenFree[woman] = false;
  		// Don't remove from women prefs since we're matching from men side
  		this.matchings[man] = woman;
  	}

  	/* Break up a couple... </3 :'( */
  	private breakup(man: string, woman: string): void {
      this._womenFree[woman] = true;
  		// Don't do anything to the preferences of men or women since they've already proposed
  		delete this.matchings[man];
  	}

  	/* Return the first free man who still has someone left to propose to */
  	private nextMan(): string | undefined {
  		return _.find(_.keys(this._menPrefs), man => this.matchings[man] === undefined && this._menPrefs[man].length > 0);
  }


  public match(){
    const MAX_ITERATIONS = 1000;
		let count = 0;
		let man = this.nextMan();
		while (man) { // While there exists a free man who still has someone to propose to
			if (count > MAX_ITERATIONS) {
				console.log('Stable matching timed out!');
				return this.matchings;
			}
			const woman = _.first(this._menPrefs[man]); 		// Get first woman on man's list
			if (this._womenFree[woman]) {					// If woman is free, get engaged
				this.engage(man, woman);
			} else {										// Else if woman prefers this man to her current, swap men
				const currentMan = _.findKey(this.matchings, w => w === woman);
				if (this.prefers(woman, man, currentMan)) {
					this.breakup(currentMan, woman);
					this.engage(man, woman);
				} else {
					_.remove(this._menPrefs[man], w => w === woman);	// Record an unsuccessful proposal
				}
			}
			man = this.nextMan();
			count++;
		}
    return this.matchings;
  }
}



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
