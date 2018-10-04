export function creepCost(body: BodyPartConstant[]){
  return body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
}
export function harvestingRate(body: BodyPartConstant[]){
  return body.reduce((rate, part) => rate + part === WORK ? 2 : 0, 0);
}
