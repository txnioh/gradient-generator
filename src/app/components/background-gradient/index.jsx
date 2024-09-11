import React from 'react';
import styles from './styles.module.css';

const BackgroundGradient = () => {
  return (
    <div className={styles.backgroundGradient}>
      <div className={styles.topCircle}></div>
      <div className={styles.noise}></div>
    </div>
  );
};

export default BackgroundGradient;