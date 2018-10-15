import { Process } from "os/process";
import { Scheduler } from "os/scheduler";

export declare type ProcessConstructor = new (scheduler: Scheduler, pid: number, name: string, data: any, parent: number | null) => Process;

export class Programs {
  private static programs: { [name: string]: ProcessConstructor } = {};
  public static register(constructor: ProcessConstructor) {
    if (this.programs[constructor.name] !== undefined) {
      throw new Error(`a program is already registred with name ${constructor.name}.`);
    }
    this.programs[constructor.name] = constructor;
  }

  public static get(name: string): ProcessConstructor {
    return this.programs[name];
  }
}
