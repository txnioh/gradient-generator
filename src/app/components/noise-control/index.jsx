import React from 'react';
import styles from '../../styles/glass.module.css';

export default function NoiseControl({
  noiseAmount,
  setNoiseAmount,
  t
}) {
  const handleNoiseChange = (e) => {
    setNoiseAmount(parseInt(e.target.value));
  };

  const noiseSteps = [0, 1, 2, 3, 4];
  const noisePercentages = [0, 12.5, 25, 37.5, 50];

  return (
    <div className={`${styles.glassEffect} space-y-4 p-6`}>
      <h2 className="text-xl font-bold mb-4 text-orange-300">{t.noiseControl}</h2>
      <div className="space-y-2">
        <label className="block text-sm font-bold text-orange-200">
          {t.noiseAmount}: {noisePercentages[noiseAmount]}%
        </label>
        <div className="relative pt-1">
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={noiseAmount}
            onChange={handleNoiseChange}
            className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #fdba74 0%, #fdba74 ${noiseAmount * 25}%, #000000 ${noiseAmount * 25}%, #000000 100%)`
            }}
          />
          <div className="flex justify-between w-full px-2 mt-2">
            {noiseSteps.map((value) => (
              <span key={value} className="text-xs text-orange-200">
                {value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
