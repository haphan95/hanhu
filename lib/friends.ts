import path from "path";
import { getFriendsList, setFriendsList } from "./friends-storage";

export type FriendStatus = "attend" | "decline" | "";

/** Ngày tham dự: "06" = Chiều 06.04, "07" = Sáng 07.04, "06,07" = cả hai */
export type AttendDays = "" | "06" | "07" | "06,07";

export interface Friend {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: FriendStatus;
  location_attend: number;
  guests_count: number;
  url_invitation: string;
  time_attend: string;
  message_attend: string;
  /** Ngày tham dự: "06", "07", "06,07" */
  attend_days?: AttendDays;
}

const FRIENDS_PATH = path.join(process.cwd(), "friends.json");

export function getFriendsPath(): string {
  return FRIENDS_PATH;
}

export async function readFriends(): Promise<Friend[]> {
  return getFriendsList();
}

export async function writeFriends(friends: Friend[]): Promise<void> {
  return setFriendsList(friends);
}

export async function getFriendBySlug(slug: string): Promise<Friend | null> {
  const friends = await getFriendsList();
  const url = `/thiepmoi/${slug}`;
  return friends.find((f) => f.url_invitation === url) ?? null;
}

export async function getFriendById(id: number): Promise<Friend | null> {
  const friends = await getFriendsList();
  return friends.find((f) => f.id === id) ?? null;
}

export async function updateFriend(
  id: number,
  data: Partial<
    Pick<
      Friend,
      | "name"
      | "status"
      | "location_attend"
      | "guests_count"
      | "time_attend"
      | "message_attend"
      | "attend_days"
    >
  >
): Promise<Friend | null> {
  const friends = await getFriendsList();
  const index = friends.findIndex((f) => f.id === id);
  if (index === -1) return null;
  friends[index] = { ...friends[index], ...data };
  await setFriendsList(friends);
  return friends[index];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || "invitation";
}

export async function createFriend(data: {
  name: string;
  status: FriendStatus;
  location_attend: number;
  guests_count: number;
  message_attend: string;
  attend_days?: AttendDays;
}): Promise<Friend> {
  const friends = await getFriendsList();
  const id =
    friends.length > 0 ? Math.max(...friends.map((f) => f.id)) + 1 : 1;
  let slug = slugify(data.name);
  const existingUrls = new Set(friends.map((f) => f.url_invitation));
  let url = `/thiepmoi/${slug}`;
  let n = 0;
  while (existingUrls.has(url)) {
    n += 1;
    url = `/thiepmoi/${slug}-${n}`;
  }
  const time_attend = new Date().toISOString();
  const friend: Friend = {
    id,
    name: data.name.trim(),
    phone: "",
    email: "",
    status: data.status,
    location_attend: data.location_attend,
    guests_count: data.guests_count,
    url_invitation: url,
    time_attend,
    message_attend: data.message_attend || "",
    attend_days: data.attend_days ?? "",
  };
  friends.push(friend);
  await setFriendsList(friends);
  return friend;
}
