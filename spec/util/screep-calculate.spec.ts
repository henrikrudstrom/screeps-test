import * as calculate from "util/creep-calculate";

import { expect } from "chai";
import mocha from "mocha";

describe("screep-calculate", () => {
  it('should calculate creep energy cost', () => {
    expect(calculate.energyCost([WORK, WORK, CARRY, MOVE])).to.eql(300);
    expect(calculate.energyCost([MOVE, MOVE, ATTACK, HEAL])).to.eql(430);
  });
  it('should calculate creep harvesting speed', () => {
    expect(calculate.harvestingSpeed([MOVE, WORK, WORK])).to.eql(4)
    expect(calculate.harvestingSpeed([MOVE, WORK, WORK, CARRY, WORK])).to.eql(6)
  });
  it('should calculate fatigue', () => {
    expect(calculate.fatigue([MOVE, MOVE, WORK])).to.eql(0)
    expect(calculate.fatigue([MOVE, WORK, WORK])).to.eql(2)
    expect(calculate.fatigue([MOVE, WORK, WORK], false, 0.5)).to.eql(0);
    expect(calculate.fatigue([MOVE, CARRY, CARRY], false)).to.eql(0);
    expect(calculate.fatigue([MOVE, CARRY, CARRY], true)).to.eql(2);
  });
  it('should calculate movement speed', () => {
    expect(calculate.moveTime([MOVE, WORK, WORK])).to.eql(2);
    expect(calculate.moveTime([MOVE, WORK, WORK], false, 0.5)).to.eql(1);
    expect(calculate.moveTime([MOVE, MOVE])).to.eql(1);
    expect(calculate.moveTime([MOVE, MOVE, WORK, WORK, WORK])).to.eql(2);
    expect(calculate.moveTime([MOVE, MOVE, WORK, WORK, WORK], false, 0.5)).to.eql(1);
    expect(calculate.moveTime([MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK], false, 1)).to.eql(3);
  });

});
