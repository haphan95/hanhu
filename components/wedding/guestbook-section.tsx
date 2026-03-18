"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, ChevronDown, Users } from "lucide-react";
import { motion } from "framer-motion";
import { COUPLE_NAME } from "@/lib/wedding-config";
import { SparkleText } from "@/components/wedding/sparkle-text";
import { useFriend } from "@/context/friend-context";

type Guest = {
  id: number;
  name: string;
  status: string;
  location_attend: number;
  time_attend: string;
  message_attend: string;
};

// location_attend: 0 = Đi xe tự túc, 1 = Đi chung xe dâu rễ
const TRANSPORT_LABELS: Record<number, string> = {
  0: "Đi xe tự túc",
  1: "Đi chung xe dâu rễ",
};

function GuestbookTable({
  title,
  guests,
  isVisible,
}: {
  title: string;
  guests: Guest[];
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col rounded-2xl border border-border bg-card/80 shadow-lg shadow-primary/5 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border bg-primary/5">
        <h3 className="font-serif text-lg md:text-xl text-foreground italic flex items-center justify-center gap-2">
          <Users className="w-5 h-5 text-primary shrink-0" />
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {guests.length} khách xác nhận
        </p>
      </div>
      <div className="overflow-auto max-h-[280px] md:max-h-[320px]">
        {guests.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8 px-4 italic">
            Chưa có khách nào xác nhận
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {guests.map((guest, index) => (
              <li
                key={guest.id}
                className="px-4 py-3 hover:bg-primary/5 transition-colors duration-200 group"
              >
                <div className="flex gap-3 md:gap-4 items-start">
                  <span className="text-muted-foreground text-sm font-medium w-7 shrink-0 tabular-nums">
                    {index + 1}.
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {guest.name}
                    </p>
                    {guest.message_attend?.trim() ? (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 italic">
                        &ldquo;{guest.message_attend.trim()}&rdquo;
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export function GuestbookSection() {
  const ctx = useFriend();
  const displayName = ctx?.friend?.name ?? "bạn";
  const [isVisible, setIsVisible] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const fetchGuests = useCallback(() => {
    fetch("/api/friends")
      .then((res) => res.json())
      .then((data: Guest[]) => {
        const attended = (data ?? []).filter(
          (g) => g.status === "attend" && typeof g.location_attend === "number"
        );
        setGuests(attended);
      })
      .catch(() => setGuests([]));
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  useEffect(() => {
    const onRsvpConfirmed = () => fetchGuests();
    window.addEventListener("rsvp-confirmed", onRsvpConfirmed);
    return () => window.removeEventListener("rsvp-confirmed", onRsvpConfirmed);
  }, [fetchGuests]);

  const vuQuyGuests = guests.filter((g) => g.location_attend === 0);
  const tanHonGuests = guests.filter((g) => g.location_attend === 1);

  return (
    <footer
      id="guestbook"
      ref={ref}
      className="relative min-h-screen py-12 md:py-16 px-4 overflow-y-auto overflow-x-hidden flex flex-col items-center"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: "url(/images/bg-section.png)" }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Thank-you card - large, centered, fade-in */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-2xl mb-10 md:mb-12"
        >
          <div className="bg-card rounded-3xl shadow-xl shadow-primary/10 border border-border p-10 md:p-14 text-center">
            <Heart
              className="w-14 h-14 text-primary mx-auto mb-8 animate-pulse"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={1.5}
            />
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground italic mb-6">
              Cảm ơn{" "}
              <span className="font-[var(--font-pacifico)] text-primary">
                {displayName}
              </span>{" "}
              vì đã ở đây!
            </h2>
            <p className="text-foreground/90 leading-relaxed text-base md:text-lg mb-4">
              Chỉ riêng việc bạn đọc lời mời này đã khiến chúng mình rất vui.
            </p>
            <p className="text-foreground/90 leading-relaxed text-base md:text-lg mb-8">
              Hy vọng sẽ được gặp bạn trong ngày trọng đại sắp tới.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-primary/80 min-w-[4rem]" />
              <span className="font-script text-xl md:text-2xl lg:text-3xl font-normal text-primary tracking-wide shrink-0">
                <SparkleText>{COUPLE_NAME}</SparkleText>
              </span>
              <div className="h-px w-16 bg-primary/80 min-w-[4rem]" />
            </div>
            <p className="text-xs text-foreground/70 tracking-widest uppercase font-medium">
              #Ha&Nhu2026
            </p>
          </div>
        </motion.div>

        {/* Elegant separator */}
        <div className="w-24 h-px bg-primary/40 rounded-full mb-8" />

        {/* Section title */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-serif text-xl md:text-2xl text-foreground italic mb-6 text-center"
        >
          Danh sách khách xác nhận
        </motion.p>

        {/* Two guestbook tables: desktop side by side, mobile stacked */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl">
          <GuestbookTable
            title={TRANSPORT_LABELS[0] ?? "Đi xe tự túc"}
            guests={vuQuyGuests}
            isVisible={isVisible}
          />
          <GuestbookTable
            title={TRANSPORT_LABELS[1] ?? "Đi chung xe dâu rễ"}
            guests={tanHonGuests}
            isVisible={isVisible}
          />
        </div>
      </div>

      <a
        href="#hero"
        className="hidden lg:block absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce text-muted-foreground hover:text-primary transition-colors"
        aria-label="Về đầu trang"
      >
        <ChevronDown className="w-6 h-6 mx-auto rotate-180" />
      </a>
    </footer>
  );
}
