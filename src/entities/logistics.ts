import { Entity } from "entities/entity";
import { Scheduler } from "os/scheduler";
import { FactoryClient } from "entities/factory";


export interface ResourceRequestMemory {
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


function ranks(hauler: Hauler, requests: Request[], buffers: Buffer[]){
  const dist = _.min(_.map(buffers, buf => {
    const points = [hauler.pos, buf.pos].concat(_.map(requests, req => req.pos))
    return totalDistance(points)
  }));
  const amt = Math.min(hauler.capacity, _.sum(requests, req => req.quantity));
  return amt / dist;
}



interface LogisticsMemory {
  haulers: string[];
  requests: ResourceRequestMemory[];
  latestMatching: { [haulerName: string]: string }
}

export class Logistics extends Entity implements FactoryClient{


  public Logistics(memory: EntityMemory, scheduler?: Scheduler){

  }


}
