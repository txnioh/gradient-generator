import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [activeControl]);

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

  const handleControlClick = (control) => {
    if (activeControl === control) {
      setActiveControl(null);
      setIsOpen(false);
    } else {
      setActiveControl(control);
      setIsOpen(true);
    }
  };

  return (
    <motion.div
      className={`fixed bottom-0 left-0 right-0 ${styles.glassEffect} rounded-t-3xl overflow-hidden`}
      initial={{ y: "calc(100% - 100px)" }}
      animate={{ 
        y: isOpen ? 0 : "calc(100% - 100px)",
        height: isOpen ? `calc(100px + ${contentHeight}px)` : "100px"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <nav className="flex justify-around items-center h-[100px] bg-black bg-opacity-50 rounded-t-3xl">
        <NavButton
          active={activeControl === 'colors'}
          onClick={() => handleControlClick('colors')}
          icon={<ColorIcon />}
          label={t.colorControls}
        />
        <NavButton
          active={activeControl === 'noise'}
          onClick={() => handleControlClick('noise')}
          icon={<NoiseIcon />}
          label={t.noiseControl}
        />
        <NavButton
          active={activeControl === 'settings'}
          onClick={() => handleControlClick('settings')}
          icon={<SettingsIcon />}
          label={t.canvasSettings}
        />
      </nav>
      <motion.div
        ref={contentRef}
        className="p-4 overflow-y-auto bg-black bg-opacity-50 text-orange-300"
        style={{ maxHeight: isOpen ? contentHeight : 0 }}
      >
        {renderActiveControl()}
      </motion.div>
    </motion.div>
  );
};

const NavButton = ({ active, onClick, icon, label }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    className={`p-3 rounded-full transition-colors duration-300 ease-in-out ${
      active
        ? 'bg-orange-300 text-gray-900'
        : 'bg-gray-800 bg-opacity-50 text-orange-300'
    }`}
    onClick={onClick}
  >
    <motion.div
      animate={{ scale: active ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {icon}
    </motion.div>
    <span className="sr-only">{label}</span>
  </motion.button>
);

const ColorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const NoiseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default MobileControls;