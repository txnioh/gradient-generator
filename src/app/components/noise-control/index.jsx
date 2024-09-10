import React, { useRef, useEffect } from 'react';

const NoiseControl = ({ noiseAmount, setNoiseAmount, isDraggingNoise, setIsDraggingNoise }) => {
  const noiseSliderRef = useRef(null);

  const updateNoiseAmount = (clientX) => {
    const slider = noiseSliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setNoiseAmount((x / rect.width) * 100);
  };

  const handleNoiseStart = (clientX) => {
    setIsDraggingNoise(true);
    updateNoiseAmount(clientX);
  };

  const handleNoiseMove = (clientX) => {
    if (isDraggingNoise) {
      updateNoiseAmount(clientX);
    }
  };

  const handleNoiseEnd = () => {
    setIsDraggingNoise(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => handleNoiseMove(e.clientX);
    const handleTouchMove = (e) => handleNoiseMove(e.touches[0].clientX);

    if (isDraggingNoise) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleNoiseEnd);
      window.addEventListener('touchend', handleNoiseEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleNoiseEnd);
      window.removeEventListener('touchend', handleNoiseEnd);
    };
  }, [isDraggingNoise]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">Noise Control</h3>
      <div 
        ref={noiseSliderRef}
        className="w-full h-6 bg-gray-700 rounded-full cursor-pointer relative"
        onMouseDown={(e) => handleNoiseStart(e.clientX)}
        onTouchStart={(e) => handleNoiseStart(e.touches[0].clientX)}
      >
        <div 
          className="h-full bg-orange-50 rounded-full absolute left-0 top-0 transition-all duration-150 ease-out"
          style={{ width: `${noiseAmount}%` }}
        ></div>
        <div 
          className="w-6 h-6 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 shadow-md transition-all duration-150 ease-out"
          style={{ left: `calc(${noiseAmount}% - 12px)` }}
        ></div>
      </div>
      <span className="text-sm text-gray-300 mt-2 block">{noiseAmount.toFixed(0)}% Noise</span>
    </div>
  );
};

export default NoiseControl;
