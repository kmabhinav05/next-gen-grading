import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Compute shortest signed circular offset between slide index and active index.
 */
function getCircularOffset(index, active, length) {
  let diff = (index - active) % length;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

/**
 * Interactive GPU-composited 3D coverflow carousel for showcase cards/images.
 */
const Carousel3D = React.memo(function Carousel3D({
  slides = [],
  autoPlayMs = 3400,
  className = "",
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = slides.length;

  const goNext = useCallback(() => {
    if (count <= 1) return;
    setActive((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    if (count <= 1) return;
    setActive((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || paused) return undefined;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const timer = window.setInterval(goNext, autoPlayMs);
    return () => window.clearInterval(timer);
  }, [count, paused, autoPlayMs, goNext]);

  if (count === 0) return null;

  const current = slides[active];

  return (
    <div
      className={`w-full select-none ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* 3D Perspective Stage */}
      <div
        className="relative h-[340px] sm:h-[385px] w-full flex items-center justify-center overflow-visible"
        style={{ perspective: "1150px" }}
      >
        {slides.map((slide, idx) => {
          const offset = getCircularOffset(idx, active, count);
          const isCenter = offset === 0;
          const isLeft = offset === -1;
          const isRight = offset === 1;
          const isVisible = isCenter || isLeft || isRight;

          let transform = "translate3d(0, 0, -220px) scale(0.72)";
          let zIndex = 10;
          let opacity = 0;

          if (isCenter) {
            transform = "translate3d(0%, 0px, 44px) rotateY(0deg) scale(1)";
            zIndex = 30;
            opacity = 1;
          } else if (isLeft) {
            transform =
              "translate3d(-56%, 10px, -110px) rotateY(22deg) scale(0.84)";
            zIndex = 20;
            opacity = 0.82;
          } else if (isRight) {
            transform =
              "translate3d(56%, 10px, -110px) rotateY(-22deg) scale(0.84)";
            zIndex = 20;
            opacity = 0.82;
          }

          return (
            <button
              key={slide.id ?? idx}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`View ${slide.title}`}
              aria-current={isCenter ? "true" : undefined}
              style={{
                transform,
                zIndex,
                opacity: isVisible ? opacity : 0,
                transition:
                  "transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease",
                willChange: "transform, opacity",
              }}
              className={`absolute w-[210px] sm:w-[245px] aspect-[3/4] rounded-3xl overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isCenter
                  ? "ring-1 ring-slate-900/10 dark:ring-white/20 shadow-[0_24px_48px_-14px_rgba(15,23,42,0.38)] cursor-default"
                  : "ring-1 ring-slate-900/10 dark:ring-white/10 shadow-[0_14px_28px_-10px_rgba(15,23,42,0.28)] cursor-pointer hover:brightness-105"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt || slide.title}
                draggable={false}
                className="w-full h-full object-cover block"
              />
              {slide.badge && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-white/95 dark:bg-zinc-900/95 text-slate-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs">
                  {slide.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Caption & Controls Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 shadow-xs max-w-md mx-auto">
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {current?.title}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-zinc-400 truncate">
            {current?.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous preview card"
            className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5 px-1">
            {slides.map((slide, idx) => (
              <button
                key={slide.id ?? idx}
                type="button"
                onClick={() => setActive(idx)}
                aria-label={`Select slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === active
                    ? "w-5 bg-slate-900 dark:bg-white"
                    : "w-1.5 bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next preview card"
            className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default Carousel3D;
