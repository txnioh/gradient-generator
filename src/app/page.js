'use client'

import { useState, useRef, useEffect } from 'react';
import Canvas from './components/canvas';
import ColorControls from './components/color-controls';
import NoiseControl from './components/noise-control';
import CanvasSettings from './components/canvas-settings';
import BackgroundGradient from './components/background-gradient';
import glassStyles from './styles/glass.module.css';

const generatePastelColor = () => {
  const r = Math.floor((Math.random() * 55) + 200).toString(16);
  const g = Math.floor((Math.random() * 55) + 200).toString(16);
  const b = Math.floor((Math.random() * 55) + 200).toString(16);
  return `#${r}${g}${b}`;
};

export default function Home() {
  const [colors, setColors] = useState([
    { color: '#FFB3BA', position: { x: 0.2, y: 0.2 }, size: 0.8 },
    { color: '#BAFFC9', position: { x: 0.8, y: 0.5 }, size: 0.8 },
    { color: '#BAE1FF', position: { x: 0.5, y: 0.8 }, size: 0.8 }
  ]);
  const [activeColorIndex, setActiveColorIndex] = useState(null);
  const [hoveredColorIndex, setHoveredColorIndex] = useState(null);
  const [noiseAmount, setNoiseAmount] = useState(0);
  const canvasRef = useRef(null);
  const noiseCanvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 650 }); // Adjusted for iPhone aspect ratio
  const [aspectRatio, setAspectRatio] = useState('9:19.5'); // Set default to iPhone aspect ratio
  const [showColorPoints, setShowColorPoints] = useState(false); // Set default to false
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionColors, setTransitionColors] = useState(null);
  const [isTransitioningAspectRatio, setIsTransitioningAspectRatio] = useState(false);

  useEffect(() => {
    drawGradient();
    drawNoise();
  }, [colors, noiseAmount, canvasSize, showColorPoints, hoveredColorIndex]);

  const drawGradient = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Fill the entire canvas with the first color
    if (colors.length > 0) {
      ctx.fillStyle = colors[0].color;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    }

    // Draw radial gradients for the rest of the colors
    colors.slice(1).forEach((color) => {
      const gradient = ctx.createRadialGradient(
        color.position.x * canvasSize.width, color.position.y * canvasSize.height, 0,
        color.position.x * canvasSize.width, color.position.y * canvasSize.height, Math.max(canvasSize.width, canvasSize.height) * (color.size || 0.8) // Use the size property
      );
      gradient.addColorStop(0, color.color);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    });

    if (showColorPoints) {
      colors.forEach((color, index) => {
        const handleX = color.position.x * canvasSize.width;
        const handleY = color.position.y * canvasSize.height;
        
        ctx.beginPath();
        ctx.arc(handleX, handleY, 10, 0, 2 * Math.PI);
        ctx.fillStyle = color.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        if (index === hoveredColorIndex) {
          ctx.shadowColor = color.color;
          ctx.shadowBlur = 20;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });
    }
  };

  const drawNoise = () => {
    const canvas = noiseCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    const imageData = ctx.createImageData(canvasSize.width, canvasSize.height);
    const data = imageData.data;

    const noisePercentages = [0, 12.5, 25, 37.5, 50];
    const noisePercentage = noisePercentages[noiseAmount];

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = data[i + 1] = data[i + 2] = noise;
      data[i + 3] = Math.random() * (noisePercentage / 100) * 255;
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
    } else {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasSize.width / rect.width;
      const scaleY = canvasSize.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      const hoveredIndex = colors.findIndex(color => {
        const handleX = color.position.x * canvasSize.width;
        const handleY = color.position.y * canvasSize.height;
        const distance = Math.sqrt(Math.pow(handleX - x, 2) + Math.pow(handleY - y, 2));
        return distance <= 10;
      });

      setHoveredColorIndex(hoveredIndex !== -1 ? hoveredIndex : null);
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
    setHoveredColorIndex(null);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'default';
    }
  };

  const addColor = () => {
    setColors([...colors, {
      color: generatePastelColor(),
      position: { x: 0.5, y: 0.5 },
      size: 0.8
    }]);
  };

  const removeColor = (index) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

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
      return distance <= 10;
    });
  };

  const handleAspectRatioChange = (newRatio) => {
    if (isTransitioningAspectRatio) return;

    setAspectRatio(newRatio);
    const [width, height] = newRatio.split(':').map(Number);
    let newWidth, newHeight;

    if (newRatio === '9:19.5') {
      newWidth = 300;
      newHeight = 650;
    } else {
      newWidth = 300;
      newHeight = (newWidth / width) * height;
    }

    animateAspectRatioTransition(newWidth, newHeight);
  };

  const animateAspectRatioTransition = (newWidth, newHeight) => {
    setIsTransitioningAspectRatio(true);
    
    const startWidth = canvasSize.width;
    const startHeight = canvasSize.height;
    const duration = 300; // 300ms transition
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        const currentWidth = startWidth + (newWidth - startWidth) * progress;
        const currentHeight = startHeight + (newHeight - startHeight) * progress;

        setCanvasSize({ width: currentWidth, height: currentHeight });
        requestAnimationFrame(animate);
      } else {
        setCanvasSize({ width: newWidth, height: newHeight });
        setIsTransitioningAspectRatio(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleDownload = (format, resolution) => {
    let width, height;
    if (resolution === '4k') {
      width = 3840;
      height = 2160;
    } else if (resolution === 'fullhd') {
      width = 1920;
      height = 1080;
    } else {
      width = 1280;
      height = 720;
    }

    // Adjust for iPhone aspect ratio if that's selected
    if (aspectRatio === '9:19.5') {
      const ratio = 19.5 / 9;
      height = Math.round(width * ratio);
    }
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw gradient
    if (colors.length > 0) {
      tempCtx.fillStyle = colors[0].color;
      tempCtx.fillRect(0, 0, width, height);
    }

    colors.slice(1).forEach((color) => {
      const gradient = tempCtx.createRadialGradient(
        color.position.x * width, color.position.y * height, 0,
        color.position.x * width, color.position.y * height, Math.max(width, height) * (color.size || 0.8) // Use the size property
      );
      gradient.addColorStop(0, color.color);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');

      tempCtx.fillStyle = gradient;
      tempCtx.fillRect(0, 0, width, height);
    });
    
    // Draw noise
    const noisePercentages = [0, 12.5, 25, 37.5, 50];
    const noisePercentage = noisePercentages[noiseAmount];

    const imageData = tempCtx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      const alpha = Math.random() * (noisePercentage / 100) * 255;
      data[i] = Math.min(255, data[i] + noise * (alpha / 255));
      data[i + 1] = Math.min(255, data[i + 1] + noise * (alpha / 255));
      data[i + 2] = Math.min(255, data[i + 2] + noise * (alpha / 255));
      data[i + 3] = Math.min(255, data[i + 3] + alpha);
    }

    tempCtx.putImageData(imageData, 0, 0);
    
    // Create download link
    const link = document.createElement('a');
    link.download = `gradient_${resolution}.${format}`;
    link.href = tempCanvas.toDataURL(`image/${format}`);
    link.click();
  };

  const animateTransition = (newColors) => {
    setIsTransitioning(true);
    setTransitionColors(newColors);
    
    let progress = 0;
    const duration = 300; // Reduced from 1000 to 500 milliseconds (0.5 seconds)
    const startTime = performance.now();

    const animate = (currentTime) => {
      progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        const currentColors = colors.map((color, index) => ({
          ...color,
          color: interpolateColor(color.color, newColors[index].color, progress),
          position: {
            x: color.position.x + (newColors[index].position.x - color.position.x) * progress,
            y: color.position.y + (newColors[index].position.y - color.position.y) * progress,
          },
          size: color.size + (newColors[index].size - color.size) * progress,
        }));

        // Update state only every 3 frames
        if (Math.round(progress * 30) % 3 === 0) {
          setColors(currentColors);
        }
        requestAnimationFrame(animate);
      } else {
        setColors(newColors);
        setIsTransitioning(false);
        setTransitionColors(null);
      }
    };

    requestAnimationFrame(animate);
  };

  const interpolateColor = (color1, color2, progress) => {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * progress);
    const g = Math.round(g1 + (g2 - g1) * progress);
    const b = Math.round(b1 + (b2 - b1) * progress);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-100">
      <BackgroundGradient />

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-12 text-center text-orange-300">Gradient Generator</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col items-center">
            <div className={glassStyles.glassEffect}>
              <Canvas
                canvasRef={canvasRef}
                noiseCanvasRef={noiseCanvasRef}
                canvasSize={canvasSize}
                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                handleMouseUp={handleMouseUp}
                handleMouseLeave={handleMouseLeave}
              />
            </div>
          </div>

          <div className="col-span-1 space-y-6">
            <ColorControls
              colors={colors}
              setColors={setColors}
              removeColor={removeColor}
              addColor={addColor}
              hoveredColorIndex={hoveredColorIndex}
              animateTransition={animateTransition}
              isTransitioning={isTransitioning}
            />
          </div>
          
          <div className="col-span-1 lg:col-span-1 space-y-6">
            <NoiseControl
              noiseAmount={noiseAmount}
              setNoiseAmount={setNoiseAmount}
            />

            <CanvasSettings
              aspectRatio={aspectRatio}
              handleAspectRatioChange={handleAspectRatioChange}
              handleDownload={handleDownload}
              showColorPoints={showColorPoints}
              setShowColorPoints={setShowColorPoints}
              isTransitioningAspectRatio={isTransitioningAspectRatio}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
