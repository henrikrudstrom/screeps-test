import { Entity, EntityBase } from 'entities/entity';
import { Scheduler } from 'os/scheduler';
import { FactoryClient } from 'entities/factory';
import { generatePreferenceLists } from 'util/stable-marriage';

export interface ResourceLocation extends Entity {
  location: RoomPosition;
  structureId: string | null;
  incomingHauls(): HaulerTask[];
  outgoingHauls(): HaulerTask[];
}

export interface ResourceBuffer extends ResourceLocation {
  canProvide(resourceType: ResourceConstant): boolean;
  canStore(resourceType: ResourceConstant): boolean;
  estimatedAmount(resourceType: ResourceConstant, time: number): number;
  estimatedCapacity(resourceType: ResourceConstant, time: number): number;
}

export enum TaskState {
  Pickup,
  Deliver,
  Completed,
  Cancelled,
  Aborted
}

export interface HaulerTask {
  resourceType: ResourceConstant;
  amount: number;
  pickupEntity: string;
  deliverEntity: string;
  state: TaskState;
  pickupTime: number;
  deliverTime: number;
}

export interface ResourceRequest {
  id: string;
  resourceType: ResourceConstant;
  amount: number;
  priority: number;
  requesterId: string;
}

interface Position {
  x: number;
  y: number;
}

function distance(a: Position, b: Position): number {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

function totalDistance(positions: Position[]): number {
  let sum = 0;
  for (let i = 0; i < positions.length - 1; i++) {
    sum += distance(positions[i], positions[i + 1]);
  }
  return sum;
}


interface LogisticsMemory extends EntityMemory {
  haulers: string[];
  requests: { [id: string]: ResourceRequest };
  latestMatching: { [haulerName: string]: string };
  nextRequestId: number;
}


function timeToMove(creep: Creep, from: RoomPosition, to: RoomPosition) : number {
  return 1;
}

function selectBuffer(hauler: Creep, request: ResourceRequest, buffers: ResourceBuffer[]){
  buffers.forEach(buf => {
    if(!buf.canProvide(request.resourceType)) return;
  })
}

function createRankingFunction(buffers: ResourceBuffer[]){
  return function rank(hauler: Creep, request: ResourceRequest): number {


  }
}




export class Logistics extends EntityBase implements FactoryClient {
  private memory: LogisticsMemory;

  constructor(memory: EntityMemory) {
    super(memory);
    this.memory = memory as LogisticsMemory;
  }

  public requestResources(requester: ResourceLocation, type: ResourceConstant, amount: number, priority: 1) {
    const id = this.memory.nextRequestId.toString();
    this.memory.nextRequestId += 1;
    this.memory.requests[id] = {
      id,
      resourceType: RESOURCE_ENERGY,
      amount,
      requesterId: requester.uuid,
      priority
    };
  }



  public updateMatching() {
    const creeps = this.memory.haulers.map(name => Game.creeps[name]);
    const prefs = generatePreferenceLists<Creep, ResourceRequest>(
      creeps,
      (creep: Creep) => creep.name,
      _.values(this.memory.requests),
      (req: ResourceRequest) => req.id.toString(),
      this.rank
    );
  }
}
