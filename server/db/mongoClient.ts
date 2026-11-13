import { Db, MongoClient } from "mongodb";

let client: MongoClient | null = null;
let dbInstance: Db | null = null;
let isConnected = false;
let lastPingMs = 0;
let lastError: string | null = null;

const MONGODB_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb+srv://matremanish52:matre58@cluster0.9vwzolf.mongodb.net/arioFinance?retryWrites=true&w=majority&appName=Cluster0";

export async function initMongo(): Promise<Db | null> {
  if (dbInstance && isConnected) {
    return dbInstance;
  }

  try {
    const start = Date.now();
    client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 8000,
      serverSelectionTimeoutMS: 8000,
    });

    await client.connect();
    dbInstance = client.db("arioFinance");
    isConnected = true;
    lastPingMs = Date.now() - start;
    lastError = null;
    console.log(`[MongoDB Atlas] Connected to 'arioFinance' in ${lastPingMs}ms`);
    return dbInstance;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    isConnected = false;
    lastError = msg;
    console.error("[MongoDB Atlas] Connection error:", msg);
    return null;
  }
}

export function getMongoDb(): Db | null {
  return dbInstance;
}

export function isMongoConnected(): boolean {
  return isConnected;
}

export async function getMongoStatus(): Promise<{
  connected: boolean;
  pingMs: number;
  database: string;
  collectionsCount?: number;
  error: string | null;
}> {
  if (!dbInstance || !isConnected) {
    // Attempt reconnect
    await initMongo();
  }

  if (dbInstance && isConnected) {
    try {
      const start = Date.now();
      const collections = await dbInstance.listCollections().toArray();
      const ping = Date.now() - start;
      return {
        connected: true,
        pingMs: ping,
        database: "arioFinance",
        collectionsCount: collections.length,
        error: null,
      };
    } catch (err: unknown) {
      return {
        connected: false,
        pingMs: 0,
        database: "arioFinance",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  return {
    connected: false,
    pingMs: lastPingMs,
    database: "arioFinance",
    error: lastError,
  };
}

