import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function ClaritySlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(4, Math.min(96, pct));
    setSliderPos(pct);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    updatePosition(e.clientX || (e.touches && e.touches[0].clientX));
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: true });
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className="clarity"
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      role="slider"
      aria-valuenow={sliderPos}
      aria-label="Before and after pool cleaning comparison slider"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setSliderPos((p) => Math.max(4, p - 5));
        if (e.key === 'ArrowRight') setSliderPos((p) => Math.min(96, p + 5));
      }}
    >
      <div className="clarity-layer clarity-before">
        <img
          src="/images/pool-before.png"
          alt="Cloudy, green pool before service"
          className="clarity-img"
        />
        <span className="clarity-label">Before</span>
      </div>

      <div
        className="clarity-layer clarity-after"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img
          src="/images/pool-after.png"
          alt="Sparkling clean pool after service"
          className="clarity-img"
        />
        <span className="clarity-label">After one visit</span>
      </div>

      <div
        className="clarity-handle"
        style={{ left: `${sliderPos}%` }}
      />
    </div>
  );
}

