import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EgyptianCard, { EGYPTIAN_CARDS } from './EgyptianCard';

export default function CardDeck({ 
  onCardsSelected, 
  numberOfCards = 3,
  disabled = false 
}) {
  const [cards] = useState(() => {
    const shuffled = [...EGYPTIAN_CARDS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
  const [selectedCards, setSelectedCards] = useState([]);
  const [allRevealed, setAllRevealed] = useState(false);

  const selectCard = (cardIndex) => {
    if (selectedCards.length >= numberOfCards || allRevealed) return;
    
    const card = cards[cardIndex];
    if (selectedCards.some(s => s.id === card.id)) return;
    
    const reversed = Math.random() < 0.3;
    const newSelected = [...selectedCards, { ...card, reversed, position: selectedCards.length + 1 }];
    setSelectedCards(newSelected);

    // Quand toutes les cartes sont sélectionnées, les retourner
    if (newSelected.length === numberOfCards) {
      setTimeout(() => {
        setAllRevealed(true);
        setTimeout(() => {
          onCardsSelected(newSelected);
        }, 1500);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Instructions */}
      <div className="text-center text-[#6b4423] font-serif font-medium text-lg">
        𓂀 Sélectionnez {numberOfCards - selectedCards.length} carte{numberOfCards - selectedCards.length > 1 ? 's' : ''} 𓂀
      </div>
      <p className="text-[#8b7355] text-sm italic text-center">
        Laissez votre intuition vous guider
      </p>

      {/* Cartes sélectionnées */}
      {selectedCards.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <AnimatePresence>
            {selectedCards.map((card, index) => (
              <motion.div
                key={`selected-${card.id}`}
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="text-[#6b4423] text-xs mb-1 font-serif font-medium">
                  Position {card.position}
                </div>
                <EgyptianCard
                  card={card}
                  isFlipped={allRevealed}
                  reversed={card.reversed}
                  showName={allRevealed}
                  size="large"
                  disabled
                  isHighlighted={!allRevealed}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Deck de cartes à choisir */}
      <div className="flex flex-wrap justify-center gap-2 max-w-4xl px-2">
        <AnimatePresence>
          {cards.map((card, index) => {
            const isAlreadySelected = selectedCards.some(s => s.id === card.id);
            if (isAlreadySelected) return null;
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <EgyptianCard
                  card={card}
                  isFlipped={false}
                  onClick={() => selectCard(index)}
                  disabled={disabled || selectedCards.length >= numberOfCards}
                  size="small"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}