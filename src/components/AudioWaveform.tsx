import { useEffect, useRef, useState } from "react";

interface AudioWaveformProps {
  isActive: boolean;
  getVolume?: () => number;
}

const BAR_COUNT = 24;

export function AudioWaveform({ isActive, getVolume }: AudioWaveformProps) {
  const [levels, setLevels] = useState<number[]>(new Array(BAR_COUNT).fill(0));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      setLevels(new Array(BAR_COUNT).fill(0));
      return;
    }

    const update = () => {
      const vol = getVolume ? getVolume() : 0;
      setLevels((prev) =>
        prev.map((_, i) => {
          // Create organic variation per bar using sin offset + randomness
          const phase = (Date.now() / 200 + i * 0.7) % (Math.PI * 2);
          const wave = (Math.sin(phase) + 1) / 2;
          const noise = 0.3 + Math.random() * 0.7;
          const base = Math.max(0.08, vol * wave * noise);
          return base;
        })
      );
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, getVolume]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg
        viewBox="0 0 120 120"
        className="h-36 w-36"
        style={{ transform: "rotate(-90deg)" }}
      >
        {levels.map((level, i) => {
          const angle = (i / BAR_COUNT) * 360;
          const radians = (angle * Math.PI) / 180;
          const innerR = 30;
          const maxBarLen = 22;
          const barLen = 4 + level * maxBarLen;
          const cx = 60 + Math.cos(radians) * innerR;
          const cy = 60 + Math.sin(radians) * innerR;
          const ex = 60 + Math.cos(radians) * (innerR + barLen);
          const ey = 60 + Math.sin(radians) * (innerR + barLen);

          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={ex}
              y2={ey}
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity={0.5 + level * 0.5}
              style={{ transition: "all 0.08s ease-out" }}
            />
          );
        })}
      </svg>
    </div>
  );
}
