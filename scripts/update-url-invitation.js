const fs = require("fs");
const path = require("path");

const FRIENDS_PATH = path.join(__dirname, "..", "friends.json");

function slugify(name) {
  if (typeof name !== "string") return "invitation";
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "invitation"
  );
}

const data = JSON.parse(fs.readFileSync(FRIENDS_PATH, "utf-8"));
const used = new Map();

const updated = data.map((f) => {
  let slug = slugify(f.name);
  const base = slug;
  let n = 0;
  while (used.has(slug)) {
    n += 1;
    slug = n === 1 ? `${base}-2` : `${base}-${n + 1}`;
  }
  used.set(slug, true);
  return { ...f, url_invitation: `/thiepmoi/${slug}` };
});

fs.writeFileSync(FRIENDS_PATH, JSON.stringify(updated, null, 2), "utf-8");
console.log("Đã cập nhật url_invitation từ name:", updated.length, "bản ghi.");
