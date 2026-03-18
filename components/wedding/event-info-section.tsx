"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  MapPin,
  Clock,
  Heart,
  Check,
  X,
  Send,
  Users,
  Pencil,
  ChevronDown,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useFriend } from "@/context/friend-context";
import {
  COUPLE_NAME,
  RSVP_DEADLINE,
  WEDDING_DATE,
  WEDDING_DATE_DISPLAY,
  isPastRsvpDeadline,
} from "@/lib/wedding-config";
import Image from "next/image";

const events = [
  {
    icon: Heart,
    title: "Lễ Vu Quy",
    time: "10:00",
    date: WEDDING_DATE_DISPLAY,
    venue: "Tư gia nhà gái",
    address: "Ấp số 5, Xã Càng Long, Tỉnh Vĩnh Long",
    mapUrl: "https://maps.app.goo.gl/SYT43N8DF7BRSdTw9",
    hidden: false,
  },
];

function fireRsvpConfetti() {
  const count = 80;
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };
  const colors = ["#E85D75", "#F07A8F", "#8FAF9A", "#FFD6DC", "#DDEBE2"];

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }
  fire(0.25, { spread: 26, startVelocity: 55, colors });
  fire(0.2, { spread: 60, colors });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors,
  });
  fire(0.1, { spread: 120, startVelocity: 45, colors });
}

type ModalType = "attend" | "decline" | null;

interface ModalState {
  type: ModalType;
  eventIndex: number | null;
}

/** Chỉ được chọn 1 trong 2: "06" = Chiều 06.04, "07" = Sáng 07.04 */
/** location_attend: 0 = Đi xe tự túc, 1 = Đi chung xe dâu rễ */
interface RSVPData {
  fullName: string;
  guests: string;
  message: string;
  attendDay: "06" | "07";
  location_attend: 0 | 1;
}

interface SubmittedState {
  [eventIndex: number]: "attend" | "decline";
}

/** Dữ liệu hiển thị popup "Cảm ơn" sau khi xác nhận tham dự */
interface ThankYouResult {
  fullName: string;
  attendDay: "06" | "07";
  guests: number;
  location_attend: 0 | 1;
}

function formatConfirmTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function formatDeadlineDisplay(deadline: string): string {
  const d = new Date(deadline);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** dd.MM.yyyy cho dòng RSVP */
function formatRsvpDeadline(deadline: string): string {
  const [y, m, d] = deadline.split("-");
  return `${d}.${m}.${y}`;
}

/** Thứ trong tuần tiếng Anh (TUESDAY, ...) cho 2026-04-07 */
function getDayOfWeek(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  return days[d.getDay()];
}

/** Lịch tháng (Monday = cột đầu). Trả về mảng 35 hoặc 42 ô: { day: number | null, isCurrentMonth } */
function getCalendarDays(
  year: number,
  month: number,
): { day: number | null; isCurrentMonth: boolean }[] {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const startPadding = first.getDay() === 0 ? 6 : first.getDay() - 1; // Mon=0
  const totalDays = last.getDate();
  const cells: { day: number | null; isCurrentMonth: boolean }[] = [];
  for (let i = 0; i < startPadding; i++)
    cells.push({ day: null, isCurrentMonth: false });
  for (let d = 1; d <= totalDays; d++)
    cells.push({ day: d, isCurrentMonth: true });
  const rest = 35 - cells.length;
  for (let i = 0; i < rest; i++)
    cells.push({ day: null, isCurrentMonth: false });
  return cells;
}

const CALENDAR_YEAR = 2026;
const CALENDAR_MONTH = 4;
const HIGHLIGHT_DAY = 7;
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTH_NAMES = [
  "",
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export function EventInfoSection() {
  const ctx = useFriend();
  const friend = ctx?.friend ?? null;
  const [isVisible, setIsVisible] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    type: null,
    eventIndex: null,
  });
  const [rsvpData, setRsvpData] = useState<RSVPData>({
    fullName: "",
    guests: "1",
    message: "",
    attendDay: "07",
    location_attend: 0,
  });
  const [nameError, setNameError] = useState(false);
  const [submitted, setSubmitted] = useState<SubmittedState>({});
  const [changeMode, setChangeMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [thankYouResult, setThankYouResult] = useState<ThankYouResult | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const pastDeadline = isPastRsvpDeadline(RSVP_DEADLINE);

  const hasFriendStatus =
    friend && (friend.status === "attend" || friend.status === "decline");

  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleChangeClick = useCallback(() => {
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    setIsFadingOut(true);
    fadeTimeoutRef.current = setTimeout(() => {
      fadeTimeoutRef.current = null;
      setChangeMode(true);
      setIsFadingOut(false);
    }, 300);
  }, []);

  const showButtons =
    !pastDeadline && (friend ? changeMode || !hasFriendStatus : true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const openModal = useCallback(
    (type: ModalType, eventIndex: number) => {
      const initialName = friend?.name ?? "";
      const initialGuests = friend?.guests_count
        ? String(Math.min(5, Math.max(1, friend.guests_count)))
        : "1";
      const initialMessage = friend?.message_attend ?? "";
      const ad = friend?.attend_days ?? "";
      const attendDay: "06" | "07" = ad.includes("06") ? "06" : "07";
      const location_attend: 0 | 1 =
        typeof friend?.location_attend === "number" && friend.location_attend === 1 ? 1 : 0;
      setRsvpData({
        fullName: initialName,
        guests: initialGuests,
        message: initialMessage,
        attendDay,
        location_attend,
      });
      setNameError(false);
      setModal({ type, eventIndex });
    },
    [friend],
  );

  const closeModal = useCallback(() => {
    setModal({ type: null, eventIndex: null });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (modal.eventIndex === null || modal.type === null) return;
    const nameTrimmed = rsvpData.fullName?.trim() ?? "";
    if (!nameTrimmed) {
      setNameError(true);
      return;
    }
    setNameError(false);

    const attend_days = rsvpData.attendDay;

    if (friend && ctx?.updateFriendLocal) {
      setSubmitting(true);
      try {
        const res = await fetch("/api/friends/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: friend.id,
            name: nameTrimmed,
            status: modal.type,
            location_attend: rsvpData.location_attend,
            guests_count: parseInt(rsvpData.guests, 10) || 1,
            message_attend: rsvpData.message,
            attend_days: attend_days,
          }),
        });
        if (!res.ok) throw new Error("Update failed");
        const updated = await res.json();
        ctx.updateFriendLocal(updated);
        setChangeMode(false);
      } finally {
        setSubmitting(false);
      }
    } else {
      setSubmitting(true);
      try {
        const res = await fetch("/api/friends", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: nameTrimmed,
            status: modal.type,
            location_attend: rsvpData.location_attend,
            guests_count: parseInt(rsvpData.guests, 10) || 1,
            message_attend: rsvpData.message ?? "",
            attend_days: attend_days,
          }),
        });
        if (!res.ok) throw new Error("Create failed");
        const created = await res.json();
        if (created?.url_invitation) {
          window.location.href = created.url_invitation;
          return;
        }
      } finally {
        setSubmitting(false);
      }
      setSubmitted((prev) => ({
        ...prev,
        [modal.eventIndex!]: modal.type!,
      }));
    }
    if (modal.type === "attend") {
      fireRsvpConfetti();
      window.dispatchEvent(new CustomEvent("rsvp-confirmed"));
      setThankYouResult({
        fullName: nameTrimmed,
        attendDay: rsvpData.attendDay,
        guests: parseInt(rsvpData.guests, 10) || 1,
        location_attend: rsvpData.location_attend,
      });
    }
    closeModal();
  }, [modal, rsvpData, friend, ctx, closeModal]);

  const calendarDays = getCalendarDays(CALENDAR_YEAR, CALENDAR_MONTH);
  const event = events[0];
  const originalIndex = 0;
  const isConfirmedHere =
    friend && friend.status === "attend";
  const status = friend
    ? showButtons
      ? undefined
      : isConfirmedHere
        ? "attend"
        : friend.status === "decline"
          ? "decline"
          : undefined
    : submitted[originalIndex];
  const showBadge = Boolean(status);
  const showChangeOnly =
    !pastDeadline &&
    friend &&
    hasFriendStatus &&
    !changeMode &&
    friend.status === "attend" &&
    !isConfirmedHere;
  const showChangeButton = Boolean(
    !pastDeadline &&
    friend &&
    hasFriendStatus &&
    !changeMode &&
    (isConfirmedHere || friend.status === "decline"),
  );

  return (
    <section
      id="events"
      ref={ref}
      className="relative lg:h-screen py-20 md:py-32 px-4 flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: "url(/images/bg-section.png)" }}
        aria-hidden
      />
      <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 flex items-center justify-center py-6">
        {/* Card hai cột giống template Save Our Date */}
        <div
          className={`w-full max-w-4xl bg-white/90 rounded-2xl border border-[#E8E4E0] shadow-xl overflow-hidden transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] min-h-[420px]">
            {/* Cột trái: ảnh trong khung rose gold + lá trang trí */}
            <div className="relative flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#FDF8F6] to-[#F8F4F0]">
              <div className="relative w-full max-w-[280px] aspect-[3/4]">
                <div
                  className="absolute inset-0 rounded-lg overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)",
                    padding: "6px",
                    background:
                      "linear-gradient(135deg, #C9A88E 0%, #B8956E 40%, #D4B896 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.4), 0 6px 20px rgba(0,0,0,0.12)",
                  }}
                >
                  <div className="relative w-full h-full rounded-[6px] overflow-hidden bg-gray-100">
                    <Image
                      src="/images/calendar.jpg"
                      alt="Ảnh cưới"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                {/* Lá trang trí teal nhạt */}
                <div
                  className="absolute -top-2 -right-2 w-16 h-20 opacity-90"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 40 50"
                    fill="none"
                    className="w-full h-full"
                  >
                    <path
                      d="M20 2 Q35 15 25 35 Q15 25 20 48"
                      fill="#5A8A7A"
                      opacity={0.85}
                    />
                    <path d="M20 8 Q28 18 22 38" fill="#4A7A6A" opacity={0.7} />
                  </svg>
                </div>
                <div
                  className="absolute -bottom-1 -left-2 w-14 h-16 opacity-80"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 35 40"
                    fill="none"
                    className="w-full h-full"
                  >
                    <path
                      d="M15 2 Q2 20 18 38 Q28 22 15 2"
                      fill="#5A8A7A"
                      opacity={0.85}
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Cột phải: Save Our Date, tên, ngày, lịch, địa điểm, RSVP */}
            <div className="flex flex-col justify-center p-6 md:p-8 text-left">
              <p
                className="font-script text-2xl md:text-3xl mb-2"
                style={{
                  color: "#B8956E",
                  fontFamily: "var(--font-pinyon-script), cursive",
                }}
              >
                Save Our Date
              </p>
              <p className="text-[#3A3A3A] font-semibold text-sm md:text-base tracking-[0.2em] uppercase mb-1">
                {COUPLE_NAME}
              </p>
              <p className="text-[#5C5C5C] text-xs md:text-sm tracking-widest mb-4">
                {WEDDING_DATE_DISPLAY} | {getDayOfWeek(WEDDING_DATE)}
              </p>

              {/* Lịch tháng 4/2026, highlight ngày 7 */}
              <div className="mb-4">
                <p className="text-[#3A3A3A] text-xs font-semibold tracking-wider mb-2">
                  {MONTH_NAMES[CALENDAR_MONTH]} {CALENDAR_YEAR}
                </p>
                <div className="grid grid-cols-7 gap-0.5 text-center">
                  {WEEKDAYS.map((w) => (
                    <span
                      key={w}
                      className="text-[10px] text-[#5C5C5C] font-medium py-0.5"
                    >
                      {w}
                    </span>
                  ))}
                  {calendarDays.map((cell, i) => (
                    <div
                      key={i}
                      className="relative flex items-center justify-center min-h-[28px]"
                    >
                      {cell.day !== null ? (
                        cell.day === HIGHLIGHT_DAY ? (
                          <span
                            className="relative z-10 w-7 h-7 flex items-center justify-center rounded-full text-white text-xs font-semibold"
                            style={{
                              background:
                                "linear-gradient(135deg, #C9A88E 0%, #B8956E 100%)",
                              boxShadow: "0 2px 8px rgba(184,149,110,0.4)",
                            }}
                          >
                            {cell.day}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#3A3A3A]">
                            {cell.day}
                          </span>
                        )
                      ) : (
                        <span className="text-[11px] text-[#BBB]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[#3A3A3A] text-xs font-semibold tracking-wider uppercase mb-1">
                {event.venue}
              </p>
              <p className="text-[#5C5C5C] text-[11px] tracking-wide mb-3">
                {event.address}
              </p>
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#B8956E] font-medium hover:underline mb-4"
              >
                <MapPin className="w-3.5 h-3.5" />
                Xem bản đồ
              </a>

              <p className="text-[11px] text-[#5C5C5C] mb-4">
                <span className="text-[#3A3A3A]">RSVP</span> by{" "}
                {formatRsvpDeadline(RSVP_DEADLINE)}
              </p>

              {/* RSVP buttons / badge / thay đổi */}
              {showBadge ? (
                <div
                  className={`flex flex-col gap-2 w-full justify-center transition-opacity duration-300 ${isFadingOut ? "opacity-0" : "opacity-100"}`}
                >
                  <span
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium w-full ${
                      status === "attend"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    {status === "attend"
                      ? "Đã xác nhận tham dự"
                      : "Đã gửi lời chúc"}
                  </span>
                  {showChangeButton && (
                    <button
                      type="button"
                      onClick={handleChangeClick}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-[#E8E4E0] text-[#5C5C5C] text-xs w-full hover:border-[#B8956E]/50 transition-all"
                    >
                      <Pencil className="w-3 h-3 shrink-0" />
                      Thay đổi
                    </button>
                  )}
                </div>
              ) : null}
              {showButtons ? (
                <div
                  className={`flex flex-wrap gap-2 justify-center transition-opacity duration-300 ${changeMode && friend ? "animate-in fade-in duration-300" : ""}`}
                >
                  <button
                    onClick={() => openModal("attend", originalIndex)}
                    className="px-4 py-2.5 rounded-full text-white text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(135deg, #C9A88E 0%, #B8956E 100%)",
                    }}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Xác nhận tham dự
                  </button>
                  <button
                    onClick={() => openModal("decline", originalIndex)}
                    className="px-4 py-2.5 rounded-full border-2 border-[#D4C4B0] text-[#5C5C5C] text-xs font-medium flex items-center gap-2 hover:border-[#B8956E] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Không thể tham dự
                  </button>
                </div>
              ) : null}
              {showChangeOnly ? (
                <div
                  className={`transition-opacity duration-300 ${isFadingOut ? "opacity-0" : "opacity-100"}`}
                >
                  <button
                    type="button"
                    onClick={handleChangeClick}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8E4E0] text-[#5C5C5C] text-xs w-fit hover:border-[#B8956E]/50 transition-all"
                  >
                    <Pencil className="w-3 h-3" />
                    Thay đổi
                  </button>
                </div>
              ) : null}
              {pastDeadline && !showBadge && !showChangeOnly ? (
                <p className="text-xs text-[#5C5C5C]">
                  Đã hết hạn xác nhận (Hạn:{" "}
                  {formatDeadlineDisplay(RSVP_DEADLINE)})
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <a
        href="#gallery"
        className="hidden lg:block absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce text-muted-foreground hover:text-primary transition-colors"
        aria-label="Cuộn xuống"
      >
        <ChevronDown className="w-6 h-6 mx-auto" />
      </a>

      {/* Modal overlay */}
      {modal.type !== null && modal.eventIndex !== null && (
        <div
          className="fixed inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={closeModal}
        >
          <div
            className="bg-card rounded-3xl p-8 md:p-10 max-w-2xl w-full border border-border shadow-lg animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {modal.type === "attend" ? (
              /* Attend modal */
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-foreground italic mb-1">
                    {"Xác Nhận Tham Dự"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {events[modal.eventIndex].title} &mdash;{" "}
                    {events[modal.eventIndex].time},{" "}
                    {events[modal.eventIndex].date}
                  </p>
                  {friend?.status === "attend" && friend?.time_attend && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {"Đã xác nhận lúc: "}
                      {formatConfirmTime(friend.time_attend)}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      className="text-sm text-muted-foreground block"
                      htmlFor="attend-fullName"
                    >
                      {"Họ tên"} <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="attend-fullName"
                      type="text"
                      required
                      value={rsvpData.fullName}
                      onChange={(e) => {
                        setRsvpData((d) => ({
                          ...d,
                          fullName: e.target.value,
                        }));
                        setNameError(false);
                      }}
                      disabled={!!friend}
                      placeholder={friend ? undefined : "Nhập họ tên của bạn"}
                      className={`w-full px-4 py-3 rounded-2xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-muted/30 ${nameError ? "border-destructive" : "border-border"}`}
                    />
                    {nameError && (
                      <p className="text-xs text-destructive">
                        Vui lòng nhập họ tên
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground block">
                      {"Số người đi cùng"}
                    </label>
                    <select
                      value={rsvpData.guests}
                      onChange={(e) =>
                        setRsvpData((d) => ({ ...d, guests: e.target.value }))
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={String(num)}>
                          {num} {"người"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid ">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground block">
                        {"Tham gia vào"}
                      </label>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="attendDay"
                            value="06"
                            checked={rsvpData.attendDay === "06"}
                            onChange={() =>
                              setRsvpData((d) => ({ ...d, attendDay: "06" }))
                            }
                            className="w-4 h-4 border-border text-primary focus:ring-primary/30"
                          />
                          <span className="text-sm text-foreground">
                            Chiều 06.04.2026
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="attendDay"
                            value="07"
                            checked={rsvpData.attendDay === "07"}
                            onChange={() =>
                              setRsvpData((d) => ({ ...d, attendDay: "07" }))
                            }
                            className="w-4 h-4 border-border text-primary focus:ring-primary/30"
                          />
                          <span className="text-sm text-foreground">
                            Sáng 07.04.2026
                          </span>
                        </label>
                      </div>
                    </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground block">
                        {"Phương tiện"}
                      </label>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="location_attend"
                            value="0"
                            checked={rsvpData.location_attend === 0}
                            onChange={() =>
                              setRsvpData((d) => ({ ...d, location_attend: 0 }))
                            }
                            className="w-4 h-4 border-border text-primary focus:ring-primary/30"
                          />
                          <span className="text-sm text-foreground">
                            Đi xe tự túc
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="location_attend"
                            value="1"
                            checked={rsvpData.location_attend === 1}
                            onChange={() =>
                              setRsvpData((d) => ({ ...d, location_attend: 1 }))
                            }
                            className="w-4 h-4 border-border text-primary focus:ring-primary/30"
                          />
                          <span className="text-sm text-foreground">
                            Đi chung xe dâu rễ
                          </span>
                        </label>
                      </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground block">
                      {"Lời chúc cho đời vợ chồng trẻ"}
                    </label>
                    <textarea
                      value={rsvpData.message}
                      onChange={(e) =>
                        setRsvpData((d) => ({ ...d, message: e.target.value }))
                      }
                      rows={3}
                      placeholder={"Viết lời chúc..."}
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-3 rounded-full border-2 border-border text-muted-foreground font-medium text-sm hover:border-primary/30 transition-all"
                    >
                      {"Hủy"}
                    </button>
                    <button
                      onClick={() => void handleSubmit()}
                      disabled={submitting}
                      className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:pointer-events-none"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? "Đang gửi..." : "Xác Nhận"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Decline modal */
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-muted-foreground/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-foreground italic mb-1">
                    {"Gửi Lời Chúc"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {
                      " Rất tiếc vì bạn không thể đến, hay gửi lời chúc cho chúng mình nhé!"
                    }
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      className="text-sm text-muted-foreground block"
                      htmlFor="decline-fullName"
                    >
                      {"Họ tên"} <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="decline-fullName"
                      type="text"
                      required
                      value={rsvpData.fullName}
                      onChange={(e) => {
                        setRsvpData((d) => ({
                          ...d,
                          fullName: e.target.value,
                        }));
                        setNameError(false);
                      }}
                      disabled={!!friend}
                      placeholder={friend ? undefined : "Nhập họ tên của bạn"}
                      className={`w-full px-4 py-3 rounded-2xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-muted/30 ${nameError ? "border-destructive" : "border-border"}`}
                    />
                    {nameError && (
                      <p className="text-xs text-destructive">
                        Vui lòng nhập họ tên
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground block">
                      {"Lời chúc cho đời vợ chồng trẻ"}
                    </label>
                    <textarea
                      value={rsvpData.message}
                      onChange={(e) =>
                        setRsvpData((d) => ({ ...d, message: e.target.value }))
                      }
                      rows={4}
                      placeholder={"Viết lời chúc..."}
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-3 rounded-full border-2 border-border text-muted-foreground font-medium text-sm hover:border-primary/30 transition-all"
                    >
                      {"Hủy"}
                    </button>
                    <button
                      onClick={() => void handleSubmit()}
                      disabled={submitting}
                      className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:pointer-events-none"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? "Đang gửi..." : "Xác Nhận"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Popup "Cảm ơn" sau khi xác nhận tham dự */}
      {thankYouResult !== null && (
        <div
          className="fixed inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4"
          onClick={() => setThankYouResult(null)}
        >
          <div
            className="bg-card rounded-3xl p-8 md:p-10 max-w-lg w-full border border-border shadow-lg animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-primary" fill="currentColor" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-foreground italic mb-1">
                Cảm ơn {thankYouResult.fullName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Chúng mình đã ghi nhận thông tin của bạn.
              </p>
            </div>
            <dl className="space-y-3 text-sm mb-6">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Ngày đi</dt>
                <dd className="font-medium text-foreground">
                  {thankYouResult.attendDay === "06" ? "06/04/2026" : "07/04/2026"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Số người đi cùng</dt>
                <dd className="font-medium text-foreground">
                  {thankYouResult.guests} {thankYouResult.guests === 1 ? "người" : "người"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Phương tiện đi lại</dt>
                <dd className="font-medium text-foreground">
                  {thankYouResult.location_attend === 0 ? "Đi xe tự túc" : "Đi chung xe dâu rễ"}
                </dd>
              </div>
            </dl>
            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 text-sm text-foreground">
              {thankYouResult.location_attend === 1 && thankYouResult.attendDay === "06" && (
                <p>
                  Xe sẽ đón ở 189 Dương Bá Trạc, P1, Q8 vào lúc{" "}
                  <span className="font-semibold text-primary">13:00 ngày 06/04/2026</span>.
                </p>
              )}
              {thankYouResult.location_attend === 1 && thankYouResult.attendDay === "07" && (
                <p>
                  Xe sẽ đón ở 189 Dương Bá Trạc, P1, Q8 vào lúc{" "}
                  <span className="font-semibold text-primary">06:00 ngày 07/04/2026</span>.
                </p>
              )}
              {thankYouResult.location_attend === 0 && thankYouResult.attendDay === "06" && (
                <p>
                  Hẹn gặp bạn lúc{" "}
                  <span className="font-semibold text-primary">18h ngày 06/04/2026</span> tại{" "}
                  <a
                    href={events[0].mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline font-medium"
                  >
                    địa điểm (xem bản đồ)
                  </a>
                  .
                </p>
              )}
              {thankYouResult.location_attend === 0 && thankYouResult.attendDay === "07" && (
                <p>
                  Hẹn gặp bạn lúc{" "}
                  <span className="font-semibold text-primary">10h ngày 07/04/2026</span> tại{" "}
                  <a
                    href={events[0].mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline font-medium"
                  >
                    địa điểm (xem bản đồ)
                  </a>
                  .
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setThankYouResult(null)}
              className="w-full mt-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
