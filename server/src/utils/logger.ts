// src/utils/logger.ts
import pino from "pino";
import config from "../config/env";

const transport = pino.transport({
    target: "pino-pretty",
    level: config.log_level,
    options: { colorize: true, translateTime: "yyyy-mm-dd HH:MM:ss.l o" }
});

export const logger = pino(transport);
