const loglevel = require('loglevel');
const logger = loglevel.getLogger("root");
module.exports.loop = function() {
  console.log("HI")
  logger.info("HELLO")
}
