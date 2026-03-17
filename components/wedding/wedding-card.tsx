"use client"

import Image from "next/image"
import { COUPLE_NAME, WEDDING_DATE_DISPLAY, GROOM_NAME, BRIDE_NAME } from "@/lib/wedding-config"
import { CarnationFlower } from "@/components/decorations/carnation-flower"
import { BouquetFlower } from "@/components/decorations/bouquet-flower"
import { CherryBlossomPetals } from "@/components/decorations/cherry-petals"
import { WaxSeal } from "@/components/decorations/wax-seal"

export default function WeddingCard() {
  const sealInitials = `${GROOM_NAME.charAt(0)}&${BRIDE_NAME.charAt(0)}`

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden bg-[#FFF8F3] py-8 px-4">
      <CherryBlossomPetals />

      {/* Header - đồng bộ với hero */}
      <div className="text-center">
        <h1
          className="font-script text-2xl md:text-4xl text-[#8B3A3A]"
          style={{ fontFamily: "var(--font-pinyon-script), cursive" }}
        >
          Chúng mình đã cưới
        </h1>
      </div>

      {/* Photos + Envelope - khối giữa */}
      <div className="relative w-full max-w-[360px] flex-1 flex items-center justify-center min-h-[360px]">
        <div className="relative w-full max-w-[360px] h-[360px]">
          <div className="absolute -left-4 top-8 z-10">
            <CarnationFlower />
          </div>

          {/* Left Photo - Polaroid */}
          <div className="absolute left-0 top-0 w-[140px] h-[180px] -rotate-6 z-20 shadow-lg">
            <div className="relative w-full h-full bg-white p-1.5 rounded-sm">
              <div className="relative w-full h-full overflow-hidden rounded-sm">
                <Image
                  src="/images/hero-wedding.jpg"
                  alt="Ảnh cưới"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Photo - Polaroid */}
          <div className="absolute right-0 top-0 w-[140px] h-[180px] rotate-6 z-20 shadow-lg">
            <div className="relative w-full h-full bg-white p-1.5 rounded-sm">
              <div className="relative w-full h-full overflow-hidden rounded-sm">
                <Image
                  src="/images/hero-wedding.jpg"
                  alt="Ảnh cưới"
                  fill
                  className="object-cover object-[center_30%]"
                />
              </div>
            </div>
          </div>

          {/* Pink Envelope */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[280px] z-30">
            <div className="relative h-[180px]">
              {/* Vé cưới - Ngày Chung Đôi */}
              <div
                className="absolute -top-8 left-1/2 -translate-x-1/2 w-[170px] rounded-md shadow-md z-10 py-3 px-4 rotate-[-8deg] border-l-4 border-dashed border-[#C97B85]"
                style={{
                  background: "linear-gradient(to right, #FDF6F0 0%, #FFF8F3 100%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-[#FFF8F3] rounded-full border border-[#E8DED5]" />
                <div className="text-center">
                  <p
                    className="font-script text-[#8B3A3A] text-base mb-0.5"
                    style={{ fontFamily: "var(--font-pinyon-script), cursive" }}
                  >
                    Ngày Chung Đôi
                  </p>
                  <p
                    className="text-[#5C3A3A] text-lg font-semibold tracking-wider"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {WEDDING_DATE_DISPLAY}
                  </p>
                  <p
                    className="font-script text-[#8B3A3A] text-[10px] mt-0.5"
                    style={{ fontFamily: "var(--font-pinyon-script), cursive" }}
                  >
                    We&apos;re getting married
                  </p>
                </div>
              </div>

              {/* Thân phong bì */}
              <div
                className="absolute bottom-0 w-full h-[130px] rounded-b-md overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, #E8B4B8 0%, #D4919A 50%, #C97B85 100%)",
                  boxShadow: "0 4px 15px rgba(139, 58, 58, 0.2)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='0.3' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
                  }}
                />
              </div>

              {/* Nắp phong bì */}
              <svg
                className="absolute top-0 left-0 w-full"
                height="80"
                viewBox="0 0 280 80"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 0 L140 70 L280 0 L280 0 L0 0 Z"
                  fill="url(#weddingCardFlapGradient)"
                />
                <defs>
                  <linearGradient id="weddingCardFlapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E8B4B8" />
                    <stop offset="100%" stopColor="#D4919A" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40">
                <WaxSeal initials={sealInitials} />
              </div>
            </div>
          </div>

          <div className="absolute -right-2 bottom-4 z-40">
            <BouquetFlower />
          </div>
        </div>
      </div>

      {/* Tên cặp đôi + ngày - từ config */}
      <div className="text-center mt-auto pt-8">
        <h2
          className="font-script text-3xl md:text-4xl text-[#8B3A3A] mb-3"
          style={{ fontFamily: "var(--font-pinyon-script), cursive" }}
        >
          {COUPLE_NAME}
        </h2>
        <p
          className="text-[#5C3A3A] text-lg md:text-xl tracking-widest font-serif"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {WEDDING_DATE_DISPLAY}
        </p>
      </div>
    </div>
  )
}
