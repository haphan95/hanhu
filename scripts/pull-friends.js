/**
 * Tải danh sách friends mới nhất từ API (Redis trên Vercel) về file friends.json.
 *
 * Cách chạy:
 *   node scripts/pull-friends.js
 *   # hoặc chỉ định URL:
 *   API_URL=https://savedateluuxuyen.vercel.app node scripts/pull-friends.js
 *
 * Cần set API_URL (mặc định: http://localhost:3000 khi chạy local).
 */
const fs = require("fs");
const path = require("path");

const API_URL = process.env.API_URL || "http://localhost:3000";
const FRIENDS_PATH = path.join(__dirname, "..", "friends.json");

async function main() {
  const url = `${API_URL.replace(/\/$/, "")}/api/friends`;
  console.log("Fetching from", url);
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Error:", res.status, await res.text());
    process.exit(1);
  }
  const friends = await res.json();
  if (!Array.isArray(friends)) {
    console.error("Invalid response: expected array");
    process.exit(1);
  }
  fs.writeFileSync(
    FRIENDS_PATH,
    JSON.stringify(friends, null, 2),
    "utf-8"
  );
  console.log("Saved", friends.length, "friends to", FRIENDS_PATH);
}

main();
