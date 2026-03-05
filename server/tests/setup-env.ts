/**
 * Set environment variables BEFORE any module loads config/env.ts
 */
process.env.PORT = "8099";
process.env.SESSION_EXPIRY_IN_MINUTES = "60";
process.env.NODE_ENV = "test";
process.env.FILE_SERVICE_URL = "http://localhost:8001";
process.env.FILE_SERVICE_INTERNAL_API_KEY = "test-api-key";
process.env.LOG_LEVEL = "silent";
process.env.BASE_URL = "http://localhost:8099";
process.env.GMAIL_ADDRESS = "test@test.com";
process.env.GMAIL_APP_PASSWORD = "test-password";
process.env.MONGODB_URL = "mongodb://127.0.0.1:27017/sociaanet_test";

// Suppress pino-http request logging during tests
jest.mock("pino-http", () => {
    return () => (_req: any, _res: any, next: any) => next();
});
