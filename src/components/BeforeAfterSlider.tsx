import React, { useState } from 'react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Before',
  afterLabel = 'After Impact',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientPositionX: number, containerRect: DOMRect) => {
    const x = clientPositionX - containerRect.left;
    let position = (x / containerRect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const containerRect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, containerRect);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const containerRect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, containerRect);
  };

  return (
    <div
      className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden select-none cursor-ew-resize border border-slate-200 dark:border-slate-800 shadow-md"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After image (Background) */}
      <img
        src={afterUrl}
        alt="After Impact"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute top-3 right-3 bg-emerald-600/90 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md backdrop-blur-sm z-10">
        {afterLabel}
      </div>

      {/* Before image (Clipped foreground) */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeUrl}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="absolute top-3 left-3 bg-slate-900/90 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md backdrop-blur-sm z-10">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Divider bar */}
      <div
        className="absolute inset-y-0 w-1 bg-white shadow-2xl z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-800 font-bold text-xs border-2 border-emerald-500">
          ↔
        </div>
      </div>
    </div>
  );
};
