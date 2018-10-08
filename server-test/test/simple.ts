import should from "should"

Memory.created = false;
export const loop = () => {
  should(1).equal(1);
  should(2).equal(1);
};
