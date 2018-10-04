import {Kernel} from "./kernel";

export abstract class Process {
  public priority: number = global.DEFAULT_PRIORITY;
  constructor (public pid: number, public name: string, public data: any, public parent: number | null) {

  }

  public clean () {
    if (this.data.children) {
      let label
      for (label in this.data.children) { // jshint ignore:line
        if (!Kernel.instance.scheduler.isPidActive(this.data.children[label])) {
          delete this.data.children[label]
        }
      }
    }

    if (this.data.processes) {
      let label
      for (label in this.data.processes) { // jshint ignore:line
        if (!Kernel.instance.scheduler.isPidActive(this.data.processes[label])) {
          delete this.data.processes[label]
        }
      }
    }
  }

  public getDescriptor(): boolean{
    return false
  }

  public getPerformanceDescriptor(): boolean {
    return false
  }

  public launchChildProcess (label: string, name: string, data = {}) {
    if (!this.data.children) {
      this.data.children = {}
    }
    if (this.data.children[label]) {
      return true
    }
    this.data.children[label] = Kernel.instance.scheduler.launchProcess(name, data, this.pid)
    return this.data.children[label]
  }

  public getChildProcessPid (label: string) {
    if (!this.data.children) {
      return false
    }
    if (!this.data.children[label]) {
      return false
    }
    return this.data.children[label]
  }

  public isChildProcessRunning (label: string) {
    const pid = this.getChildProcessPid(label)
    if (!pid) {
      return false
    }
    return Kernel.instance.scheduler.isPidActive(pid)
  }

  public launchProcess (label: string, name: string, data = {}) {
    if (!this.data.processes) {
      this.data.processes = {}
    }

    if (this.data.processes[label]) {
      return true
    }
    this.data.processes[label] = Kernel.instance.scheduler.launchProcess(name, data)
    return this.data.processes[label]
  }

  public getProcessPid (label: string) {
    if (!this.data.processes) {
      return false
    }
    if (!this.data.processes[label]) {
      return false
    }
    return this.data.processes[label]
  }

  public isProcessRunning (label: string) {
    const pid = this.getProcessPid(label)
    if (!pid) {
      return false
    }
    return Kernel.instance.scheduler.isPidActive(pid)
  }

  // public launchCreepProcess (label: string, role: string, roomname: string, quantity = 1, options = {}) {
  //   const room = Game.rooms[roomname]
  //   if (!room) {
  //     return false
  //   }
  //   if (!this.data.children) {
  //     this.data.children = {}
  //   }
  //   let x
  //   for (x = 0; x < quantity; x++) {
  //     const specificLabel = label + x
  //     if (this.data.children[specificLabel]) {
  //       continue
  //     }
  //     const creepName = room.queueCreep(role, options)
  //     this.launchChildProcess(specificLabel, 'creep', {
  //       'creep': creepName
  //     })
  //   }
  // }

  public period (interval: number, label = 'default') : boolean{
    if (!this.data.period) {
      this.data.period = {}
    }

    const lastRun = this.data.period[label] || 0
    if (lastRun < Game.time - interval) {
      this.data.period[label] = Game.time
      return true
    }

    return false
  }

  public sleep (ticks: number) {
    Kernel.instance.scheduler.sleep(this.pid, ticks, true)
  }

  public suicide () {
    return Kernel.instance.scheduler.kill(this.pid)
  }

  public run () {
    this.clean()
    this.main()
  }

  public abstract main() : void;
}
