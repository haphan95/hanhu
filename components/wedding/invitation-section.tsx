"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, ChevronDown } from "lucide-react"
import { useFriend } from "@/context/friend-context"
import { COUPLE_NAME } from "@/lib/wedding-config"
import { SparkleText } from "@/components/wedding/sparkle-text"

export function InvitationSection() {
  const ctx = useFriend()
  const displayName = ctx?.friend?.name ?? "Bạn thân ơi"
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="invitation"
      ref={ref}
      className="relative min-h-screen h-screen py-20 md:py-32 px-4 flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: "url(/images/bg-section.png)" }}
        aria-hidden
      />
      <div
        className={`relative z-10 max-w-xl w-full bg-card rounded-3xl shadow-xl shadow-primary/10 p-8 md:p-12 border border-border text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Decorative heart - đậm hơn */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
            <Heart className="w-7 h-7 text-primary animate-pulse" fill="currentColor" stroke="currentColor" strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-2 italic">
          <span className="font-serif text-primary">{displayName}</span>{" "} ơi, tụi mình cưới rồi nè 💍
        </h2>

        <div className="w-20 h-px bg-primary/80 mx-auto my-6" />

        <p className="text-foreground/90 leading-relaxed text-sm md:text-base mb-4">
          {"Sau một hành trình “tình trong như đã”, tụi mình quyết định về chung một nhà 🎉"}
        </p>
        <p className="text-foreground/90 leading-relaxed text-sm md:text-base mb-4">
          {"Và sẽ thật thiếu nếu ngày vui này không có bạn ở đó."}
        </p>
        <p className="text-foreground/90 leading-relaxed text-sm md:text-base mb-4">
          {"Lên đồ xinh xắn, dành chút thời gian đến chung vui, ăn uống, chụp hình và quẩy nhẹ cùng tụi mình nha ✨"}
        </p>
        <p className="text-foreground font-semibold leading-relaxed text-sm md:text-base italic">
          {"Có mặt của bạn là tụi mình vui x10 rồi đó!"}
        </p>

        <div className="w-20 h-px bg-primary/80 mx-auto my-6" />

        <p className="font-script text-xl md:text-2xl lg:text-3xl font-normal text-primary tracking-wide">
          <SparkleText>{COUPLE_NAME}</SparkleText>
        </p>
      </div>

      <a
        href="#events"
        className="hidden lg:block absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground hover:text-primary transition-colors"
        aria-label="Cuộn xuống"
      >
        <ChevronDown className="w-6 h-6 mx-auto" />
      </a>
    </section>
  )
}
