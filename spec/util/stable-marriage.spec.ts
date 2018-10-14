import { StableMarriageAlgorithm, generatePreferenceLists } from "util/stable-marriage";

import { expect } from "chai";
import mocha from "mocha";
import _ from "lodash";

function validate(
  manPrefs: { [name: string]: string[] },
  womenPrefs: { [name: string]: string[] },
  matching: { [man: string]: string }
): string[] {
  const unstableMatches = [];
  const sma = new StableMarriageAlgorithm(manPrefs, womenPrefs);
  const invertedMatching: { [man: string]: string } = _.invert(matching);
  for (const man in matching) {
    const woman = matching[man];
    const betterWomen = manPrefs[man].slice(0, manPrefs[man].indexOf(woman));
    const likewiseWomen = betterWomen.filter(w => sma.prefersMan(w, man, invertedMatching[w]));
    if (likewiseWomen.length > 0) {
      unstableMatches.push(`${man} would rather be with ${likewiseWomen}`);
    }

    const betterMen = womenPrefs[woman].slice(0, womenPrefs[woman].indexOf(man));
    const likewiseMen = betterMen.filter(m => sma.prefersWoman(m, woman, matching[m]));
    if (likewiseMen.length > 0) {
      unstableMatches.push(`${woman} would rather be with ${likewiseMen}`);
    }
  }
  return unstableMatches;
}

function distance(a: number[], b: number[]) : number {
  return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
}

describe("screep-calculate", () => {
  it("should generate preference list from a function", () => {
    const men = [[0,0], [0,2], [4,0]];
    const women = [[0,3], [1,1], [2,0]];
    const prefs = generatePreferenceLists(men, m => `${m[0]},${m[1]}`, women, w => `${w[0]},${w[1]}`, distance);
    expect(prefs.menPrefs).to.eql({
      "0,0": ["1,1", "2,0", "0,3"],
      "0,2": ["0,3", "1,1", "2,0"],
      "4,0": ["2,0", "1,1", "0,3"]
    });
    expect(prefs.womenPrefs).to.eql({
      "0,3": ["0,2", "0,0", "4,0"],
      "1,1": ["0,0", "0,2", "4,0"],
      "2,0": ["0,0", "4,0", "0,2"]
    })
  })

  it("should be create a stable matching beteween a few candidates", () => {
    const manPrefs: { [name: string]: string[] } = {
      ole: ["anne", "mari", "stine", "hilde"],
      petter: ["anne", "hilde", "mari", "stine"],
      truls: ["anne", "hilde", "mari", "stine"],
      nils: ["anne", "stine", "mari", "hilde"]
    };
    const womenPrefs: { [name: string]: string[] } = {
      anne: ["petter", "ole", "truls", "nils"],
      mari: ["ole", "truls", "nils", "petter"],
      stine: ["petter", "truls", "ole", "nils"],
      hilde: ["petter", "ole", "nils", "truls"]
    };

    const sma = new StableMarriageAlgorithm(_.cloneDeep(manPrefs), _.cloneDeep(womenPrefs));
    const matching = sma.match();

    expect(validate(manPrefs, womenPrefs, matching)).to.eql([]);
  });

  it("should manage big sets", () => {
    const men = [
      "Jackson",
      "Aiden",
      "Liam",
      "Lucas",
      "Noah",
      "Mason",
      "Jayden",
      "Ethan",
      "Jacob",
      "Jack",
      "Caden",
      "Logan",
      "Benjamin",
      "Michael",
      "Caleb",
      "Ryan",
      "Alexander",
      "Elijah",
      "James",
      "William",
      "Oliver",
      "Connor",
      "Matthew",
      "Daniel",
      "Luke",
      "Brayden",
      "Jayce",
      "Henry",
      "Carter",
      "Dylan",
      "Gabriel",
      "Joshua",
      "Nicholas",
      "Isaac",
      "Owen",
      "Nathan",
      "Grayson",
      "Eli",
      "Landon"
    ];
    const women = [
      "Sophia",
      "Emma",
      "Olivia",
      "Isabella",
      "Mia",
      "Ava",
      "Lily",
      "Zoe",
      "Emily",
      "Chloe",
      "Layla",
      "Madison",
      "Madelyn",
      "Abigail",
      "Aubrey",
      "Charlotte",
      "Amelia",
      "Ella",
      "Kaylee",
      "Avery",
      "Aaliyah",
      "Hailey",
      "Hannah",
      "Addison",
      "Riley",
      "Harper",
      "Aria",
      "Arianna",
      "Mackenzie",
      "Lila",
      "Evelyn",
      "Adalyn",
      "Grace",
      "Brooklyn",
      "Ellie",
      "Anna",
      "Kaitlyn",
      "Isabelle",
      "Sophie"
    ];

    const manPrefs: { [name: string]: string[] } = _.zipObject(men, men.map(m => _.shuffle(women)));
    const womenPrefs: { [name: string]: string[] } = _.zipObject(women, women.map(m => _.shuffle(men)));

    const sma = new StableMarriageAlgorithm(_.cloneDeep(manPrefs), _.cloneDeep(womenPrefs));
    const matching = sma.match();

    expect(validate(manPrefs, womenPrefs, matching)).to.eql([]);
  });
});
