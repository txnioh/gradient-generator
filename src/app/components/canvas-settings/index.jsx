import React, { useState } from 'react';
import styles from '../../styles/glass.module.css';

export default function CanvasSettings({
  aspectRatio,
  handleAspectRatioChange,
  handleDownload,
  showColorPoints,
  setShowColorPoints,
  isTransitioningAspectRatio
}) {
  const [downloadFormat, setDownloadFormat] = useState('png');
  const [downloadResolution, setDownloadResolution] = useState('hd');

  const resolutions = {
    '4k': '3840x2160',
    'fullhd': '1920x1080',
    'hd': '1280x720'
  };

  return (
    <div className={`${styles.glassEffect} space-y-6 p-6`}>
      <h2 className="text-xl font-bold mb-4 text-orange-300">Canvas Settings</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-bold text-orange-200">
          Aspect Ratio
        </label>
        <select
          value={aspectRatio}
          onChange={(e) => handleAspectRatioChange(e.target.value)}
          className={`w-full bg-black text-orange-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 ${isTransitioningAspectRatio ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isTransitioningAspectRatio}
        >
          <option value="9:19.5">iPhone (9:19.5)</option>
          <option value="1:1">1:1 (Square)</option>
          <option value="16:9">16:9 (Widescreen)</option>
          <option value="4:3">4:3 (Standard)</option>
          <option value="3:2">3:2 (Classic)</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-orange-200">Show Color Points</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={showColorPoints}
            onChange={(e) => setShowColorPoints(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-400"></div>
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-orange-200">
          Download Options
        </label>
        <div className="flex flex-col space-y-2">
          <select
            value={downloadFormat}
            onChange={(e) => setDownloadFormat(e.target.value)}
            className="w-full bg-black text-orange-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
          </select>
          <select
            value={downloadResolution}
            onChange={(e) => setDownloadResolution(e.target.value)}
            className="w-full bg-black text-orange-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400"
          >
            <option value="4k">4K ({resolutions['4k']})</option>
            <option value="fullhd">Full HD ({resolutions['fullhd']})</option>
            <option value="hd">HD ({resolutions['hd']})</option>
          </select>
          <button
            onClick={() => handleDownload(downloadFormat, downloadResolution)}
            className="w-full px-4 py-2 bg-orange-300 text-gray-900 text-sm font-bold rounded-md hover:bg-orange-200 transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}