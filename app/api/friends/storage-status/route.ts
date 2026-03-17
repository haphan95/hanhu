import { NextResponse } from "next/server";

/**
 * GET /api/friends/storage-status
 * Kiểm tra trên server (Vercel) đã có env Redis chưa – không trả giá trị thật, chỉ có/không.
 */
export async function GET() {
  const hasUrl = !!(
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL
  );
  const hasToken = !!(
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
  const storage =
    hasUrl && hasToken ? "redis" : process.env.VERCEL ? "file_unavailable" : "file";
  return NextResponse.json({
    storage,
    redisConfigured: hasUrl && hasToken,
    env: {
      hasKvUrl: !!process.env.KV_REST_API_URL,
      hasKvToken: !!process.env.KV_REST_API_TOKEN,
      hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
      hasUpstashToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    },
    vercel: !!process.env.VERCEL,
  });
}
