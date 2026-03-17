import { NextRequest, NextResponse } from "next/server";
import { getFriendBySlug } from "@/lib/friends";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const friend = await getFriendBySlug(slug);
    if (!friend) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(friend);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
