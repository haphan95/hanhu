"use client"

import { useEffect, useRef, useState } from "react"
import { Coffee, Flower2, Diamond, Heart } from "lucide-react"

const milestones = [
  {
    year: "2020",
    title: "Lần đầu gặp nhau",
    description: "Hai đứa gặp nhau ở công ty, bắt đầu chỉ là đồng nghiệp bình thường.",
    icon: Coffee,
  },
  {
    year: "2025",
    title: "Bắt đầu hẹn hò",
    description: "Những buổi ăn trưa và đi chơi chung dần trở thành những cuộc hẹn.",
    icon: Flower2,
  },
  {
    year: "2025",
    title: "Lời cầu hôn",
    description: "Một câu hỏi đơn giản: 'Hay là mình về chung một nhà nhé?'",
    icon: Diamond,
  },
  {
    year: "2026",
    title: "Ngày cưới",
    description: "Chúng mình chính thức trở thành gia đình của nhau.",
    icon: Heart,
  },
]

export function TimelineSection() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="timeline"
      ref={ref}
      className="relative min-h-screen h-screen py-20 md:py-28 px-4 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: "url(/images/bg-section.png)" }}
        aria-hidden
      />
      <div className="max-w-2xl mx-auto relative z-10">
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">
            Love Story
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground italic">
            {"Câu Chuyện Của Chúng Mình"}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          {milestones.map((milestone, index) => {
            const Icon = milestone.icon
            const isEven = index % 2 === 0

            return (
              <div
                key={milestone.year}
                className={`relative flex items-start mb-12 last:mb-0 transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 200 + 200}ms` }}
              >
                {/* Mobile layout (always left aligned) */}
                <div className="md:hidden flex items-start gap-4 w-full">
                  {/* Icon dot */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <span className="text-xs font-medium text-primary tracking-wider">
                      {milestone.year}
                    </span>
                    <h3 className="font-serif text-lg text-foreground mt-1 italic">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Desktop layout (alternating) */}
                <div className="hidden md:flex items-start w-full">
                  {/* Left content */}
                  <div className={`w-[calc(50%-24px)] ${isEven ? "text-right pr-8" : ""}`}>
                    {isEven && (
                      <div>
                        <span className="text-xs font-medium text-primary tracking-wider">
                          {milestone.year}
                        </span>
                        <h3 className="font-serif text-xl text-foreground mt-1 italic">
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  {/* Right content */}
                  <div className={`w-[calc(50%-24px)] ${!isEven ? "pl-8" : ""}`}>
                    {!isEven && (
                      <div>
                        <span className="text-xs font-medium text-primary tracking-wider">
                          {milestone.year}
                        </span>
                        <h3 className="font-serif text-xl text-foreground mt-1 italic">
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
