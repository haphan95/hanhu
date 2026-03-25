/**
 * Đọc friends.json, phân loại theo status / attend_days (cùng quy ước lib/friends.ts & event-info-section).
 * Xuất:
 * - rsvp-4-lists-*.csv: 4 list tách section
 * - rsvp-summary-*.csv: gộp 1 dòng/khách + cột Phân loại (tóm tắt)
 * Cột "Ngày tham dự (hiển thị)": pending | Từ chối | buổi cụ thể
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

/** Cột "Ngày tham dự (hiển thị)": pending | Từ chối | buổi cụ thể (đồng bộ thank-you: attend_days rỗng → sáng 07). */
function displayNgayThamDuColumn(f) {
  const st = String(f.status ?? "").trim();
  if (st === "" || st === "pending") return "pending";
  if (st === "decline") return "Từ chối";
  if (st !== "attend") return "";
  const raw = String(f.attend_days ?? "").trim();
  const tokens = parseAttendDayTokens(f.attend_days);
  const has06 = tokens.includes("06");
  const has07 = tokens.includes("07") || raw === "";
  const effective = [];
  if (has06) effective.push("06");
  if (has07) effective.push("07");
  return formatNgayThamDu(effective);
}

/** Một dòng / khách — phân loại cho file summary. */
function summaryPhanLoai(f) {
  const st = String(f.status ?? "").trim();
  if (st === "" || st === "pending") return "Chưa xác nhận";
  if (st === "decline") return "Từ chối";
  if (st !== "attend") return "Khác";
  const raw = String(f.attend_days ?? "").trim();
  const tokens = parseAttendDayTokens(f.attend_days);
  const has06 = tokens.includes("06");
  const has07 = tokens.includes("07") || raw === "";
  if (has06) return "Tham dự — chiều 06.04.2026";
  if (has07) return "Tham dự — sáng 07.04.2026";
  return "Tham dự (chưa chọn ngày)";
}

function formatPhuongTien(location_attend, status) {
  const n = Number(location_attend) === 1 ? 1 : 0;
  const st = String(status ?? "").trim();
  if (st === "decline" || st === "pending" || st === "") return "";
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

function friendRow(f) {
  return {
    ten: f.name ?? "",
    link_moi: f.url_invitation ?? "",
    email: f.email ?? "",
    ngay_tham_du: displayNgayThamDuColumn(f),
    ma_ngay: String(f.attend_days ?? ""),
    phuong_tien: formatPhuongTien(f.location_attend, f.status),
    so_khach: f.guests_count ?? "",
    thoi_gian_xac_nhan: f.time_attend ?? "",
    loi_nhan: (f.message_attend ?? "").replace(/\r\n/g, "\n"),
  };
}

function main() {
  const raw = fs.readFileSync(FRIENDS_PATH, "utf8");
  const friends = JSON.parse(raw);

  const pending = [];
  const decline = [];
  const day06 = [];
  const day07 = [];

  for (const f of friends) {
    const st = String(f.status ?? "").trim();
    if (st === "" || st === "pending") {
      pending.push(f);
      continue;
    }
    if (st === "decline") {
      decline.push(f);
      continue;
    }
    if (st !== "attend") continue;
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
    {
      title: "1. CHƯA XÁC NHẬN (status rỗng — chưa RSVP)",
      rows: pending,
    },
    {
      title: "2. KHÔNG THAM DỰ (status=decline)",
      rows: decline,
    },
    {
      title: "3. CÓ THAM DỰ — có mặt Chiều 06.04.2026 (attend_days chứa 06)",
      rows: day06,
    },
    {
      title: "4. CÓ THAM DỰ — có mặt Sáng 07.04.2026 (attend_days chứa 07)",
      rows: day07,
    },
  ];

  const summaryHeaders = [
    "Phân loại (tóm tắt)",
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

  const summaryOrder = [
    "Chưa xác nhận",
    "Từ chối",
    "Tham dự — chiều 06.04.2026",
    "Tham dự — sáng 07.04.2026",
    "Khác",
  ];
  const orderRank = new Map(summaryOrder.map((k, i) => [k, i]));

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
    `Chưa xác nhận: ${pending.length}`,
    `Không tham dự: ${decline.length}`,
    `Có mặt buổi chiều 06.04: ${day06.length} (khách chọn cả 06+07 được tính ở đây và ở list 07)`,
    `Có mặt buổi sáng 07.04: ${day07.length}`,
    "",
  ];

  for (const sec of sections) {
    csvLines.push(`"${sec.title}"`);
    csvLines.push(rowToCsv(headers));
    for (const f of sec.rows) {
      const r = friendRow(f);
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
      const r = friendRow(f);
      txtLines.push(
        [
          r.ten,
          r.link_moi,
          r.email,
          r.ngay_tham_du,
          r.ma_ngay,
          r.phuong_tien,
          r.so_khach,
          r.thoi_gian_xac_nhan,
          r.loi_nhan,
        ].join("\t")
      );
    }
    txtLines.push("");
  }

  const sortedFriends = [...friends].sort((a, b) => {
    const pa = summaryPhanLoai(a);
    const pb = summaryPhanLoai(b);
    const ra = orderRank.has(pa) ? orderRank.get(pa) : 999;
    const rb = orderRank.has(pb) ? orderRank.get(pb) : 999;
    if (ra !== rb) return ra - rb;
    return String(a.name ?? "").localeCompare(String(b.name ?? ""), "vi");
  });

  const summaryCsvLines = [
    rowToCsv(summaryHeaders),
  ];
  for (const f of sortedFriends) {
    const r = friendRow(f);
    const pl = summaryPhanLoai(f);
    summaryCsvLines.push(
      rowToCsv([
        pl,
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

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const csvPath = path.join(OUT_DIR, `rsvp-4-lists-${stamp}.csv`);
  const summaryPath = path.join(OUT_DIR, `rsvp-summary-${stamp}.csv`);
  // const txtPath = path.join(OUT_DIR, `rsvp-4-lists-${stamp}.txt`);
  fs.writeFileSync(csvPath, csvLines.join("\n"), "utf8");
  fs.writeFileSync(summaryPath, summaryCsvLines.join("\n"), "utf8");
  // fs.writeFileSync(txtPath, txtLines.join("\n"), "utf8");

  console.log("Wrote:", csvPath);
  console.log("Wrote:", summaryPath);
  // console.log("Wrote:", txtPath);
}

main();
