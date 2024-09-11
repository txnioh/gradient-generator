import React, { useState } from 'react';
import styles from '../../styles/glass.module.css';
import Color from 'color';

// Define base color palettes
const colorPalettes = {
  pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFDFBA'],
  vibrant: ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93'],
  earthy: [
    '#8D6E63', // Brown
    '#A1887F', // Light Brown
    '#6D4C41', // Dark Brown
    '#795548', // Medium Brown
    '#D7CCC8', // Light Taupe
    '#BCAAA4', // Taupe
    '#9C7C65', // Tan
    '#E6D0B8', // Sand
    '#C8B39E', // Khaki
    '#A87B4F', // Camel
    '#76624C', // Olive
    '#4E342E', // Dark Olive
    '#5D4037', // Sienna
    '#3E2723', // Dark Sienna
    '#8B4513', // Saddle Brown
    '#D2691E', // Chocolate
    '#CD853F', // Peru
    '#DEB887', // Burlywood
    '#F4A460', // Sandy Brown
    '#D2B48C', // Tan
  ],
  neon: ['#FF00FF', '#00FFFF', '#FF00CC', '#00FF00', '#FF3300'],
  monochrome: ['#F2F2F2', '#BFBFBF', '#8C8C8C', '#595959', '#262626'],
};

const generateThemeColor = (baseColor, theme) => {
  const color = Color(baseColor);
  let hue, saturation, lightness;

  switch (theme) {
    case 'pastel':
      hue = color.hue();
      saturation = Math.min(color.saturationl(), 70);
      lightness = Math.max(color.lightness(), 70);
      break;
    case 'vibrant':
      hue = color.hue();
      saturation = Math.max(color.saturationl(), 70);
      lightness = Math.min(Math.max(color.lightness(), 40), 60);
      break;
    case 'earthy':
      // For earthy colors, we'll use the color as is, with slight variations
      hue = (color.hue() + Math.random() * 20 - 10 + 360) % 360;
      saturation = Math.min(Math.max(color.saturationl() + Math.random() * 10 - 5, 20), 60);
      lightness = Math.min(Math.max(color.lightness() + Math.random() * 10 - 5, 20), 70);
      break;
    case 'neon':
      hue = Math.floor(Math.random() * 360);
      saturation = 100;
      lightness = 50;
      break;
    case 'monochrome':
      hue = 0;
      saturation = 0;
      lightness = color.lightness();
      break;
    default:
      return color.hex();
  }

  return Color.hsl(hue, saturation, lightness).hex();
};

