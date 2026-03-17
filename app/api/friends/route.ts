import { NextRequest, NextResponse } from "next/server";
import { createFriend, readFriends } from "@/lib/friends";
import { VercelStorageNotConfiguredError } from "@/lib/friends-storage";
import { isPastRsvpDeadline } from "@/lib/wedding-config";

/** GET /api/friends – trả về toàn bộ danh sách (từ Redis hoặc file). Dùng để export/backup data mới nhất. */
export async function GET() {
  try {
    const friends = await readFriends();
    return NextResponse.json(friends);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

type Body = {
  name: string;
  status: "attend" | "decline";
  location_attend: number;
  guests_count: number;
  message_attend?: string;
  attend_days?: string;
};

export async function POST(request: NextRequest) {
  try {
    if (isPastRsvpDeadline()) {
      return NextResponse.json(
        { error: "Đã hết hạn xác nhận tham dự" },
        { status: 410 }
      );
    }
    const body = (await request.json()) as Body;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      return NextResponse.json({ error: "Họ tên không được để trống" }, { status: 400 });
    }
    const status = body.status === "attend" || body.status === "decline" ? body.status : "attend";
    const location_attend = typeof body.location_attend === "number" ? body.location_attend : 0;
    const guests_count = typeof body.guests_count === "number" ? body.guests_count : 1;
    const message_attend = typeof body.message_attend === "string" ? body.message_attend : "";
    const attend_days = typeof body.attend_days === "string" ? body.attend_days : "";
    const friend = await createFriend({
      name,
      status,
      location_attend,
      guests_count,
      message_attend,
      attend_days,
    });
    return NextResponse.json(friend);
  } catch (e) {
    if (e instanceof VercelStorageNotConfiguredError) {
      return NextResponse.json(
        {
          error:
            "Trên Vercel cần bật Redis (Storage → Upstash Redis) và thêm biến môi trường KV_REST_API_URL, KV_REST_API_TOKEN.",
          code: "VERCEL_STORAGE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
