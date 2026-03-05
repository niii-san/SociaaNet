import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer;

/**
 * Connect to a new in-memory database before each test suite.
 */
export async function setupTestDB() {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
}

/**
 * Drop the database, close connection, and stop mongod.
 */
export async function teardownTestDB() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    }
    if (mongod) {
        await mongod.stop();
    }
}

/**
 * Remove all data from all collections (use between tests).
 */
export async function clearDatabase() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
}
