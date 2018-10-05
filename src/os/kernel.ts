import { Process } from "./process";
import { Scheduler } from "./scheduler";
import { createLogger } from "os/logger";
const BUCKET_EMERGENCY = 1000;
const BUCKET_FLOOR = 2000;
const BUCKET_CEILING = 9500;
const BUCKET_BUILD_LIMIT = 15000;
const CPU_BUFFER = 130;
const CPU_MINIMUM = 0.3;
const CPU_ADJUST = 0.05;
const CPU_GLOBAL_BOOST = 60;
const MINIMUM_PROGRAMS = 0.3;
const PROGRAM_NORMALIZING_BURST = 2;
const RECURRING_BURST = 1.75;
const RECURRING_BURST_FREQUENCY = 25;
const MIN_TICKS_BETWEEN_GC = 20;
const GC_HEAP_TRIGGER = 0.85;
const GLOBAL_LAST_RESET = Game.time;
const IVM = typeof Game.cpu.getHeapStatistics === "function" && Game.cpu.getHeapStatistics();

const logger = createLogger("kernel")

export class Kernel {
  public static instance: Kernel;
  public scheduler: Scheduler;
  private newglobal: boolean;
  private simulation: boolean;
  //performance: any;
  private process: typeof Process;
  private _cpuLimit: any;

  constructor() {
    if (!Memory.kernel) {
      Memory.kernel = {};
    }
    this.scheduler = new Scheduler();
    Kernel.instance = this;


    this.newglobal = GLOBAL_LAST_RESET === Game.time;
    this.simulation = !!Game.rooms.sim;
    this.scheduler = new Scheduler();
    //this.performance = new Performance()
    this.process = Process;
  }

  public start(): void {
    if (IVM) {
      logger.verbose(`Initializing Kernel for tick ${Game.time} with IVM support`);
    } else {
      logger.verbose(`Initializing Kernel for tick ${Game.time}`);
    }

    // Announce new uploads
    // if (!Memory.kernel.script_version || Memory.kernel.script_version !== SCRIPT_VERSION) {
    //   Logger.log(`New script upload detected: ${SCRIPT_VERSION}`, LOG_WARN)
    //   Memory.kernel.script_version = SCRIPT_VERSION
    //   Memory.kernel.script_upload = Game.time
    //   this.performance.clear()
    // }

    if (this.newglobal) {
      logger.info(`New Global Detected`);
    }

    if (
      IVM &&
      global.gc &&
      (!Memory.kernel.gc || Game.time - Memory.kernel.gc >= MIN_TICKS_BETWEEN_GC) &&
      Game.cpu.getHeapStatistics !== undefined
    ) {
      const heap = Game.cpu.getHeapStatistics() as HeapStatistics;
      const heapPercent = heap.total_heap_size / heap.heap_size_limit;
      if (heapPercent > GC_HEAP_TRIGGER) {
        logger.info(`Garbage Collection Initiated`);
        Memory.kernel.gc = Game.time;
        global.gc();
      }
    }

    // sos.lib.segments.moveToGlobalCache()
    // sos.lib.stormtracker.track()
    //
    // if (sos.lib.stormtracker.isStorming()) {
    //   Logger.log(`Reset Storm Detected`, LOG_INFO)
    // }

    if (Game.time % 7 === 0) {
      this.cleanMemory();
    }

    this.scheduler.wakeSleepingProcesses();
    this.scheduler.shift();

    if (this.scheduler.getProcessCount() <= 0) {
      this.scheduler.launchProcess("player");
    }
  }

  public cleanMemory() {
    logger.verbose("Cleaning memory");
    let i;
    for (i in Memory.creeps) {
      // jshint ignore:line
      if (!Game.creeps[i]) {
        delete Memory.creeps[i];
      }
    }

    // sos.lib.cache.clean()
    // qlib.notify.clean()
  }
  public run () {
    while (this.shouldContinue()) {
      const runningProcess = this.scheduler.getNextProcess()
      if (!runningProcess) {
        return
      }
      try {
        let processName = runningProcess.name
        const descriptor = runningProcess.getDescriptor()
        if (descriptor) {
          processName += ' ' + descriptor
        }

        logger.verbose(`Running ${processName} (pid ${runningProcess.pid})`)
        const startCpu = Game.cpu.getUsed()
        runningProcess.run()
        let performanceName = runningProcess.name
        const performanceDescriptor = runningProcess.getPerformanceDescriptor()
        if (performanceDescriptor) {
          performanceName += ' ' + performanceDescriptor
        }
        //this.performance.addProgramStats(performanceName, Game.cpu.getUsed() - startCpu)
      } catch (err) {
        const errorText = !!err && !!err.stack ? err.stack : err.toString()
        if (errorText.includes('RangeError: Array buffer allocation failed')) {
          const message = 'RangeError: Array buffer allocation failed'
          logger.error(message)
        } else {
          let message = 'program error occurred\n'
          message += `process ${runningProcess.pid}: ${runningProcess.name}\n`
          message += errorText
          logger.error(message)
        }
      }
    }
  }
  public sigmoid (x: number): number {
    return 1.0 / (1.0 + Math.exp(-x))
  }

  public sigmoidSkewed (x: number): number {
    return this.sigmoid((x * 12.0) - 6.0)
  }

