import pino from "pino";
import { LOG_LEVEL } from "./config";

export const logger = pino({
  level: LOG_LEVEL,
  timestamp: pino.stdTimeFunctions.isoTime
});