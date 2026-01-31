import pinoHttp from "pino-http";
import { logger } from "../utils";
import { v4 as uuidv4 } from "uuid";

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers["x-request-id"]?.toString() || uuidv4()
});


