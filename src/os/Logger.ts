import * as pino from "pino";

// function format(info: object) : winston.Format {
//   return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
// }

export function createLogger(moduleName: string, level: string='info') : pino.Logger{
  return pino();
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
