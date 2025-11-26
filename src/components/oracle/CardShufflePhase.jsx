import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import EgyptianCard, { EGYPTIAN_CARDS } from './EgyptianCard';

export default function CardShufflePhase({ onComplete }) {
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleProgress, setShuffleProgress] = useState(0);
  const [cardPositions, setCardPositions] = useState(
    EGYPTIAN_CARDS.map((_, i) => ({ x: 0, y: 0, rotate: 0, index: i }))
  );
  const containerRef = useRef(null);
  const lastTouchRef = useRef(null);
  const shuffleCountRef = useRef(0);

  const handleTouchMove = (e) => {
    if (shuffleProgress >= 100) return;
    
    const touch = e.touches ? e.touches[0] : e;
    const currentPos = { x: touch.clientX, y: touch.clientY };
    
    if (lastTouchRef.current) {
      const distance = Math.sqrt(
        Math.pow(currentPos.x - lastTouchRef.current.x, 2) +
        Math.pow(currentPos.y - lastTouchRef.current.y, 2)
      );
      
      if (distance > 10) {
        setIsShuffling(true);
        shuffleCountRef.current += 1;
        
        // Mettre à jour la progression
        setShuffleProgress(prev => Math.min(prev + 2, 100));
        
        // Animation des cartes
        setCardPositions(prev => prev.map((pos, i) => ({
          ...pos,
          x: (Math.random() - 0.5) * 150,
          y: (Math.random() - 0.5) * 100,
          rotate: (Math.random() - 0.5) * 30,
          index: Math.floor(Math.random() * EGYPTIAN_CARDS.length)
        })));
      }
    }
    
    lastTouchRef.current = currentPos;
  };

  const handleTouchEnd = () => {
    lastTouchRef.current = null;
    if (!isShuffling) return;
    
    // Remettre les cartes en place progressivement
    setTimeout(() => {
      setCardPositions(EGYPTIAN_CARDS.map((_, i) => ({ 
        x: 0, y: 0, rotate: 0, index: i 
      })));
    }, 300);
  };

  useEffect(() => {
    if (shuffleProgress >= 100) {
      setTimeout(() => {
        setCardPositions(EGYPTIAN_CARDS.map((_, i) => ({ 
          x: 0, y: 0, rotate: 0, index: i 
        })));
        setTimeout(() => {
          onComplete();
        }, 800);
      }, 500);
    }
  }, [shuffleProgress, onComplete]);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-[#6b4423] font-serif text-lg mb-2">
          𓂀 Mélangez les cartes avec votre doigt 𓂀
        </div>
        <p className="text-[#8b7355] text-sm italic mb-4">
          Frottez l'écran pour mélanger les cartes sacrées
        </p>
        
        {/* Barre de progression */}
        <div className="w-64 h-3 bg-[#d4bc8a] rounded-full overflow-hidden border border-[#8b6914]/30 mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8b6914] to-[#d4a84b]"
            initial={{ width: 0 }}
            animate={{ width: `${shuffleProgress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <p className="text-[#6b4423] text-sm mt-2 font-medium">
          {shuffleProgress < 100 ? `${shuffleProgress}%` : "Cartes mélangées !"}
        </p>
      </motion.div>

      {/* Zone de mélange */}
      <div
        ref={containerRef}
        className="relative w-full max-w-4xl h-[300px] md:h-[350px] bg-[#e8d4a8]/50 rounded-2xl border-2 border-dashed border-[#8b6914]/40 touch-none cursor-grab active:cursor-grabbing overflow-hidden"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseMove={(e) => e.buttons === 1 && handleTouchMove(e)}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {/* Indicateur visuel */}
        {!isShuffling && shuffleProgress === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[#8b6914] text-center"
            >
              <div className="text-4xl mb-2">👆</div>
              <div className="text-sm font-serif">Glissez ici</div>
            </motion.div>
          </div>
        )}

        {/* Cartes animées */}
        <div className="absolute inset-0 flex flex-wrap justify-center items-center gap-1 p-4">
          {EGYPTIAN_CARDS.map((card, index) => (
            <motion.div
              key={card.id}
              animate={{
                x: cardPositions[index]?.x || 0,
                y: cardPositions[index]?.y || 0,
                rotate: cardPositions[index]?.rotate || 0,
                scale: isShuffling ? 0.9 : 1,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20 
              }}
              className="pointer-events-none"
            >
              <EgyptianCard
                card={card}
                isFlipped={false}
                size="small"
                disabled
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}