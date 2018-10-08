

export function fatigue(body: BodyPartConstant[], full: boolean = true, multiplier: number = 1) {
  let sum = 0;
  for (let i = 0; i < body.length; i++) {
    sum += body[i] === MOVE ? -2 : body[i] === CARRY && !full ? 0 : 2 * multiplier;
  }
  return Math.max(0, sum);
}

export function moveTime(body: BodyPartConstant[], full: boolean = true, multiplier: number = 1) {
  let weight = 0;
  let restore = 0;
  for (let i = 0; i < body.length; i++) {
    if(body[i] === MOVE){
      restore += 1;
    } else {
      weight += body[i] === CARRY && !full ? 0 : multiplier;
    }
  }
  return Math.max(1, Math.ceil(weight / restore));
}

export function fatigueRestored(body: BodyPartConstant[]) {
  let sum = 0;
  for (let i = 0; i < body.length; i++) {
    sum += body[i] === MOVE ? 2 : 0;
  }
  return sum;
}

export function harvestingSpeed(body: BodyPartConstant[]) {
  let sum = 0;
  for (let i = 0; i < body.length; i++) {
    sum += body[i] === WORK ? 2 : 0;
  }
  return sum;
}

export function energyCost(body: BodyPartConstant[]): number {
  let cost = 0;
  for (let i = 0; i < body.length; i++) {
    cost += BODYPART_COST[body[i]];
  }
  return cost;
}
