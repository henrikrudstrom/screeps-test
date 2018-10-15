try {
const const
const kernel = require('./os/kernel');

module.exports.loop = function() {
  try{
  //throw new Error("HMM")

  console.log("HI")
  logger.error("HELLO")
//  console.log(kernel);
  } catch(e){
    console.log(e)
  }
}
}catch(e){
  console.log(e)
}
