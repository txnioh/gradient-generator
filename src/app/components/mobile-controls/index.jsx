import React from 'react';
import ColorControls from '../color-controls';
import NoiseControl from '../noise-control';
import CanvasSettings from '../canvas-settings';

const MobileControls = ({
  activeControl,
  setActiveControl,
  colors,
  setColors,
  removeColor,
  addColor,
  hoveredColorIndex,
  animateTransition,
  isTransitioning,
  noiseAmount,
  setNoiseAmount,
  aspectRatio,
  handleAspectRatioChange,
  handleDownload,
  showColorPoints,
  setShowColorPoints,
  isTransitioningAspectRatio,
  t
}) => {
  const renderActiveControl = () => {
    switch (activeControl) {
      case 'colors':
        return (
          <ColorControls
            colors={colors}
            setColors={setColors}
            removeColor={removeColor}
            addColor={addColor}
            hoveredColorIndex={hoveredColorIndex}
            animateTransition={animateTransition}
            isTransitioning={isTransitioning}
            t={t}
          />
        );
      case 'noise':
        return (
          <NoiseControl
            noiseAmount={noiseAmount}
            setNoiseAmount={setNoiseAmount}
            t={t}
          />
        );
      case 'settings':
        return (
          <CanvasSettings
            aspectRatio={aspectRatio}
            handleAspectRatioChange={handleAspectRatioChange}
            handleDownload={handleDownload}
            showColorPoints={showColorPoints}
            setShowColorPoints={setShowColorPoints}
            isTransitioningAspectRatio={isTransitioningAspectRatio}
            t={t}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-md">
      <nav className="flex justify-around py-4">
        <button
          className={`text-orange-300 ${activeControl === 'colors' ? 'font-bold' : ''}`}
          onClick={() => setActiveControl(activeControl === 'colors' ? null : 'colors')}
        >
          {t.colorControls}
        </button>
        <button
          className={`text-orange-300 ${activeControl === 'noise' ? 'font-bold' : ''}`}
          onClick={() => setActiveControl(activeControl === 'noise' ? null : 'noise')}
        >
          {t.noiseControl}
        </button>
        <button
          className={`text-orange-300 ${activeControl === 'settings' ? 'font-bold' : ''}`}
          onClick={() => setActiveControl(activeControl === 'settings' ? null : 'settings')}
        >
          {t.canvasSettings}
        </button>
      </nav>
      <div className="p-4 max-h-[140px] overflow-y-auto">
        {renderActiveControl()}
      </div>
    </div>
  );
};

export default MobileControls;