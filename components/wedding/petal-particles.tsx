"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { loadImageShape } from "@tsparticles/shape-image";

/**
 * Hiệu ứng cánh hoa hồng rơi từ trên xuống (react-tsparticles).
 * Màu hồng/đỏ; shape circle đảm bảo hiển thị (image shape có thể không load trên một số môi trường).
 * Hiển thị từ InvitationSection đến hết trang.
 */
function getRosePetalOptions(): ISourceOptions {
  return {
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    particles: {
      color: {
        value: ["#E85D75", "#F07A8F", "#FFD6DC", "#e8919d", "#d64d65", "#c94558"],
      },
      move: {
        enable: true,
        direction: "bottom",
        outModes: { default: "out" },
        random: true,
        straight: false,
        speed: { min: 0.8, max: 2.5 },
        gravity: {
          enable: true,
          acceleration: 0.25,
          maxSpeed: 4,
        },
      },
      number: {
        value: 35,
        density: {
          enable: true,
          width: 800,
          height: 600,
        },
      },
      opacity: {
        value: { min: 0.45, max: 0.9 },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 6, max: 16 },
      },
      rotate: {
        value: { min: 0, max: 360 },
        animation: { enable: true, speed: 10, sync: false },
      },
    },
    detectRetina: true,
  };
}

export function PetalParticles() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      await loadImageShape(engine);
    }).then(() => setInit(true));
  }, []);

  const options = useMemo(() => getRosePetalOptions(), []);

  if (!init) return null;

  return (
    <div className="absolute inset-0 w-full h-full min-h-screen pointer-events-none [&_canvas]:!block [&_canvas]:!w-full [&_canvas]:!h-full [&_canvas]:!min-h-screen">
      <Particles
        id="petal-particles"
        options={options}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
