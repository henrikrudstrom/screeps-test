interface ProcessesMemory {
  index: {[pid: number]: ProcessMemory};
  running: null | number;
  completed: number[];
  queues: number[][];
  sleep: SleepingProcessesMemory;
  hitwall: boolean;
}

interface SleepingProcessesMemory {
  newProcesses: number[];
  list: number[];
  nextCheck: number | null;
}

interface SchedulerMemory {
  processes: ProcessesMemory;
  lastPid: number;
}

interface ProcessMemory {
  n: string
  d: any;
  p: number | null;
}

interface KernelMemory{
  gc: number
  lastBuildBucket: number
  buildBucket: boolean
}
