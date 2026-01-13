import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './RacingCar.css';

function RacingCar({ names, duration, onComplete }) {
  const [progress, setProgress] = useState({});
  const [finished, setFinished] = useState([]);
  const [isRacing, setIsRacing] = useState(false);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#6366F1'
  ];

  const carEmojis = ['🏎️', '🚗', '🚙', '🚕', '🏁'];

  useEffect(() => {
    const startRace = () => {
    setIsRacing(true);
    startTimeRef.current = Date.now();
    
    // Generate random finish times for each racer
    const finishTimes = names.map(() => Math.random());
    const sortedIndices = finishTimes
      .map((time, index) => ({ time, index }))
      .sort((a, b) => a.time - b.time)
      .map(item => item.index);

    const raceDuration = duration * 1000; // Convert to milliseconds
    
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progressPercent = Math.min(elapsed / raceDuration, 1);

      const newProgress = {};
      const newFinished = [];

      names.forEach((name, index) => {
        const finishPosition = sortedIndices.indexOf(index);
        const finishTime = (finishPosition / names.length) * 0.3 + 0.7; // Finish between 70% and 100% of duration
        
        if (progressPercent >= finishTime) {
          newProgress[name] = 100;
          if (!finished.includes(name)) {
            newFinished.push({ name, position: finishPosition + 1 });
          }
        } else {
          const carProgress = (progressPercent / finishTime) * 100;
          // Add some random variation
          const randomVariation = Math.sin(elapsed / 100 + index) * 2;
          newProgress[name] = Math.min(carProgress + randomVariation, 99);
        }
      });

      setProgress(newProgress);
      
      if (newFinished.length > 0 && finished.length === 0) {
        setFinished(newFinished.sort((a, b) => a.position - b.position));
      }

      if (progressPercent < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsRacing(false);
        // Complete with top 3
        const top3 = sortedIndices.slice(0, 3).map((idx, pos) => ({
          name: names[idx],
          position: pos + 1
        }));
        onComplete(top3[0].name, top3);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

    startRace();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="racing-container">
      <div className="race-track">
        <div className="finish-line">
          <div className="finish-flag">🏁</div>
        </div>
        
        {names.map((name, index) => (
          <div key={name} className="race-lane">
            <div className="lane-name">{name}</div>
            <div className="lane-track">
              <motion.div
                className="race-car"
                style={{
                  backgroundColor: colors[index % colors.length],
                  left: `${progress[name] || 0}%`
                }}
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {carEmojis[index % carEmojis.length]}
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {isRacing && (
        <div className="racing-text">
          <p>🏁 Racing to the finish...</p>
        </div>
      )}
    </div>
  );
}

export default RacingCar;
