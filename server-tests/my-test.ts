export function testFunction(done: () => void){
  console.log("im testing this");
  if(Game.time === 5)  {
    done();
  }
}
