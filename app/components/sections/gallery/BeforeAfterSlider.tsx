'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface BeforeAfterSliderProps {
  beforeGradient: string;
  afterGradient: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeGradient,
  afterGradient,
  className,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      updatePosition(e.clientX);
      containerRef.current?.setPointerCapture(e.pointerId);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSliderPosition((prev) => Math.max(0, prev - 2));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSliderPosition((prev) => Math.min(100, prev + 2));
      }
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full aspect-[4/3] overflow-hidden rounded-lg select-none cursor-ew-resize',
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="slider"
      aria-label="Before and after comparison slider"
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* After (full background) */}
      <div
        className="absolute inset-0"
        style={{ background: afterGradient }}
      />

      {/* Before (clipped) */}
      <div
        className="absolute inset-0"
        style={{
          background: beforeGradient,
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      />

      {/* Labels */}
      <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded pointer-events-none">
        Before
      </span>
      <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded pointer-events-none">
        After
      </span>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Handle circle */}
        <div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-10 h-10 rounded-full bg-white shadow-md',
            'flex items-center justify-center',
            'border-2 border-[#B8860B]',
            'transition-transform duration-150',
            isDragging && 'scale-110'
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-[#B8860B]"
          >
            <path
              d="M4.5 3L1 8L4.5 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.5 3L15 8L11.5 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
