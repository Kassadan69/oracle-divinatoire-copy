import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EgyptianCard, { EGYPTIAN_CARDS } from './EgyptianCard';

export default function CardRevealPhase({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsFlipping(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  }, [timeLeft, onComplete]);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Timer et message */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-[#6b4423] font-serif text-lg mb-2">
          𓂀 Observez attentivement les cartes 𓂀
        </div>
        <div className="text-[#8b6914] font-bold text-3xl font-serif">
          {timeLeft > 0 ? (
            <>
              <span className="text-5xl">{timeLeft}</span>
              <span className="text-lg ml-2">secondes</span>
            </>
          ) : (
            "Les cartes se retournent..."
          )}
        </div>
        <p className="text-[#8b7355] text-sm mt-2 italic">
          Laissez votre intuition vous guider vers les cartes qui vous appellent
        </p>
      </motion.div>

      {/* Grille de cartes */}
      <div className="flex flex-wrap justify-center gap-2 max-w-4xl px-2">
        {EGYPTIAN_CARDS.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <EgyptianCard
              card={card}
              isFlipped={!isFlipping}
              showName={!isFlipping}
              size="small"
              disabled
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}