"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Check, Send } from "lucide-react"

function ConfettiPiece({ delay, left }: { delay: number; left: number }) {
  const colors = [
    "bg-primary",
    "bg-accent",
    "bg-primary/60",
    "bg-accent/60",
    "bg-secondary",
  ]
  const color = colors[Math.floor(Math.random() * colors.length)]
  const size = Math.random() * 8 + 4
  const rotation = Math.random() * 360

  return (
    <div
      className={`absolute ${color} rounded-sm pointer-events-none`}
      style={{
        width: size,
        height: size * 0.6,
        left: `${left}%`,
        top: "-10px",
        transform: `rotate(${rotation}deg)`,
        animation: `confettiFall 2s ease-out ${delay}ms forwards`,
        opacity: 0,
      }}
    />
  )
}

export function RSVPSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [attendance, setAttendance] = useState<"yes" | "no" | null>(null)
  const [guests, setGuests] = useState("1")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!attendance) return
      setSubmitted(true)
      if (attendance === "yes") {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    },
    [attendance]
  )

  const confettiPieces = Array.from({ length: 40 }, (_, i) => ({
    delay: Math.random() * 500,
    left: Math.random() * 100,
    id: i,
  }))

  return (
    <section ref={ref} className="py-20 md:py-28 px-4 relative overflow-hidden">
      {/* Confetti animation styles */}
      <style jsx>{`
        @keyframes confettiFall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(400px) rotate(720deg);
          }
        }
      `}</style>

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {confettiPieces.map((piece) => (
            <ConfettiPiece key={piece.id} delay={piece.delay} left={piece.left} />
          ))}
        </div>
      )}

      <div className="max-w-lg mx-auto">
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">
            RSVP
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground italic">
            {"Xác Nhận Tham Dự"}
          </h2>
        </div>

        <div
          className={`bg-card rounded-3xl p-8 md:p-10 border border-border shadow-sm transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-center text-foreground font-medium mb-2">
                {"Bạn có tham dự cùng chúng mình không?"}
              </p>

              {/* Attendance choice */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance("yes")}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all text-left ${
                    attendance === "yes"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      attendance === "yes"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {attendance === "yes" && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                  <span className="text-foreground text-sm">
                    {"Chắc chắn có mặt"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendance("no")}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all text-left ${
                    attendance === "no"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      attendance === "no"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {attendance === "no" && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                  <span className="text-foreground text-sm">
                    {"Rất tiếc không thể tham dự"}
                  </span>
                </button>
              </div>

              {/* Guest count */}
              {attendance === "yes" && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground block">
                    {"Số người đi cùng"}
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={String(num)}>
                        {num} {num === 1 ? "người" : "người"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground block">
                  {"Lời nhắn cho chúng mình"}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Viết lời chúc hoặc lời nhắn..."
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!attendance}
                className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:hover:scale-100"
              >
                <Send className="w-4 h-4" />
                Xác Nhận Tham Dự
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-serif text-2xl text-foreground italic">
                {attendance === "yes"
                  ? "Cảm ơn bạn!"
                  : "Cảm ơn bạn đã phản hồi!"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {attendance === "yes"
                  ? "Chúng mình rất mong được gặp bạn!"
                  : "Chúng mình hiểu và rất tiếc khi bạn không thể đến. Hy vọng sẽ gặp bạn sớm nhé!"}
              </p>
              <div className="pt-2">
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {attendance === "yes" ? "Đã xác nhận" : "Đã phản hồi"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