export default function ColorControls({
  colors,
  setColors,
  removeColor,
  addColor,
  hoveredColorIndex,
  animateTransition,
  isTransitioning
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [newColor, setNewColor] = useState('#FFFFFF');
  const [selectedPalette, setSelectedPalette] = useState('pastel');
  const [expandedColorIndex, setExpandedColorIndex] = useState(null);

  const handleColorChange = (index, newColor) => {
    const updatedColors = [...colors];
    updatedColors[index].color = newColor;
    setColors(updatedColors);
  };

  const handleSizeChange = (index, newSize) => {
    const updatedColors = [...colors];
    updatedColors[index].size = newSize;
    setColors(updatedColors);
  };

  const handleAddColor = () => {
    setColors([...colors, {
      color: newColor,
      position: { x: 0.5, y: 0.5 },
      size: 0.8,
    }]);
    setIsAddingColor(false);
  };

  const handleRandomize = () => {
    if (isTransitioning) return;

    const palette = colorPalettes[selectedPalette];
    const newColors = colors.map((color, index) => {
      const baseColor = palette[Math.floor(Math.random() * palette.length)];
      return {
        ...color,
        color: generateThemeColor(baseColor, selectedPalette),
        size: index === 0 ? 1 : Math.random() * 1.5 + 0.5,
        position: index === 0 
          ? { x: 0.5, y: 0.5 } // Keep the base color in the center
          : { x: Math.random(), y: Math.random() } // Randomize position for other colors
      };
    });
    
    animateTransition(newColors);
  };

  const toggleColorExpansion = (index) => {
    if (expandedColorIndex === index) {
      setExpandedColorIndex(null);
    } else {
      setExpandedColorIndex(index);
    }
  };

  return (
    <div className={`${styles.glassEffect} space-y-4 p-6`}>
      <h2 className="text-xl font-bold mb-4 text-orange-300">Color Controls</h2>
      <p className="text-sm text-orange-200 mb-2">The first color is the base color that fills the entire canvas.</p>
      <ul className="space-y-3">
        {colors.map((color, index) => (
          <li 
            key={index} 
            className={`bg-black p-2 rounded-lg shadow transition-all hover:bg-gray-900 ${hoveredColorIndex === index ? 'ring-2 ring-orange-400' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center">
              <div className="relative w-8 h-8">
                <input 
                  type="color" 
                  value={color.color} 
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-8 h-8 rounded-full border-2 border-orange-300 overflow-hidden"
                  style={{ backgroundColor: color.color }}
                ></div>
              </div>
              <input
                type="text"
                value={color.color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="ml-2 text-xs font-medium text-orange-300 bg-transparent border-b border-orange-300 focus:outline-none focus:border-orange-400"
              />
              {index !== 0 && (
                <button
                  className="ml-2 text-orange-300 hover:text-orange-400 transition-colors"
                  onClick={() => toggleColorExpansion(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform ${expandedColorIndex === index ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              {hoveredIndex === index && colors.length > 2 && index !== 0 && (
                <button 
                  className="ml-auto p-1 text-orange-300 hover:text-orange-400 transition-colors"
                  onClick={() => removeColor(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            {index !== 0 && expandedColorIndex === index && (
              <div className="mt-2 flex items-center">
                <span className="text-xs text-orange-200 mr-2">Size:</span>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={color.size || 0.8}
                  onChange={(e) => handleSizeChange(index, parseFloat(e.target.value))}
                  className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #fdba74 0%, #fdba74 ${((color.size || 0.8) - 0.1) / 1.9 * 100}%, #000000 ${((color.size || 0.8) - 0.1) / 1.9 * 100}%, #000000 100%)`
                  }}
                />
                <span className="text-xs text-orange-200 ml-2">{(color.size || 0.8).toFixed(1)}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-2">
        {isAddingColor ? (
          <div className="flex items-center space-x-2 bg-black p-2 rounded-lg shadow">
            <div className="relative w-10 h-10">
              <input 
                type="color" 
                value={newColor} 
                onChange={(e) => setNewColor(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div 
                className="w-10 h-10 rounded-full border-2 border-orange-300 overflow-hidden"
                style={{ backgroundColor: newColor }}
              ></div>
            </div>
            <button 
              className="px-3 py-2 bg-orange-300 text-gray-900 text-sm rounded-md hover:bg-orange-200 transition-colors flex items-center justify-center"
              onClick={handleAddColor}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Color
            </button>
          </div>
        ) : (
          <button 
            className="w-full px-3 py-2 bg-orange-300 text-gray-900 text-sm rounded-md hover:bg-orange-200 transition-colors flex items-center justify-center"
            onClick={() => setIsAddingColor(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Color
          </button>
        )}
        <div className="flex items-center space-x-2">
          <select
            value={selectedPalette}
            onChange={(e) => setSelectedPalette(e.target.value)}
            className="flex-grow bg-black text-orange-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400"
          >
            <option value="pastel">Pastel</option>
            <option value="vibrant">Vibrant</option>
            <option value="earthy">Earthy</option>
            <option value="neon">Neon</option>
            <option value="monochrome">Monochrome</option>
          </select>
          <button 
            className={`px-3 py-2 bg-orange-300 text-gray-900 text-sm rounded-md hover:bg-orange-200 transition-colors flex items-center justify-center ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleRandomize}
            disabled={isTransitioning}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Randomize
          </button>
        </div>
      </div>
    </div>
  );
}