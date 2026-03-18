"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/wedding/hero-section";
import { InvitationSection } from "@/components/wedding/invitation-section";
import { EventInfoSection } from "@/components/wedding/event-info-section";
import { GallerySection } from "@/components/wedding/gallery-section";
import { TimelineSection } from "@/components/wedding/timeline-section";
import { ThankYouSection } from "@/components/wedding/thank-you-section";
import { GuestbookSection } from "@/components/wedding/guestbook-section";

const scrollFade = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const SNAP_SECTION_COUNT = 4; // Hero, Invitation, Event, Timeline

export function WeddingPageContent() {
  const mainRef = useRef<HTMLElement>(null);
  const scrollingRef = useRef(false);
  const wheelLockRef = useRef(false);

  // Mỗi lần scroll chuột → nhảy đúng 1 section (chỉ 4 section đầu: Hero, Invitation, Event, Timeline)
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const getSections = () =>
      Array.from(el.querySelectorAll<HTMLElement>("[data-snap-section]"));

    const getCurrentSectionIndex = () => {
      const sections = getSections();
      const scrollTop = el.scrollTop;
      const vh = el.clientHeight;
      let index = Math.round(scrollTop / vh);
      index = Math.max(0, Math.min(index, sections.length - 1));
      return index;
    };

    const scrollToSection = (index: number) => {
      const sections = getSections();
      const target = sections[index];
      if (!target || scrollingRef.current) return;
      scrollingRef.current = true;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        scrollingRef.current = false;
      }, 800);
    };

    const onWheel = (e: WheelEvent) => {
      if (scrollingRef.current) {
        e.preventDefault();
        return;
      }
      const current = getCurrentSectionIndex();
      const vh = el.clientHeight;
      const snapZoneTop = SNAP_SECTION_COUNT * vh;
      const isInSnapZone = current < SNAP_SECTION_COUNT && el.scrollTop < snapZoneTop - 2;
      if (!isInSnapZone) return; // Gallery + Thank you: scroll bình thường

      // Ở Timeline (section cuối) cuộn xuống → cho qua để scroll sang Gallery
      if (current === SNAP_SECTION_COUNT - 1 && e.deltaY > 0) return;

      e.preventDefault();
      if (wheelLockRef.current) return;
      wheelLockRef.current = true;
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 400);

      if (e.deltaY > 0) {
        if (current < SNAP_SECTION_COUNT - 1) scrollToSection(current + 1);
      } else {
        if (current > 0) scrollToSection(current - 1);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <main
      ref={mainRef}
      className="h-screen overflow-y-auto overflow-x-hidden scroll-smooth snap-y snap-mandatory scrollbar-hide"
    >
      {/* <MusicPlayer /> */}
      {/* 4 section snap: mỗi lần scroll chuột = 1 section full */}
      <motion.div
        data-snap-section
        className="snap-start snap-always min-h-screen h-screen shrink-0"
        {...scrollFade}
      >
        <HeroSection />
      </motion.div>
      <motion.div
        data-snap-section
        className="snap-start snap-always min-h-screen h-screen shrink-0"
        {...scrollFade}
      >
        <InvitationSection />
      </motion.div>
      <motion.div
        data-snap-section
        className="snap-start snap-always min-h-screen h-screen shrink-0"
        {...scrollFade}
      >
        <EventInfoSection />
      </motion.div>
      <motion.div
        data-snap-section
        className="snap-start snap-always min-h-screen h-screen shrink-0"
        {...scrollFade}
      >
        <TimelineSection />
      </motion.div>
      {/* Gallery + Thank you: scroll bình thường */}
      <motion.div data-snap-section
        className="snap-start snap-always shrink-0"
        {...scrollFade}>
        <GallerySection />
      </motion.div>
      <motion.div data-snap-section
        className="snap-start snap-always shrink-0" {...scrollFade}>
        <ThankYouSection />
      </motion.div>
    </main>
  );
}
