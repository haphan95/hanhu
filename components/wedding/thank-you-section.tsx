"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Heart, ChevronDown, Users } from "lucide-react"
import { motion } from "framer-motion"
import { COUPLE_NAME } from "@/lib/wedding-config"
import { getPronouns } from "@/lib/pronoun"
import { SparkleText } from "@/components/wedding/sparkle-text"
import { useFriend } from "@/context/friend-context"

interface AttendedFriend {
  id: number
  name: string
  status?: string
  attend_days?: string
  guests_count?: number
  email?: string
  message_attend?: string
}

function GuestListTable({
  title,
  guests,
  isVisible,
}: {
  title: string
  guests: AttendedFriend[]
  isVisible: boolean
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
          {guests.length} khách tham gia
        </p>
      </div>
      <div className="overflow-auto max-h-[280px] md:max-h-[320px]">
        {guests.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8 px-4 italic">
            Chưa có khách nào tham gia
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {guests.map((guest, index) => (
              <li
                key={guest.id}
                className="px-4 py-3 hover:bg-primary/5 transition-colors duration-200 group"
              >
                <div className="flex gap-3 md:gap-4 items-center">
                  <span className="text-muted-foreground text-sm font-medium w-7 shrink-0 tabular-nums">
                    {index + 1}.
                  </span>
                  <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {guest.email == '' ? guest.name : guest.email}
                    </p>
                    {guest.message_attend?.trim() ? (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 italic ml-2">
                        &ldquo;{guest.message_attend.trim()}&rdquo;
                      </p>
                    ) : null}
                    <span
                      className="inline-flex items-center gap-1 text-muted-foreground text-xs"
                      title="Số người đi kèm"
                    >
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span className="tabular-nums">{guest.guests_count ?? 0}</span>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}

export function ThankYouSection() {
  const ctx = useFriend()
  const displayName = ctx?.friend?.name ?? "bạn"
  const { self, guest } = getPronouns(displayName)
  const [isVisible, setIsVisible] = useState(false)
  const [listDay06, setListDay06] = useState<AttendedFriend[]>([])
  const [listDay07, setListDay07] = useState<AttendedFriend[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const fetchGuests = useCallback(() => {
    let cancelled = false
    fetch("/api/friends")
      .then((res) => res.json())
      .then((data: AttendedFriend[]) => {
        if (cancelled || !Array.isArray(data)) return
        const attended = data.filter((g) => g.status === "attend")
        const day06 = attended.filter((g) => (g.attend_days ?? "").includes("06"))
        const day07 = attended.filter((g) => (g.attend_days ?? "").includes("07") || (g.attend_days ?? "") === "")
        setListDay06(day06)
        setListDay07(day07)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    fetchGuests()
  }, [fetchGuests])

  useEffect(() => {
    const onRsvpConfirmed = () => fetchGuests()
    window.addEventListener("rsvp-confirmed", onRsvpConfirmed)
    return () => window.removeEventListener("rsvp-confirmed", onRsvpConfirmed)
  }, [fetchGuests])

  return (
    <footer
      id="thank-you"
      ref={ref}
      className="relative min-h-screen py-12 md:py-16 px-4 overflow-y-auto text-center flex flex-col items-center"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: "url(/images/bg-section.png)" }}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <div
          className={`w-full max-w-2xl mb-10 md:mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="bg-card rounded-3xl shadow-xl shadow-primary/10 border border-border p-8 md:p-10 text-center">
            <Heart className="w-10 h-10 text-primary mx-auto mb-6 animate-pulse" fill="currentColor" stroke="currentColor" strokeWidth={1.5} />

            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground italic mb-5">
              Cảm ơn{" "}
              <span className="font-[var(--font-pacifico)] text-primary">{displayName}</span>
              {" "}vì đã ở đây!
            </h2>

            <p className="text-foreground/90 leading-relaxed text-sm md:text-base mb-4">
              Chỉ riêng việc {guest} đọc lời mời này đã khiến {self} rất vui.
            </p>
            <p className="text-foreground/90 leading-relaxed text-sm md:text-base mb-6">
              Hy vọng sẽ được gặp {guest} trong ngày trọng đại sắp tới.
            </p>

            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-14 bg-primary/80 min-w-[3rem]" />
              <span className="font-script text-xl md:text-2xl lg:text-3xl font-normal text-primary tracking-wide shrink-0">
                <SparkleText>{COUPLE_NAME}</SparkleText>
              </span>
              <div className="h-px w-14 bg-primary/80 min-w-[3rem]" />
            </div>

            <p className="text-xs text-foreground/70 tracking-widest uppercase font-medium">
              {"#Ha&Nhu2026"}
            </p>
          </div>
        </div>

        <div className="w-24 h-px bg-primary/40 rounded-full mb-8" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-serif text-xl md:text-2xl text-foreground italic mb-6 text-center"
        >
          Danh sách khách xác nhận
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl">
          <GuestListTable
            title="Chiều ngày 06.04.2026"
            guests={listDay06}
            isVisible={isVisible}
          />
          <GuestListTable
            title="Sáng ngày 07.04.2026"
            guests={listDay07}
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
  )
}
