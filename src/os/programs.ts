import { Process } from "./process";

export declare type ProcessConstructor = new (pid: number, name: string, data: any, parent: number | null) => Process;

export class Programs {
  private static programs: { [name: string]: ProcessConstructor } = {};
  public static register(name: string, constructor: ProcessConstructor) {
    if (this.programs[name] !== undefined) {
      throw new Error(`a program is already registred with name ${name}.`);
    }
    this.programs[name] = constructor;
  }

  public static get(name: string): ProcessConstructor {
    return this.programs[name];
  }
}
