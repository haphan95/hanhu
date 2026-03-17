import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function listImages(dir: string, prefix: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort()
    .map((f) => `${prefix}/${f}`);
}

export async function GET() {
  try {
    let images = listImages(GALLERY_DIR, "/gallery");
    if (images.length === 0) {
      images = listImages(IMAGES_DIR, "/images").filter((f) =>
        /\/images\/gallery-/i.test(f)
      );
    }
    return NextResponse.json({ images });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}
