import path from "path";
import fs from "fs";

/** Same shape as Friend in friends.ts to avoid circular import */
type FriendRecord = {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: "" | "attend" | "decline";
  location_attend: number;
  guests_count: number;
  url_invitation: string;
  time_attend: string;
  message_attend: string;
};

const FRIENDS_PATH = path.join(process.cwd(), "friends.json");
const KV_KEY = "wedding:friends";

/** Lỗi khi deploy Vercel nhưng chưa cấu hình Redis – API sẽ trả 503 và hướng dẫn. */
export class VercelStorageNotConfiguredError extends Error {
  constructor() {
    super("VERCEL_STORAGE_NOT_CONFIGURED");
    this.name = "VercelStorageNotConfiguredError";
  }
}

function useRedis(): boolean {
  return !!(
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL
  );
}

function getRedis() {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  // Dynamic import to avoid requiring @upstash/redis when using only fs
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redis } = require("@upstash/redis");
  return new Redis({ url, token });
}

export async function getFriendsList(): Promise<FriendRecord[]> {
  if (useRedis()) {
    try {
      const redis = getRedis();
      const data = await redis.get(KV_KEY);
      if (Array.isArray(data) && data.length >= 0) return data as FriendRecord[];
      const fromFile = readFriendsFromFile();
      if (fromFile.length > 0) {
        await redis.set(KV_KEY, fromFile);
        return fromFile;
      }
      return [];
    } catch (e) {
      console.error("[friends-storage] Redis get failed:", e);
      return readFriendsFromFile();
    }
  }
  return readFriendsFromFile();
}

export async function setFriendsList(friends: FriendRecord[]): Promise<void> {
  if (useRedis()) {
    try {
      const redis = getRedis();
      await redis.set(KV_KEY, friends);
      return;
    } catch (e) {
      console.error("[friends-storage] Redis set failed:", e);
      throw e;
    }
  }
  if (process.env.VERCEL) {
    throw new VercelStorageNotConfiguredError();
  }
  try {
    writeFriendsToFile(friends);
  } catch (e) {
    console.error("[friends-storage] fs write failed:", e);
    throw new VercelStorageNotConfiguredError();
  }
}

function readFriendsFromFile(): FriendRecord[] {
  try {
    const data = fs.readFileSync(FRIENDS_PATH, "utf-8");
    return JSON.parse(data) as FriendRecord[];
  } catch {
    return [];
  }
}

function writeFriendsToFile(friends: FriendRecord[]): void {
  fs.writeFileSync(
    FRIENDS_PATH,
    JSON.stringify(friends, null, 2),
    "utf-8"
  );
}
