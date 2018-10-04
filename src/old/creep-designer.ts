export class CreepDesigner{
  public static bodyCost(body: BodyPartConstant[]): number {
    return body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
  }

  public static createFromBlueprintAndCost(blueprint: BodyPartConstant[], maxCost: number) : BodyPartConstant[] {
    let i = 0;
    let body: BodyPartConstant[] = [];
    let nextBody = body.concat([blueprint[i]]);
    let nextCost = this.bodyCost(nextBody);
    while (nextCost <= maxCost) {
      body = nextBody;
      i = (i + 1) % blueprint.length;
      nextBody = body.concat([blueprint[i]]);
      nextCost = this.bodyCost(nextBody);
    }
    return body;
  }
}
