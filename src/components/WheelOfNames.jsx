import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './WheelOfNames.css';

function WheelOfNames({ names, duration, onComplete }) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const canvasRef = useRef(null);
  const winnerIndex = useRef(null);

  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#6366F1'
  ];

  useEffect(() => {
    const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const anglePerSlice = (2 * Math.PI) / names.length;

    names.forEach((name, index) => {
      const startAngle = index * anglePerSlice;
      const endAngle = startAngle + anglePerSlice;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerSlice / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 3;
      ctx.fillText(name, radius - 20, 5);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 4;
    ctx.stroke();
  };

    drawWheel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names]);

  useEffect(() => {
    const startSpin = () => {
      setIsSpinning(true);
    
    // Calculate winner first
    winnerIndex.current = Math.floor(Math.random() * names.length);
    
    // Calculate rotation to land on winner
    const anglePerSlice = 360 / names.length;
    const targetAngle = 360 - (winnerIndex.current * anglePerSlice) - (anglePerSlice / 2);
    
    // Dynamic spin count based on number of names for realistic effect
    // More names = more spins to show them all
    const baseSpins = 3;
    const additionalSpins = Math.floor(names.length / 5); // Add 1 spin per 5 names
    const spins = baseSpins + additionalSpins;
    const totalRotation = (spins * 360) + targetAngle;

    setTimeout(() => {
      setRotation(totalRotation);
    }, 100);

    // Calculate actual duration with some variation for realism
    // Duration is flexible to allow for natural deceleration
    const actualDuration = duration * 1000;

    setTimeout(() => {
      setIsSpinning(false);
      onComplete(names[winnerIndex.current]);
    }, actualDuration);
  };

    startSpin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wheel-container">
      <div className="wheel-pointer">▼</div>
      <motion.div
        className="wheel-wrapper"
        animate={{ rotate: rotation }}
        transition={{
          duration: duration,
          ease: [0.17, 0.67, 0.16, 1] // Custom cubic-bezier for dramatic slowdown near end
        }}
      >
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="wheel-canvas"
        />
      </motion.div>
      {isSpinning && (
        <div className="spinning-text">
          <p>🎡 Spinning...</p>
        </div>
      )}
    </div>
  );
}

export default WheelOfNames;
