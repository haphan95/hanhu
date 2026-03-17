"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { GROOM_NAME, BRIDE_NAME, WEDDING_DATE_DISPLAY, WEDDING_DATETIME } from "@/lib/wedding-config"

function calculateTimeLeft() {
  const weddingDate = new Date(WEDDING_DATETIME).getTime()
  const now = new Date().getTime()
  const diff = weddingDate - now

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

export function HeroSection() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="hero" className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden bg-[#FAF8F6]"
    
    >
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
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
          <span className="mx-3 md:mx-5 text-3xl md:text-5xl lg:text-6xl inline-block align-middle" style={{ color: "#A85A62" }}>
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
          <p className="text-lg md:text-2xl font-serif tracking-widest" style={{ color: "#8B3A3A" }}>
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
              <span className="text-2xl md:text-4xl font-serif tabular-nums" style={{ color: "#8B3A3A" }}>
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-widest mt-1" style={{ color: "#A85A62" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          className={`mt-16 animate-bounce transition-all duration-1000 delay-1000 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <a href="#invitation" aria-label="Cuộn xuống">
            <ChevronDown className="w-6 h-6 mx-auto" style={{ color: "#B8707A" }} />
          </a>
        </div>
      </div>
    </section>
  )
}
