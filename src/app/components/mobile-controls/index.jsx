import React from 'react';
import ColorControls from '../color-controls';
import NoiseControl from '../noise-control';
import CanvasSettings from '../canvas-settings';
import styles from '../../styles/glass.module.css';

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
            isMobile={true}
          />
        );
      case 'noise':
        return (
          <NoiseControl
            noiseAmount={noiseAmount}
            setNoiseAmount={setNoiseAmount}
            t={t}
            isMobile={true}
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
            isMobile={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${styles.glassEffect} rounded-t-3xl overflow-hidden`}>
      <nav className="flex justify-around py-4 bg-black bg-opacity-50 rounded-t-3xl">
        <button
          className={`p-2 rounded-full ${activeControl === 'colors' ? 'bg-orange-300 text-gray-900' : 'bg-gray-800 bg-opacity-50 text-orange-300'}`}
          onClick={() => setActiveControl(activeControl === 'colors' ? null : 'colors')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </button>
        <button
          className={`p-2 rounded-full ${activeControl === 'noise' ? 'bg-orange-300 text-gray-900' : 'bg-gray-800 bg-opacity-50 text-orange-300'}`}
          onClick={() => setActiveControl(activeControl === 'noise' ? null : 'noise')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
        <button
          className={`p-2 rounded-full ${activeControl === 'settings' ? 'bg-orange-300 text-gray-900' : 'bg-gray-800 bg-opacity-50 text-orange-300'}`}
          onClick={() => setActiveControl(activeControl === 'settings' ? null : 'settings')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </nav>
      <div className="p-4 max-h-[40vh] overflow-y-auto bg-black bg-opacity-50 text-orange-300">
        {renderActiveControl()}
      </div>
    </div>
  );
};

export default MobileControls;