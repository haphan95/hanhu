import { NextRequest, NextResponse } from "next/server";
import { updateFriend } from "@/lib/friends";
import { VercelStorageNotConfiguredError } from "@/lib/friends-storage";
import { isPastRsvpDeadline } from "@/lib/wedding-config";

export type AttendDays = "" | "06" | "07" | "06,07";

type Body = {
  id: number;
  name?: string;
  status?: "attend" | "decline";
  location_attend?: number;
  guests_count?: number;
  message_attend?: string;
  attend_days?: AttendDays;
};

export async function PATCH(request: NextRequest) {
  try {
    if (isPastRsvpDeadline()) {
      return NextResponse.json(
        { error: "Đã hết hạn xác nhận tham dự" },
        { status: 410 }
      );
    }
    const body = (await request.json()) as Body;
    const id = typeof body.id === "number" ? body.id : parseInt(String(body.id), 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const time_attend = new Date().toISOString();
    const data: Parameters<typeof updateFriend>[1] = { time_attend };
    if (body.name !== undefined) data.name = body.name;
    if (body.status !== undefined) data.status = body.status;
    if (body.location_attend !== undefined) data.location_attend = body.location_attend;
    if (body.guests_count !== undefined) data.guests_count = body.guests_count;
    if (body.message_attend !== undefined) data.message_attend = body.message_attend;
    if (body.attend_days !== undefined) data.attend_days = body.attend_days;
    const updated = await updateFriend(id, data);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
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
