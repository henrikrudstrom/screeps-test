try {

const loglevel = require('lib/loglevel');
const logger = loglevel.getLogger("root");
const kernel = require('./os/kernel');
}catch(e){
  console.log(e)
}

module.exports.loop = function() {
  try{
  throw new Error("HMM")

  console.log("HI")
  logger.info("HELLO")
//  console.log(kernel);
  } catch(e){
    console.log(e)
  }
}
