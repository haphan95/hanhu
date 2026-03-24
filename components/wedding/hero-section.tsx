"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  GROOM_NAME,
  BRIDE_NAME,
  WEDDING_DATE_DISPLAY,
  WEDDING_DATETIME,
} from "@/lib/wedding-config";

const WISH_ROTATE_MS = 5000;
/** Khoảng cách giữa lần trượt hàng 1 và hàng 2 (tuần tự). */
const WISH_SLOT_STAGGER_MS = 8;
/** Giới hạn cao tối đa, nội dung ôm sát nhau; cuộn khi quá dài. */
const WISH_BOX_CLASS = "min-h-[18.5rem] md:min-h-[22rem]";
const WISH_BOX_SINGLE_CLASS = "min-h-[13rem] md:min-h-[15rem]";

type FriendWishSource = {
  id: number;
  name: string;
  email?: string;
  status?: string;
  message_attend?: string;
  time_attend?: string;
};

type WishLine = { id: number; displayName: string; text: string };

function parseTimeAttend(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : t;
}

function sortWishesNewestFirst(rows: FriendWishSource[]): FriendWishSource[] {
  return [...rows].sort((a, b) => {
    const ta = parseTimeAttend(a.time_attend);
    const tb = parseTimeAttend(b.time_attend);
    if (ta === null && tb === null) return a.id - b.id;
    if (ta === null) return 1;
    if (tb === null) return -1;
    if (tb !== ta) return tb - ta;
    return a.id - b.id;
  });
}

function buildWishLines(data: FriendWishSource[]): WishLine[] {
  const attended = data.filter((g) => g.status === "attend");
  const withMessage = attended.filter(
    (g) => (g.message_attend ?? "").trim().length > 0,
  );
  return sortWishesNewestFirst(withMessage).map((g) => ({
    id: g.id,
    displayName: (g.email ?? "").trim() === "" ? g.name : (g.email ?? "").trim(),
    text: (g.message_attend ?? "").trim(),
  }));
}

