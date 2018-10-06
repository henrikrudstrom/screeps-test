import log from "loglevel"

// function format(info: object) : winston.Format {
//   return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
// }

export function createLogger(moduleName: string, level: log.LogLevelDesc='INFO') : log.Logger{
  const logger =  log.getLogger(moduleName);
  logger.setLevel(level);
  return logger;
  // return winston.createLogger({
  //   level: level,
  //   format: winston.format.combine(
  //   winston.format.label({ label: moduleName }),
  //   ),
  //   transports: [
  //     new winston.transports.Console(),
  //   ]
  // })
}
