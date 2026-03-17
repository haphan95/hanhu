/** Tên chú rể và cô dâu */
export const GROOM_NAME = "Văn Hạ";
export const BRIDE_NAME = "Hảo Như";
export const COUPLE_NAME = `${GROOM_NAME} & ${BRIDE_NAME}`;

/** Ngày cưới (YYYY-MM-DD). Dùng cho countdown, logic. */
export const WEDDING_DATE = "2026-04-07";
/** Giờ bắt đầu sự kiện đầu tiên (để đếm ngược). ISO string. */
export const WEDDING_DATETIME = "2026-04-07T11:00:00+07:00";

/** Ngày giới hạn xác nhận tham dự (YYYY-MM-DD). Dùng cho UI và API. */
export const RSVP_DEADLINE = "2026-03-31";

/** File nhạc nền (đặt trong public). Mặc định phát khi vào trang. */
export const WEDDING_AUDIO_FILE = "lulu.mp3";
export const WEDDING_AUDIO_AUTOPLAY = true;

/** Định dạng ngày cưới để hiển thị (dd.MM.yyyy). */
export const WEDDING_DATE_DISPLAY = (() => {
  const [y, m, d] = WEDDING_DATE.split("-");
  return `${d}.${m}.${y}`;
})();

export function isPastRsvpDeadline(deadline: string = RSVP_DEADLINE): boolean {
  const endOfDeadline = new Date(deadline);
  endOfDeadline.setHours(23, 59, 59, 999);
  return new Date() > endOfDeadline;
}
