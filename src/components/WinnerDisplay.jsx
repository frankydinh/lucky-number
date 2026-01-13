import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import './WinnerDisplay.css';

function WinnerDisplay({ winner, mode, onReset }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (showConfetti) {
      triggerConfetti();
    }
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const renderWinnerContent = () => {
    if (mode === 'racing' && Array.isArray(winner)) {
      // Show Top 3 for racing mode
      return (
        <div className="top-three-container">
          <h1 className="winner-title">🏁 Race Results</h1>
          <div className="podium">
            {winner.map((racer, index) => (
              <motion.div
                key={racer.name}
                className={`podium-place place-${racer.position}`}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.3, duration: 0.5 }}
              >
                <div className="place-medal">
                  {racer.position === 1 && '🥇'}
                  {racer.position === 2 && '🥈'}
                  {racer.position === 3 && '🥉'}
                </div>
                <div className="place-position">{racer.position}</div>
                <div className="place-name">{racer.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    } else {
      // Show single winner for wheel mode
      const winnerName = typeof winner === 'string' ? winner : winner?.name || 'Unknown';
      return (
        <div className="single-winner-container">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
            className="winner-card"
          >
            <div className="winner-icon">🎉</div>
            <h1 className="winner-title">Winner!</h1>
            <div className="winner-name">{winnerName}</div>
          </motion.div>
        </div>
      );
    }
  };

  return (
    <div className="winner-display-container">
      {renderWinnerContent()}
      
      <motion.button
        className="btn-reset"
        onClick={onReset}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Draw Again
      </motion.button>
    </div>
  );
}

export default WinnerDisplay;
