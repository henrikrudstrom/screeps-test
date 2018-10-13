// import { Entities } from "./entities";
// import { Factory } from "./factory";
// import { Logistics } from "./logistics";
// import * as calculate from "util/creep-calculate";
import { Entity } from "./entity";
import { Scheduler } from "os/scheduler";
import { Process } from "os/process";
import { FactoryClient, Factory } from "./factory";
import { Entities } from "./entities";
import { HarvesterProcess } from "roles/harvester";
import { BootstrapHarvesterProcess } from "roles/bootstrap-harvester";
import { Programs } from "os/programs";
import { createLogger } from "os/logger";

const logger = createLogger("harvesting-site");

export class HarvestingSite extends Entity implements FactoryClient {
  public source: Source | null;
  public memory: HarvestingSiteMemory;

  public static create(source: Source) {
    const id = `harvestingsite-${source.id}`;

    const spots = source.room
      .lookAtArea(source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true)
      .filter(res => res.type === "terrain" && res.terrain === "plain")
      .map(res => ({ x: res.x, y: res.y, creepName: null }));


    Entities.create(id, HarvestingSite, { sourceId: source.id, harvesters: [], spots });
    logger.info(`Harvesting-Site uuid: ${id} created.`);
    return id;
  }

  public static start(uuid: string, parentProcess: Process): number {
    const pid = parentProcess.launchChildProcess(`${uuid}-root`, HarvestingSiteProcess, { uuid });
    Entities.get<HarvestingSite>(uuid).memory.rootPid = pid;
    logger.info(`Harvesting-Site process started pid: ${pid}`);
    return pid;
  }

  public constructor(memory: EntityMemory, scheduler?: Scheduler) {
    super(memory, scheduler);
    this.memory = memory as HarvestingSiteMemory;
    this.source = Game.getObjectById(this.memory.sourceId);
  }

  public orderCompleted(order: FactoryOrder): void {
    if(order.creepName !== undefined){
      logger.info(`order completed, creep ${order.creepName} assigned to harvesting site ${this.uuid}`)
      this.memory.harvesters.push(order.creepName);
    }
  }
}

Entities.registerType(HarvestingSite);

export class HarvestingSiteProcess extends Process {
  public main(): void {
    const site = Entities.get<HarvestingSite>(this.data.uuid);

    for (const creepName of site.memory.harvesters) {
      const creep = Game.creeps[creepName];
      if (creep.memory.pid !== undefined) {
        continue;
      }
      logger.info(`Unassigned creep found: ${creepName}`)
      if(creep.memory.role === 'harvester'){
        const spot = site.memory.spots.filter(s => s.creep === null)[0]
        if(spot === undefined) {
          throw new Error("got harvester but no spot!");
        }
        const pid = HarvesterProcess.Start(this, creep, site.memory.sourceId, spot.x, spot.y)
        logger.info(`creep assigned as 'Harvester' and running under pid ${pid}`);
        spot.creep = creep.name;
      }
      if(creep.memory.role === 'bootstrap-harvester'){
        const factory = Entities.find(Factory)[0];
        const pid = BootstrapHarvesterProcess.Start(this, creep, site.memory.sourceId, factory.memory.spawnId);
        logger.info(`Creep assigned as 'BootstrapHarvester' and running under pid ${pid}`);
      }
    }
  }
}

Programs.register(HarvestingSiteProcess);
