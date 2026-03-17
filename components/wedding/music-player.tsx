"use client";

import { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { WEDDING_AUDIO_FILE, WEDDING_AUDIO_AUTOPLAY } from "@/lib/wedding-config";

const AUDIO_SRC = `/${WEDDING_AUDIO_FILE}`;

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const touchedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !WEDDING_AUDIO_AUTOPLAY) return;
    const el = audioRef.current;
    if (!el) return;
    el.play().catch(() => {});
  }, [mounted]);

  const handleTap = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    const isTouch = "touches" in e;
    if (isTouch) {
      e.preventDefault();
      touchedRef.current = true;
      setTimeout(() => {
        touchedRef.current = false;
      }, 400);
    } else {
      if (touchedRef.current) {
        touchedRef.current = false;
        return;
      }
    }
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        type="button"
        onClick={handleTap}
        onTouchStart={handleTap}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary/90 text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary hover:scale-110 active:scale-95 transition-all select-none"
        aria-label={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>
    </>
  );
}
