import pino from "pino";
import dayjs from "dayjs";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

/** Create the global definition */
declare global {
  var log: pino.Logger;
}

/** Link the local variable to the global variable */
globalThis.log = logger;

export default logger;
