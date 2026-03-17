"use client";

import { Sparkles } from "lucide-react";

interface SparkleTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Bọc tên cô dâu/chú rể (hoặc COUPLE_NAME) với hiệu ứng sparkle lấp lánh.
 */
export function SparkleText({ children, className = "" }: SparkleTextProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      {/* Sparkle icons xung quanh chữ */}
      <Sparkles
        className="absolute -top-1 -right-2 w-3 h-3 text-primary animate-sparkle opacity-90"
        style={{ animationDelay: "0ms" }}
        aria-hidden
      />
      <Sparkles
        className="absolute -bottom-0.5 -left-2 w-2.5 h-2.5 text-primary animate-sparkle opacity-80"
        style={{ animationDelay: "400ms" }}
        aria-hidden
      />
      <Sparkles
        className="absolute top-1/2 -right-3 w-2 h-2 text-primary/90 animate-sparkle -translate-y-1/2"
        style={{ animationDelay: "800ms" }}
        aria-hidden
      />
      <Sparkles
        className="absolute top-1/2 -left-3 w-2 h-2 text-primary/90 animate-sparkle -translate-y-1/2"
        style={{ animationDelay: "200ms" }}
        aria-hidden
      />
    </span>
  );
}