  public shouldContinue () : boolean {
    if (this.simulation) {
      return true
    }

    // If the bucket has dropped below the emergency level enable the bucket rebuild functionality.
    if (Game.cpu.bucket <= BUCKET_EMERGENCY) {
      if (!Memory.kernel.last_build_bucket || (Game.time - Memory.kernel.last_build_bucket) > BUCKET_BUILD_LIMIT) {
        Memory.kernel.build_bucket = true
        Memory.kernel.last_build_bucket = Game.time
        return false
      }
    }

    // If the bucket rebuild flag is set don't run anything until the bucket has been reset.
    if (Memory.kernel.build_bucket) {
      if (Game.cpu.bucket >= BUCKET_CEILING) {
        delete Memory.kernel.build_bucket
      } else {
        return false
      }
    }

    // Make sure to stop if cpuUsed has hit the maximum allowed cpu.
    const cpuUsed = Game.cpu.getUsed()
    if (cpuUsed >= Game.cpu.tickLimit - CPU_BUFFER) {
      return false
    }

    // Allow if the cpu used is less than this tick's limit.
    const cpuLimit = this.getCpuLimit()
    if (cpuUsed < cpuLimit) {
      return true
    }

    // Ensure that a minumum number of processes runs each tick.
    // This is primarily useful for garbage collection cycles.
    if (Game.cpu.bucket > BUCKET_FLOOR) {
      const total = this.scheduler.getProcessCount()
      const completed = this.scheduler.getCompletedProcessCount()
      if (completed / total < MINIMUM_PROGRAMS) {
        if (cpuUsed < cpuLimit * PROGRAM_NORMALIZING_BURST) {
          return true
        }
      }
    }
    return false;
  }

  public getCpuLimit (): number {
    if (Game.cpu.bucket > BUCKET_CEILING) {
      return Math.min(Game.cpu.tickLimit - CPU_BUFFER, Game.cpu.bucket * 0.05)
    }

    if (Game.cpu.bucket < BUCKET_EMERGENCY) {
      return 0
    }

    if (Game.cpu.bucket < BUCKET_FLOOR) {
      return Game.cpu.limit * CPU_MINIMUM
    }

    if (!this._cpuLimit) {
      const bucketRange = BUCKET_CEILING - BUCKET_FLOOR
      const depthInRange = (Game.cpu.bucket - BUCKET_FLOOR) / bucketRange
      const minToAllocate = Game.cpu.limit * CPU_MINIMUM
      const maxToAllocate = Game.cpu.limit
      this._cpuLimit = (minToAllocate + this.sigmoidSkewed(depthInRange) * (maxToAllocate - minToAllocate)) * (1 - CPU_ADJUST)
      if (this.newglobal) {
        this._cpuLimit += CPU_GLOBAL_BOOST
      } else if (RECURRING_BURST_FREQUENCY && Game.time % RECURRING_BURST_FREQUENCY === 0) {
        this._cpuLimit *= RECURRING_BURST
      }
    }

    return this._cpuLimit
  }

  public shutdown () {
    // sos.lib.vram.saveDirty()
    // sos.lib.segments.process()

    const processCount = this.scheduler.getProcessCount()
    const completedCount = this.scheduler.memory.processes.completed.length

    if (Memory.userConfig && Memory.userConfig.terseConsole) {
      let message = ''
      message += `PS: ${_.padLeft(`${completedCount}/${processCount}`, 7)}`
      message += `, TL: ${_.padLeft(Game.cpu.tickLimit.toString(), 3)}`
      message += `, KL: ${_.padLeft(this.getCpuLimit().toString(), 3)}`
      message += `, CPU: ${_.padLeft(Game.cpu.getUsed().toFixed(5), 8)}`
      message += `, B: ${_.padLeft(Game.cpu.bucket.toString(), 5)}`

      if (IVM && Game.cpu.getHeapStatistics !== undefined) {
        const heap = Game.cpu.getHeapStatistics()
        const heapPercent = Math.round((heap.total_heap_size / heap.heap_size_limit) * 100)
        const sizeMB = heap.total_heap_size >> 20
        const limitMB = heap.heap_size_limit >> 20
        message += `, H: ${_.padLeft(heapPercent.toString(), 2)}% ${_.padLeft(`(${sizeMB}/${limitMB}MB)`, 11)}`
      }
      logger.info(message)
    } else {
      logger.info(`Processes Run: ${completedCount}/${processCount}`)
      logger.info(`Tick Limit: ${Game.cpu.tickLimit}`)
      logger.info(`Kernel Limit: ${this.getCpuLimit()}`)
      logger.info(`CPU Used: ${Game.cpu.getUsed()}`)
      logger.info(`Bucket: ${Game.cpu.bucket}`)

      if (IVM && Game.cpu.getHeapStatistics !== undefined) {
        const heap = Game.cpu.getHeapStatistics()
        const heapPercent = Math.round((heap.total_heap_size / heap.heap_size_limit) * 100)
        logger.info(`Heap Used: ${heapPercent}% (${heap.total_heap_size} / ${heap.heap_size_limit})`)
      }
    }

    // if (Game.time % 50 === 0) {
    //   this.performance.reportHtml()
    // }
    // if (Game.time % 3000 === 0) {
    //   this.performance.clear()
    // }
  }
}
