const fs = require("fs");
const path = require("path");

const FRIENDS_PATH = path.join(__dirname, "..", "friends.json");

function capitalizeFirstPerWord(str) {
  return str
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

function nameToSlug(name) {
  const s = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "");
  return s || "invitation";
}

function ensureUniqueSlugs(friends) {
  const used = new Map();
  return friends.map((f) => {
    let slug = nameToSlug(f.name);
    let base = slug;
    let n = 0;
    while (used.has(slug)) {
      n++;
      slug = n === 1 ? `${base}-2` : `${base}-${n + 1}`;
    }
    used.set(slug, true);
    return { ...f, url_invitation: `/thiepmoi/${slug}` };
  });
}

const data = JSON.parse(fs.readFileSync(FRIENDS_PATH, "utf-8"));
const normalized = data.map((f) => ({
  ...f,
  name: capitalizeFirstPerWord(f.name),
  url_invitation: "", // set below with uniqueness
}));
const withUrls = ensureUniqueSlugs(normalized);

fs.writeFileSync(FRIENDS_PATH, JSON.stringify(withUrls, null, 2), "utf-8");
console.log("Chuẩn hóa xong friends.json:", withUrls.length, "bản ghi.");
