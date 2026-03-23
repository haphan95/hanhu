/**
 * Đọc friends.json, phân loại theo status / attend_days (cùng quy ước lib/friends.ts & event-info-section).
 * Xuất 3 list: Không tham dự | Tham dự ngày 06 | Tham dự ngày 07
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FRIENDS_PATH = path.join(ROOT, "friends.json");
const OUT_DIR = path.join(ROOT, "exports");

function parseAttendDayTokens(attend_days) {
  const raw = String(attend_days ?? "").trim();
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function formatNgayThamDu(tokens) {
  const parts = [];
  if (tokens.includes("06")) parts.push("Chiều 06.04.2026");
  if (tokens.includes("07")) parts.push("Sáng 07.04.2026");
  if (parts.length === 0) return "";
  return parts.join(" + ");
}

function formatPhuongTien(location_attend) {
  const n = Number(location_attend) === 1 ? 1 : 0;
  return n === 1 ? "Đi chung xe dâu rễ" : "Đi xe tự túc";
}

function escapeCsvCell(val) {
  const s = val == null ? "" : String(val);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowToCsv(cols) {
  return cols.map(escapeCsvCell).join(",");
}

function friendRow(f, opts = {}) {
  const tokens = parseAttendDayTokens(f.attend_days);
  const hideDay = opts.hideDayForDecline && f.status === "decline";
  return {
    ten: f.name ?? "",
    link_moi: f.url_invitation ?? "",
    email: f.email ?? "",
    ngay_tham_du: hideDay ? "" : formatNgayThamDu(tokens),
    ma_ngay: hideDay ? "" : String(f.attend_days ?? ""),
    phuong_tien: formatPhuongTien(f.location_attend),
    so_khach: f.guests_count ?? "",
    thoi_gian_xac_nhan: f.time_attend ?? "",
    loi_nhan: (f.message_attend ?? "").replace(/\r\n/g, "\n"),
  };
}

function main() {
  const raw = fs.readFileSync(FRIENDS_PATH, "utf8");
  const friends = JSON.parse(raw);

  const decline = [];
  const day06 = [];
  const day07 = [];

  for (const f of friends) {
    if (f.status === "decline") {
      decline.push(f);
      continue;
    }
    if (f.status !== "attend") continue;
    const tokens = parseAttendDayTokens(f.attend_days);
    if (tokens.includes("06")) day06.push(f);
    if (tokens.includes("07")) day07.push(f);
  }

  const headers = [
    "Tên",
    "Link mời (path)",
    "Email",
    "Ngày tham dự (hiển thị)",
    "attend_days (raw)",
    "Phương tiện đi lại",
    "Số khách",
    "Thời gian xác nhận (ISO)",
    "Lời nhắn",
  ];

  const sections = [
    { title: "1. KHÔNG THAM DỰ (status=decline)", rows: decline },
    { title: "2. CÓ THAM DỰ — có mặt Chiều 06.04.2026 (attend_days chứa 06)", rows: day06 },
    { title: "3. CÓ THAM DỰ — có mặt Sáng 07.04.2026 (attend_days chứa 07)", rows: day07 },
  ];

  const csvLines = [
    "# UTF-8. Mở bằng Excel: Data > From Text/CSV, encoding UTF-8.",
    `# Nguồn: friends.json | Quy ước: location 0 = xe tự túc, 1 = chung xe dâu rễ`,
    "",
  ];

  const txtLines = [
    "THỐNG KÊ RSVP (friends.json)",
    `Tạo lúc: ${new Date().toISOString()}`,
    "",
    `Tổng khách trong file: ${friends.length}`,
    `Không tham dự: ${decline.length}`,
    `Có mặt buổi chiều 06.04: ${day06.length} (khách chọn cả 06+07 được tính ở đây và ở list 07)`,
    `Có mặt buổi sáng 07.04: ${day07.length}`,
    "",
  ];

  for (const sec of sections) {
    csvLines.push(`"${sec.title}"`);
    csvLines.push(rowToCsv(headers));
    const hideDeclineDay = sec.title.startsWith("1.");
    for (const f of sec.rows) {
      const r = friendRow(f, { hideDayForDecline: hideDeclineDay });
      csvLines.push(
        rowToCsv([
          r.ten,
          r.link_moi,
          r.email,
          r.ngay_tham_du,
          r.ma_ngay,
          r.phuong_tien,
          r.so_khach,
          r.thoi_gian_xac_nhan,
          r.loi_nhan,
        ])
      );
    }
    csvLines.push("");

    txtLines.push(sec.title);
    txtLines.push(headers.join("\t"));
    for (const f of sec.rows) {
      const r = friendRow(f, { hideDayForDecline: hideDeclineDay });
      txtLines.push(
        [r.ten, r.link_moi, r.email, r.ngay_tham_du, r.ma_ngay, r.phuong_tien, r.so_khach, r.thoi_gian_xac_nhan, r.loi_nhan].join("\t")
      );
    }
    txtLines.push("");
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const csvPath = path.join(OUT_DIR, `rsvp-3-lists-${stamp}.csv`);
  // const txtPath = path.join(OUT_DIR, `rsvp-3-lists-${stamp}.txt`);
  fs.writeFileSync(csvPath, csvLines.join("\n"), "utf8");
  // fs.writeFileSync(txtPath, txtLines.join("\n"), "utf8");

  console.log("Wrote:", csvPath);
  // console.log("Wrote:", txtPath);
}

main();
