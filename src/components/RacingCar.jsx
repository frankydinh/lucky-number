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
    
    const raceDuration = duration * 1000; // Convert to milliseconds
    
    // Calculate number of phases based on duration
    // More duration = more phases for smoother transitions
    // Min 3 phases, max 8 phases
    const numPhases = Math.min(Math.max(Math.floor(duration / 5), 3), 8);
    const phaseInterval = raceDuration / numPhases;
    
    // Generate initial positions with small random variance (0-5%)
    const initialPositions = names.map(() => Math.random() * 5);
    
    // Generate velocity profiles for each phase
    // Each car gets different velocities per phase
    const velocityProfiles = names.map((_, index) => {
      const profile = [];
      for (let phase = 0; phase < numPhases; phase++) {
        if (index === winnerIndex) {
          // Winner: moderate speed early, dramatic acceleration in final phases
          if (phase < numPhases - 2) {
            // Early and mid phases: moderate speed with variations
            profile.push(15 + Math.random() * 5); // 15-20% progress per phase
          } else if (phase === numPhases - 2) {
            // Second to last phase: start accelerating
            profile.push(20 + Math.random() * 5); // 20-25% progress
          } else {
            // Final phase: maximum acceleration
            profile.push(30 + Math.random() * 10); // 30-40% progress (dramatic finish)
          }
        } else {
          // Non-winners: varied speeds that slow down near the end
          if (phase < numPhases - 2) {
            // Early and mid phases: random competitive speeds
            profile.push(12 + Math.random() * 8); // 12-20% progress per phase
          } else {
            // Final phases: significant slowdown
            profile.push(5 + Math.random() * 5); // 5-10% progress (letting winner pass)
          }
        }
      }
      return profile;
    });
    
    // Calculate target positions for each phase
    const phaseTargets = names.map((_, carIndex) => {
      const targets = [initialPositions[carIndex]];
      let cumulativeProgress = initialPositions[carIndex];
      
      for (let phase = 0; phase < numPhases; phase++) {
        cumulativeProgress += velocityProfiles[carIndex][phase];
        // Cap non-winners at 97% until final calculation
        if (carIndex !== winnerIndex) {
          targets.push(Math.min(cumulativeProgress, 97));
        } else {
          targets.push(Math.min(cumulativeProgress, 100));
        }
      }
      
      return targets;
    });
    
    // Smooth oscillation for overtaking effect
    const oscillationFreqs = names.map(() => 0.5 + Math.random() * 1.5);
    const oscillationAmps = names.map(() => 1 + Math.random() * 2);
    const oscillationPhases = names.map(() => Math.random() * Math.PI * 2);
    
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progressPercent = Math.min(elapsed / raceDuration, 1);
      
      // Determine current phase
      const currentPhaseFloat = (elapsed / phaseInterval);
      const currentPhase = Math.floor(currentPhaseFloat);
      const phaseProgress = currentPhaseFloat - currentPhase;
      
      const newProgress = {};
      const newFinished = [];

      names.forEach((name, index) => {
        let carProgress = 0;
        
        // Interpolate between current and next phase target
        if (currentPhase >= numPhases) {
          // Race finished
          carProgress = phaseTargets[index][numPhases];
        } else {
          const currentTarget = phaseTargets[index][currentPhase];
          const nextTarget = phaseTargets[index][currentPhase + 1];
          
          // Smooth interpolation between phase targets using easing
          // Use ease-in-out for smooth transitions
          const easeProgress = phaseProgress < 0.5
            ? 2 * phaseProgress * phaseProgress
            : 1 - Math.pow(-2 * phaseProgress + 2, 2) / 2;
          
          carProgress = currentTarget + (nextTarget - currentTarget) * easeProgress;
        }
        
        // Add subtle oscillation for realistic overtaking/jostling
        // Oscillation dampens as race progresses
        const oscillation = Math.sin(
          elapsed * oscillationFreqs[index] / 1000 + oscillationPhases[index]
        ) * oscillationAmps[index] * (1 - progressPercent * 0.7);
        
        carProgress += oscillation;
        
        // Clamp progress to valid range
        carProgress = Math.max(0, Math.min(carProgress, 100));
        
        // Set final progress
        if (index === winnerIndex && progressPercent >= 1) {
          newProgress[name] = 100;
          if (!finished.includes(name)) {
            newFinished.push({ name, position: 1 });
          }
        } else {
          // Non-winners capped at 97% until race ends, then set final position
          if (progressPercent >= 1) {
            newProgress[name] = Math.min(carProgress, 97);
          } else {
            newProgress[name] = carProgress;
          }
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
