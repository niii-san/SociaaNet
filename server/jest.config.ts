import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    testMatch: ["**/*.test.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    clearMocks: true,
    // Set env vars for tests so config/env.ts doesn't throw
    setupFiles: ["<rootDir>/tests/setup-env.ts"],
    // Global setup/teardown for mongodb-memory-server
    globalSetup: "<rootDir>/tests/global-setup.ts",
    globalTeardown: "<rootDir>/tests/global-teardown.ts",
    testTimeout: 30000,
    // Transform ESM modules (uuid, etc.) that Jest can't parse
    transformIgnorePatterns: [
        "node_modules/(?!(uuid)/)"
    ],
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                tsconfig: "tests/tsconfig.json"
            }
        ],
        "^.+\\.js$": [
            "ts-jest",
            {
                tsconfig: "tests/tsconfig.json",
                useESM: false
            }
        ]
    }
};

export default config;
