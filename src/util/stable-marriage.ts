import _ from "lodash"

export function generatePreferenceLists<TM, TW>(
  men: TM[],
  manKey: (man: TM) => string,
  women: TW[],
  womanKey: (woman: TW) => string,
  rank: (man: TM, woman: TW) => number
): {
  menPrefs: { [man: string]: string[] };
  womenPrefs: { [woman: string]: string[] };
} {
  const score: number[][] = [];
  const menPrefs: { [man: string]: string[] } = {};
  const womenPrefs: { [woman: string]: string[] } = {};
  for (let m = 0; m < men.length; m++) {
    const row: number[] = [];
    for (let w = 0; w < women.length; w++) {
      row.push(rank(men[m], women[w]));
    }
    score.push(row);
    menPrefs[manKey(men[m])] = _.sortBy(_.range(women.length), i => row[i]).map(i => womanKey(women[i]));
  }
  for (let w = 0; w < women.length; w++) {
    womenPrefs[womanKey(women[w])] = _.sortBy(_.range(men.length), i => score[i][w]).map(i => manKey(men[i]));
  }

  return {
    menPrefs,
    womenPrefs
  };
}

export class StableMarriageAlgorithm {
  private _menPrefs: { [man: string]: string[] } = {};
  private _womenPrefs: { [woman: string]: string[] } = {};
  private _womenFree: { [woman: string]: boolean } = {};
  private matchings: { [man: string]: string } = {};

  constructor(menPrefs: { [man: string]: string[] }, womenPrefs: { [woman: string]: string[] }) {
    this._menPrefs = menPrefs;
    this._womenPrefs = womenPrefs;
    this._womenFree = _.zipObject(_.keys(womenPrefs), _.map(_.keys(womenPrefs), woman => true));
    this.matchings = {};
  }

  public prefersMan(woman: string, man1: string, man2: string): boolean {
    return _.indexOf(this._womenPrefs[woman], man1) < _.indexOf(this._womenPrefs[woman], man2);
  }

  public prefersWoman(man: string, woman1: string, woman2: string): boolean {
    return _.indexOf(this._menPrefs[man], woman1) < _.indexOf(this._menPrefs[man], woman2);
  }

  private engage(man: string, woman: string): void {
    _.remove(this._menPrefs[man], w => w === woman); // Remove the woman that the man proposed to
    this._womenFree[woman] = false;
    // Don't remove from women prefs since we're matching from men side
    this.matchings[man] = woman;
  }

  /* Break up a couple... </3 :'( */
  private breakup(man: string, woman: string): void {
    this._womenFree[woman] = true;
    // Don't do anything to the preferences of men or women since they've already proposed
    delete this.matchings[man];
  }

  /* Return the first free man who still has someone left to propose to */
  private nextMan(): string | undefined {
    return _.find(_.keys(this._menPrefs), man => this.matchings[man] === undefined && this._menPrefs[man].length > 0);
  }

  public match() {
    const MAX_ITERATIONS = 1000;
    let count = 0;
    let man = this.nextMan();
    while (man) {
      // While there exists a free man who still has someone to propose to
      if (count > MAX_ITERATIONS) {
        console.log("Stable matching timed out!");
        return this.matchings;
      }
      const woman = _.first(this._menPrefs[man]); // Get first woman on man's list
      if (this._womenFree[woman]) {
        // If woman is free, get engaged
        this.engage(man, woman);
      } else {
        // Else if woman prefers this man to her current, swap men
        const currentMan = _.findKey(this.matchings, w => w === woman);
        if (this.prefersMan(woman, man, currentMan)) {
          this.breakup(currentMan, woman);
          this.engage(man, woman);
        } else {
          _.remove(this._menPrefs[man], w => w === woman); // Record an unsuccessful proposal
        }
      }
      man = this.nextMan();
      count++;
    }
    return this.matchings;
  }
}
