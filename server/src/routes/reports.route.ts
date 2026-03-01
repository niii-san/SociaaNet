import express from "express";
import { authenticate } from "../middlewares";
import { submitReportController } from "../controllers/reports/submit-report.controller";

export const reportsRouter = express.Router();

// All report routes require authentication
reportsRouter.use(authenticate);

// Submit a report
reportsRouter.post("/", submitReportController);
