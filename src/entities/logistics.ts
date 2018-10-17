import { Entity, EntityBase } from "entities/entity";
import { Scheduler } from "os/scheduler";
import { FactoryClient } from "entities/factory";
import { generatePreferenceLists } from "util/stable-marriage";
import { Entities } from "./entities";

export interface ResourceLocation extends Entity {
  location: RoomPosition;
  structureId: string | null;
  incomingHauls(): HaulerTask[];
  outgoingHauls(): HaulerTask[];
  storedResources(resourceType: ResourceConstant) : number;
  miningRate(resourceType: ResourceConstant): number;
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
export enum RequestType {
  Supply,
  Demand
}
export interface ResourceRequest {
  id: string;
  resourceType: ResourceConstant;
  requestType: RequestType;
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

function timeToMove(creep: Creep, from: RoomPosition, to: RoomPosition): number {
  return 1;
}

function selectBuffer(hauler: Creep, request: ResourceRequest, buffers: ResourceBuffer[]) {
  buffers.forEach(buf => {
    if (!buf.canProvide(request.resourceType)) return;
  });
}

function traversalTime(creep: Creep, pathcost: number): number {
  return 1;
}

function createRankingFunction(buffers: ResourceBuffer[]) {
  return function rank(hauler: Creep, request: ResourceRequest): number {};
}

type MatchElement = [string, string, string];
type MatchingSolution = MatchElement[];
interface BufferUsage {
  time: number;
  amount: number;
  resourceType: ResourceConstant;
}
export class LogisticsMatching {
  public haulers: { [name: string]: Creep };
  public requests: { [id: string]: ResourceRequest };
  public buffers: { [id: string]: ResourceBuffer };

  public bestSolution: MatchingSolution;

  public generateNewPermutations(newCreep: string[], newDemand: string[], newSupply: string[]): MatchingSolution[] {
    return [[["1", "2", "3"]]];
  }

  public rateSolution(solution: MatchingSolution) {
    const bufferUsage: { [id: string]: BufferUsage[] } = {};
    const travelTime: number[] = solution.map(elem => this.calculateTiming(elem, bufferUsage));
  }

  public calculateTiming(elem: MatchElement, bufferUsage: { [id: string]: BufferUsage[] }) {
    const [creepName, reqId, bufId] = elem;
    const hauler = this.haulers[creepName];
    let haulerPos = hauler.pos;
    let availableFrom = Game.time;
    if (hauler.memory.task !== undefined) {
      const task = hauler.memory.task as HaulerTask;
      haulerPos = Entities.get<ResourceLocation>(task.deliverEntity).location;
      availableFrom = Game.time + task.deliverTime;
    }
    const request = this.requests[reqId];
    const reqPos = Entities.get<ResourceLocation>(request.requesterId).location;
    const buffer = this.buffers[bufId];

    let travelTime: number;
    let bufferTravelTime: number;
    let amount = Math.min(hauler.carryCapacity, request.amount);

    if (request.requestType === RequestType.Demand) {
      bufferTravelTime = traversalTime(hauler, PathFinder.search(hauler.pos, buffer.location).cost);
      travelTime = bufferTravelTime + traversalTime(hauler, PathFinder.search(buffer.location, reqPos).cost);
      amount *= -1;
    } else {
      travelTime = traversalTime(hauler, PathFinder.search(hauler.pos, reqPos).cost);
      travelTime += traversalTime(hauler, PathFinder.search(reqPos, buffer.location).cost);
      bufferTravelTime = travelTime;
    }

    if (bufferUsage[bufId] === undefined) {
      bufferUsage[bufId] = [];
    }
    bufferUsage[bufId].push({
      time: availableFrom + bufferTravelTime,
      amount,
      resourceType: request.resourceType
    });

    return travelTime;
  }

  public timeUntilResourcesAvailable(
    buffer: ResourceBuffer,
    usages: BufferUsage[],
    arrivalTime: number,
    amount: number,
    resourceType: ResourceConstant
  ) {
    const totalUsage = usages.concat(
      buffer.incomingHauls()
        .map(task => ({ time: task.deliverTime, amount: task.amount, resourceType: task.resourceType })),
      buffer.outgoingHauls()
        .map(task => ({ time: task.deliverTime, amount: task.amount * -1, resourceType: task.resourceType }))
      ).filter(usage => usage.resourceType === resourceType)
      .sort((a, b) => a.time - b.time);
    const resourcesAtArrival = buffer.storedResources(resourceType) + buffer.miningRate(resourceType) + _.sum(totalUsage.filter(usage => usage.time <= arrivalTime), usage.amount)
  }

  public calculateTransportRate(
    elem: MatchElement,
    travelTime: number,
    bufferUsage: { [id: string]: { [id: string]: BufferUsage } }
  ) {}
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
