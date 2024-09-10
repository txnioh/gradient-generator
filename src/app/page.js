'use client'

import { useState, useRef, useEffect } from 'react';
import NoiseControl from './components/noise-control';

const generatePastelColor = () => {
  const r = Math.floor((Math.random() * 55) + 200).toString(16);
  const g = Math.floor((Math.random() * 55) + 200).toString(16);
  const b = Math.floor((Math.random() * 55) + 200).toString(16);
  return `#${r}${g}${b}`;
};

export default function Home() {
  const [colors, setColors] = useState([
    { color: '#FFB3BA', position: { x: 0.2, y: 0.2 } },
    { color: '#BAFFC9', position: { x: 0.8, y: 0.5 } },
    { color: '#BAE1FF', position: { x: 0.5, y: 0.8 } }
  ]);
  const [activeColorIndex, setActiveColorIndex] = useState(null);
  const [noiseAmount, setNoiseAmount] = useState(0);
  const [isDraggingNoise, setIsDraggingNoise] = useState(false);
  const canvasRef = useRef(null);
  const noiseCanvasRef = useRef(null);
  const noiseSliderRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [showColorPoints, setShowColorPoints] = useState(true);

  useEffect(() => {
    drawGradient();
    drawNoise();
  }, [colors, noiseAmount, canvasSize, showColorPoints]);

  const drawGradient = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    colors.forEach((color) => {
      const gradient = ctx.createRadialGradient(
        color.position.x * canvasSize.width, color.position.y * canvasSize.height, 0,
        color.position.x * canvasSize.width, color.position.y * canvasSize.height, canvasSize.width
      );
      gradient.addColorStop(0, color.color);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    });

    // Draw color handles only if showColorPoints is true
    if (showColorPoints) {
      colors.forEach((color) => {
        const handleX = color.position.x * canvasSize.width;
        const handleY = color.position.y * canvasSize.height;
        
        ctx.beginPath();
        ctx.arc(handleX, handleY, 10, 0, 2 * Math.PI);
        ctx.fillStyle = color.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
      });
    }
  };

  const drawNoise = () => {
    const canvas = noiseCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    const imageData = ctx.createImageData(canvasSize.width, canvasSize.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = data[i + 1] = data[i + 2] = noise;
      data[i + 3] = Math.random() * (noiseAmount / 100) * 255;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasSize.width / rect.width;
    const scaleY = canvasSize.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX / canvasSize.width;
    const y = (e.clientY - rect.top) * scaleY / canvasSize.height;

    const clickedColorIndex = colors.findIndex(color => 
      Math.sqrt(Math.pow(color.position.x - x, 2) + Math.pow(color.position.y - y, 2)) < 0.05
    );

    if (clickedColorIndex !== -1) {
      setActiveColorIndex(clickedColorIndex);
      canvas.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e) => {
    if (activeColorIndex !== null) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasSize.width / rect.width;
      const scaleY = canvasSize.height / rect.height;
      
      const x = (e.clientX - rect.left) * scaleX / canvasSize.width;
      const y = (e.clientY - rect.top) * scaleY / canvasSize.height;

      setColors(colors.map((color, index) => 
        index === activeColorIndex ? { ...color, position: { x, y } } : color
      ));
    }
  };

  const handleMouseUp = () => {
    setActiveColorIndex(null);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'default';
    }
  };

  const handleMouseLeave = () => {
    setActiveColorIndex(null);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'default';
    }
  };

  const randomizeColors = () => {
    setColors(colors.map(c => ({
      color: generatePastelColor(),
      position: { 
        x: Math.random(), 
        y: Math.random() 
      },
    })));
  };

  const addColor = () => {
    setColors([...colors, {
      color: generatePastelColor(),
      position: { x: 0.5, y: 0.5 },
    }]);
  };

  const removeColor = (index) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

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

  useEffect(() => {
    const canvas = canvasRef.current;
    
    const handleMouseMove = (e) => {
      if (isOverColorHandle(e.clientX, e.clientY)) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = 'default';
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [colors]);

  const isOverColorHandle = (x, y) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasSize.width / rect.width;
    const scaleY = canvasSize.height / rect.height;
    const canvasX = (x - rect.left) * scaleX;
    const canvasY = (y - rect.top) * scaleY;

    return colors.some(color => {
      const handleX = color.position.x * canvasSize.width;
      const handleY = color.position.y * canvasSize.height;
      const distance = Math.sqrt(Math.pow(handleX - canvasX, 2) + Math.pow(handleY - canvasY, 2));
      return distance <= 10; // 10 is the radius of our color handles
    });
  };

  const handleAspectRatioChange = (newRatio) => {
    setAspectRatio(newRatio);
    const [width, height] = newRatio.split(':').map(Number);
    const newWidth = 300; // Base width
    const newHeight = (newWidth / width) * height;
    setCanvasSize({ width: newWidth, height: newHeight });
  };

  const handleDownload = (format) => {
    const canvas = canvasRef.current;
    const noiseCanvas = noiseCanvasRef.current;
    
    // Create a temporary canvas to combine gradient and noise
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasSize.width;
    tempCanvas.height = canvasSize.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw gradient without color points
    const currentShowColorPoints = showColorPoints;
    setShowColorPoints(false);
    drawGradient();
    tempCtx.drawImage(canvas, 0, 0);
    setShowColorPoints(currentShowColorPoints);
    
    // Draw noise with overlay blend mode
    tempCtx.globalCompositeOperation = 'overlay';
    tempCtx.drawImage(noiseCanvas, 0, 0);
    
    // Reset composite operation
    tempCtx.globalCompositeOperation = 'source-over';

    // Create download link
    const link = document.createElement('a');
    link.download = `gradient.${format}`;
    link.href = tempCanvas.toDataURL(`image/${format}`);
    link.click();

    // Redraw the canvas with color points if they were enabled
    if (currentShowColorPoints) {
      drawGradient();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="w-full bg-gray-800 p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-center items-center">
          <h1 className="text-2xl font-bold text-orange-50">Smooth Gradient Generator</h1>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-100"></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col items-center">
            <div className="relative" style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}>
              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                className="rounded-lg shadow-lg"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              ></canvas>
              <canvas
                ref={noiseCanvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                className="absolute top-0 left-0 rounded-lg pointer-events-none"
                style={{ mixBlendMode: 'overlay' }}
              ></canvas>
            </div>
          </div>

          <div className="col-span-1 space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Color Controls</h2>
              <ul className="space-y-3">
                {colors.map((color, index) => (
                  <li key={index} className="flex items-center bg-gray-700 p-2 rounded-lg shadow transition-all hover:bg-gray-600">
                    <div className="relative w-8 h-8">
                      <input 
                        type="color" 
                        value={color.color} 
                        onChange={(e) => {
                          const newColors = [...colors];
                          newColors[index].color = e.target.value;
                          setColors(newColors);
                        }}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-500 overflow-hidden"
                        style={{ backgroundColor: color.color }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-300">{color.color}</span>
                    <button 
                      className="ml-auto p-1 text-gray-400 hover:text-gray-200 transition-colors"
                      onClick={() => removeColor(index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2">
                <button 
                  className="w-full px-3 py-2 bg-gray-700 text-gray-100 text-sm rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center"
                  onClick={addColor}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Color
                </button>
                <button 
                  className="w-full px-3 py-2 bg-orange-50 text-gray-900 text-sm rounded-md hover:bg-orange-100 transition-colors flex items-center justify-center"
                  onClick={randomizeColors}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Randomize
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 space-y-6">
            <NoiseControl
              noiseAmount={noiseAmount}
              setNoiseAmount={setNoiseAmount}
              isDraggingNoise={isDraggingNoise}
              setIsDraggingNoise={setIsDraggingNoise}
            />

            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Canvas Settings</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-300 mb-2">
                    Aspect Ratio:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1:1', '4:3', '16:9', '2:3', '3:2'].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => handleAspectRatioChange(ratio)}
                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                          aspectRatio === ratio
                            ? 'bg-orange-50 text-gray-900'
                            : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Download:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownload('png')}
                      className="px-3 py-2 bg-gray-700 text-gray-100 text-sm rounded-md hover:bg-gray-600 transition-colors"
                    >
                      PNG
                    </button>
                    <button
                      onClick={() => handleDownload('jpeg')}
                      className="px-3 py-2 bg-gray-700 text-gray-100 text-sm rounded-md hover:bg-gray-600 transition-colors"
                    >
                      JPEG
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <label htmlFor="showColorPoints" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="showColorPoints"
                        className="sr-only"
                        checked={showColorPoints}
                        onChange={(e) => setShowColorPoints(e.target.checked)}
                      />
                      <div className={`block w-14 h-8 rounded-full ${showColorPoints ? 'bg-orange-50' : 'bg-gray-600'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${showColorPoints ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm font-medium text-gray-300">
                      Show Color Points
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
