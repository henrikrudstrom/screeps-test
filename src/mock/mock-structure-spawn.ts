export interface MockStructureSpawn {
  name: string;
  spawnCreep(body: BodyPartConstant[], name: string, options: {}) : ScreepsReturnCode
}
