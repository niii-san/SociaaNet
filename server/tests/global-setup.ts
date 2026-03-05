import { MongoMemoryServer } from "mongodb-memory-server";

export default async function globalSetup() {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    // Store on globalThis so globalTeardown can access it
    (globalThis as any).__MONGOD__ = mongod;
    process.env.MONGODB_URL = uri;
}