function calculateTimeLeft() {
  const weddingDate = new Date(WEDDING_DATETIME).getTime();
  const now = new Date().getTime();
  const diff = weddingDate - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function WishRowCard({
  wish,
  position,
}: {
  wish: WishLine;
  position: "single" | "top" | "bottom";
}) {
  const shellClass = position === "single" ? "relative shrink-0" : position === "top"
        ? "relative shrink-0 border-b border-rose-200/45 pb-2" : "relative shrink-0 pt-2";

  return (
    <div className={shellClass}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={wish.id}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
          className="pr-1 text-left"
        >
          <motion.p
            className="text-sm font-bold text-[#5c2830] not-italic mb-1"
            style={{ textShadow: "0 1px 0 rgba(255,255,255,0.5)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
          >
            {wish.displayName}
          </motion.p>
          <motion.p
            className="text-sm md:text-[0.9375rem] leading-relaxed font-medium italic text-[#2a181c] whitespace-pre-wrap break-words"
            style={{ textShadow: "0 1px 0 rgba(255,255,255,0.5)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.1, ease: "easeOut" }}
          >
            &ldquo;{wish.text}&rdquo;
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function HeroSection() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);
  const [wishes, setWishes] = useState<WishLine[]>([]);
  /** Chỉ số vào mảng wishes cho hàng trên / hàng dưới (2 người). */
  const [idxTop, setIdxTop] = useState(0);
  const [idxBottom, setIdxBottom] = useState(1);
  const staggerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchWishes = useCallback(() => {
    let cancelled = false;
    fetch("/api/friends")
      .then((res) => res.json())
      .then((data: unknown) => {
        if (cancelled || !Array.isArray(data)) return;
        setWishes(buildWishLines(data as FriendWishSource[]));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return fetchWishes();
  }, [fetchWishes]);

  useEffect(() => {
    const onRsvp = () => fetchWishes();
    window.addEventListener("rsvp-confirmed", onRsvp);
    return () => window.removeEventListener("rsvp-confirmed", onRsvp);
  }, [fetchWishes]);

  const wishCount = wishes.length;

  const wishTop = wishCount > 0 ? wishes[idxTop % wishCount]! : null;
  const wishBottom = wishCount > 0 ? wishes[(wishCount >= 2 ? idxBottom : idxTop) % wishCount]! : null;

  useEffect(() => {
    if (wishCount >= 2) {
      setIdxTop(0);
      setIdxBottom(1);
    } else if (wishCount === 1) {
      setIdxTop(0);
      setIdxBottom(0);
    }
  }, [wishes, wishCount]);

  useEffect(() => {
    if (wishCount < 1) return;

    const clearStagger = () => {
      if (staggerTimeoutRef.current !== null) {
        clearTimeout(staggerTimeoutRef.current);
        staggerTimeoutRef.current = null;
      }
    };

    if (wishCount === 1) {
      const id = window.setInterval(() => {
        setIdxTop((i) => (i + 1) % wishCount);
      }, WISH_ROTATE_MS);
      return () => {
        clearInterval(id);
        clearStagger();
      };
    }

    const tick = () => {
      clearStagger();
      setIdxTop((i) => (i + 1) % wishCount);
      staggerTimeoutRef.current = setTimeout(() => {
        setIdxBottom((i) => (i + 1) % wishCount);
        staggerTimeoutRef.current = null;
      }, WISH_SLOT_STAGGER_MS);
    };

    const id = window.setInterval(tick, WISH_ROTATE_MS);
    return () => {
      clearInterval(id);
      clearStagger();
    };
  }, [wishCount]);

  return (
    <section
      id="hero"
      className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden bg-[#FAF8F6]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: "url(/images/hero-wedding.jpg)" }}
        aria-hidden
      />
      {/* Trang trí nhẹ - chấm hồng mờ */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-rose-200/30 blur-2xl" />
      <div className="absolute bottom-40 right-10 w-32 h-32 rounded-full bg-rose-100/40 blur-3xl" />

      <div className="relative z-10 text-center px-4">
        <p
          className={`text-sm md:text-base tracking-[0.3em] uppercase mb-6 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ color: "#B8707A" }}
        >
          Save Our Date
        </p>

        <h1
          className={`font-serif text-5xl md:text-7xl lg:text-8xl tracking-wide mb-4 transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ color: "#8B3A3A" }}
        >
          <span className="italic">{GROOM_NAME}</span>
          <span
            className="mx-3 md:mx-5 text-3xl md:text-5xl lg:text-6xl inline-block align-middle"
            style={{ color: "#A85A62" }}
          >
            &
          </span>
          <span className="italic">{BRIDE_NAME}</span>
        </h1>

        <div
          className={`flex items-center justify-center gap-3 mb-10 transition-all duration-1000 delay-400 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="h-px w-12 md:w-20 bg-rose-300/60" />
          <p
            className="text-lg md:text-2xl font-serif tracking-widest"
            style={{ color: "#8B3A3A" }}
          >
            {WEDDING_DATE_DISPLAY}
          </p>
          <div className="h-px w-12 md:w-20 bg-rose-300/60" />
        </div>

        <p
          className={`text-sm md:text-base italic mb-12 transition-all duration-1000 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ color: "#A85A62" }}
        >
          {"Chúng mình chính thức về chung một nhà"}
        </p>

        {/* Countdown */}
        <div
          className={`flex items-center justify-center gap-3 md:gap-6 transition-all duration-1000 delay-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {[
            { value: timeLeft.days, label: "Ngày" },
            { value: timeLeft.hours, label: "Giờ" },
            { value: timeLeft.minutes, label: "Phút" },
            { value: timeLeft.seconds, label: "Giây" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center bg-white/80 backdrop-blur-md rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] border border-rose-200/80 shadow-sm"
            >
              <span
                className="text-2xl md:text-4xl font-serif tabular-nums"
                style={{ color: "#8B3A3A" }}
              >
                {String(item.value).padStart(2, "0")}
              </span>
              <span
                className="text-[10px] md:text-xs uppercase tracking-widest mt-1"
                style={{ color: "#A85A62" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* 2 lời chúc cùng lúc; mỗi 5s trượt hàng trên trước, ~0.5s sau trượt hàng dưới */}
        {wishCount > 0 && wishTop ? (
          <div
            className={`w-full max-w-lg mx-auto mt-8 md:mt-10 text-left transition-all duration-1000 delay-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="px-4 py-3">
              <div
                className={`relative flex flex-col ${
                  wishCount >= 2 ? WISH_BOX_CLASS : WISH_BOX_SINGLE_CLASS
                }`}
              >
                <WishRowCard
                  wish={wishTop}
                  position={wishCount >= 2 ? "top" : "single"}
                />
                {wishCount >= 2 && wishBottom ? (
                  <WishRowCard wish={wishBottom} position="bottom" />
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* Scroll indicator: chỉ hiện trên desktop */}
        <div
          className={`hidden lg:block mt-16 animate-bounce transition-all duration-1000 delay-1000 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <a href="#invitation" aria-label="Cuộn xuống">
            <ChevronDown
              className="w-6 h-6 mx-auto"
              style={{ color: "#B8707A" }}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
