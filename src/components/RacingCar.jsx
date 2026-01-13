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
    
    // Select a random winner at the start
    const winnerIndex = Math.floor(Math.random() * names.length);
    
    // Generate base speeds for each car with variation
    const baseSpeeds = names.map((_, index) => {
      // Winner gets slightly better base speed
      if (index === winnerIndex) {
        return 0.7 + Math.random() * 0.15; // 0.7-0.85
      }
      return 0.5 + Math.random() * 0.3; // 0.5-0.8 for others
    });
    
    // Generate unique oscillation patterns for each car (for overtaking effect)
    const oscillationFreqs = names.map(() => 0.5 + Math.random() * 1.5);
    const oscillationAmps = names.map(() => 3 + Math.random() * 7);
    const oscillationPhases = names.map(() => Math.random() * Math.PI * 2);

    const raceDuration = duration * 1000; // Convert to milliseconds
    const accelerationPhase = 0.7; // Winner starts accelerating at 70% progress
    
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progressPercent = Math.min(elapsed / raceDuration, 1);

      const newProgress = {};
      const newFinished = [];

      names.forEach((name, index) => {
        let carProgress = 0;
        
        if (index === winnerIndex) {
          // Winner's progression with dramatic acceleration at the end
          if (progressPercent < accelerationPhase) {
            // Normal phase with overtaking
            carProgress = (progressPercent / accelerationPhase) * 75;
          } else {
            // Acceleration phase - dramatic speed boost
            const accelProgress = (progressPercent - accelerationPhase) / (1 - accelerationPhase);
            const accelerationCurve = Math.pow(accelProgress, 0.6); // Ease out for smooth acceleration
            carProgress = 75 + accelerationCurve * 25;
          }
        } else {
          // Other cars' progression with more variance
          carProgress = progressPercent * baseSpeeds[index] * 100;
          
          // Slow down non-winners near the end so winner can overtake
          if (progressPercent > accelerationPhase) {
            const slowdownFactor = 0.85;
            carProgress = carProgress * slowdownFactor;
          }
        }
        
        // Add overtaking effect with oscillating variations for all cars
        const oscillation = Math.sin(
          elapsed * oscillationFreqs[index] / 1000 + oscillationPhases[index]
        ) * oscillationAmps[index] * (1 - progressPercent * 0.5); // Reduce oscillation as race progresses
        
        carProgress += oscillation;
        
        // Clamp progress
        if (index === winnerIndex && progressPercent >= 1) {
          newProgress[name] = 100;
          if (!finished.includes(name)) {
            newFinished.push({ name, position: 1 });
          }
        } else {
          newProgress[name] = Math.max(0, Math.min(carProgress, 98));
        }
      });

      setProgress(newProgress);
      
      if (newFinished.length > 0 && finished.length === 0) {
        setFinished(newFinished);
      }

      if (progressPercent < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsRacing(false);
        
        // Calculate final positions based on final progress
        const finalResults = names.map((name, index) => ({
          name,
          progress: newProgress[name],
          index
        })).sort((a, b) => b.progress - a.progress);
        
        const top3 = finalResults.slice(0, 3).map((result, pos) => ({
          name: result.name,
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
