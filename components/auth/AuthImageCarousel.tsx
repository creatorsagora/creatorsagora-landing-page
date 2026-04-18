"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type AuthImageCarouselProps = {
  images: string[];
  interval?: number;
  className?: string;
};

export function AuthImageCarousel({ images, interval = 5200, className }: AuthImageCarouselProps) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (safeImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % safeImages.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [interval, safeImages.length]);

  if (safeImages.length === 0) return null;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {safeImages.map((image, index) => {
        const active = index === currentIndex;
        return (
          <div
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-out",
              active ? "scale-100 opacity-100" : "scale-[1.035] opacity-0"
            )}
            key={image}
          >
            <Image
              alt={`Auth slide ${index + 1}`}
              className="object-cover"
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={image}
            />
          </div>
        );
      })}

      {safeImages.length > 1 ? (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 lg:left-5 lg:translate-x-0">
          {safeImages.map((_, index) => {
            const active = index === currentIndex;
            return (
              <button
                aria-label={`Go to slide ${index + 1}`}
                className={cn(
                  "h-2 rounded-full border border-white/65 transition-all duration-300",
                  active ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/65"
                )}
                key={`auth-slide-dot-${index}`}
                onClick={() => setCurrentIndex(index)}
                type="button"
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

