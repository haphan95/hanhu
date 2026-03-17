"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { COUPLE_NAME } from "@/lib/wedding-config";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

const DEFAULT_IMAGES = ["/images/hero-wedding.jpg"];

/** Nhiều tỉ lệ khung hình (width/height) để gallery trông random, không lặp 3–4 kiểu */
const ASPECT_RATIOS = [
  3 / 4,
  4 / 3,
  1,
  5 / 4,
  4 / 5,
  3 / 5,
  5 / 3,
  2 / 3,
  3 / 2,
  6 / 5,
  5 / 6,
  7 / 5,
  5 / 7,
  4 / 7,
  7 / 4,
  1.15,
  0.85,
  1.35,
  0.72,
];

export function GallerySection() {
  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const sectionRef = useRef<HTMLElement>(null);
  const lightGalleryRef = useRef<{ instance: { refresh?: () => void } } | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.08 });

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data: { images: string[] }) => {
        if (data.images?.length) setImages(data.images);
      })
      .catch(() => {});
  }, []);

  const onInit = useCallback((detail: { instance: { refresh?: () => void } } | null) => {
    lightGalleryRef.current = detail;
  }, []);

  useEffect(() => {
    lightGalleryRef.current?.instance?.refresh?.();
  }, [images]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative py-10 md:py-14 px-4 overflow-x-hidden flex flex-col"
    >
      <div className="relative z-10 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 md:mb-8"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">
            Gallery
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground italic">
            Khoảnh Khắc
          </h2>
        </motion.div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-6xl">
            <LightGallery
              elementClassNames="gallery-masonry w-full"
              plugins={[lgThumbnail, lgZoom]}
              onInit={onInit}
              speed={400}
              thumbnail={true}
              zoom={true}
            >
              {images.map((src, index) => {
                const ratio = ASPECT_RATIOS[index % ASPECT_RATIOS.length];
                return (
                  <a
                    key={`${src}-${index}`}
                    href={src}
                    data-lg-size="1400-900"
                    data-sub-html={`${COUPLE_NAME} - Ảnh ${index + 1}`}
                    className="block relative w-full rounded-2xl overflow-hidden shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background"
                    style={{ aspectRatio: ratio }}
                  >
                    <Image
                      src={src}
                      alt={`${COUPLE_NAME} - Ảnh ${index + 1}`}
                      width={400}
                      height={Math.round(400 / ratio)}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </a>
                );
              })}
            </LightGallery>
          </div>
        </div>
      </div>

      <a
        href="#guestbook"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce text-muted-foreground hover:text-primary transition-colors"
        aria-label="Cuộn xuống"
      >
        <ChevronDown className="w-6 h-6 mx-auto" />
      </a>
    </section>
  );
}
