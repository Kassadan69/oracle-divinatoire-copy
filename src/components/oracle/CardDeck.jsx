import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EgyptianCard, { EGYPTIAN_CARDS } from './EgyptianCard';
import { Button } from "@/components/ui/button";
import { Shuffle } from 'lucide-react';

export default function CardDeck({ 
  onCardsSelected, 
  numberOfCards = 3,
  disabled = false 
}) {
  const [cards, setCards] = useState([...EGYPTIAN_CARDS]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [revealedCards, setRevealedCards] = useState([]);
  const [phase, setPhase] = useState('initial'); // initial, shuffled, selecting, complete

  const shuffleCards = () => {
    setIsShuffling(true);
    setSelectedCards([]);
    setRevealedCards([]);
    setPhase('shuffling');

    // Animation de mélange
    let shuffleCount = 0;
    const shuffleInterval = setInterval(() => {
      setCards(prev => {
        const newCards = [...prev];
        for (let i = newCards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
        }
        return newCards;
      });
      shuffleCount++;
      if (shuffleCount >= 8) {
        clearInterval(shuffleInterval);
        setIsShuffling(false);
        setPhase('selecting');
      }
    }, 150);
  };

  const selectCard = (cardIndex) => {
    if (selectedCards.length >= numberOfCards || phase !== 'selecting') return;
    
    const card = cards[cardIndex];
    const reversed = Math.random() < 0.3; // 30% chance d'être inversée
    
    const newSelected = [...selectedCards, { ...card, reversed, position: selectedCards.length + 1 }];
    setSelectedCards(newSelected);
    
    // Révéler la carte après un délai
    setTimeout(() => {
      setRevealedCards(prev => [...prev, card.id]);
    }, 300);

    if (newSelected.length === numberOfCards) {
      setPhase('complete');
      setTimeout(() => {
        onCardsSelected(newSelected);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Instructions */}
      <div className="text-center text-[#d4a84b] font-serif">
        {phase === 'initial' && "Mélangez les cartes pour commencer la consultation"}
        {phase === 'shuffling' && "Les cartes se mélangent..."}
        {phase === 'selecting' && `Sélectionnez ${numberOfCards - selectedCards.length} carte(s)`}
        {phase === 'complete' && "Lecture des cartes en cours..."}
      </div>

      {/* Bouton Mélanger */}
      {(phase === 'initial' || phase === 'complete') && (
        <Button
          onClick={shuffleCards}
          disabled={disabled || isShuffling}
          className="bg-gradient-to-r from-[#d4a84b] to-[#b8860b] hover:from-[#e5b84d] hover:to-[#c99a0b] text-[#1a0f0a] font-bold px-8 py-3 rounded-full shadow-lg shadow-amber-900/30 border border-[#ffd700]/30"
        >
          <Shuffle className="w-5 h-5 mr-2" />
          Mélanger les Cartes
        </Button>
      )}

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
                <div className="text-[#d4a84b] text-xs mb-1 font-serif">
                  Position {card.position}
                </div>
                <EgyptianCard
                  card={card}
                  isFlipped={revealedCards.includes(card.id)}
                  reversed={card.reversed}
                  showName={revealedCards.includes(card.id)}
                  size="large"
                  disabled
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Deck de cartes */}
      {phase === 'selecting' && (
        <div className="relative">
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
            <AnimatePresence>
              {cards.map((card, index) => {
                const isAlreadySelected = selectedCards.some(s => s.id === card.id);
                if (isAlreadySelected) return null;
                
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: isShuffling ? Math.random() * 20 - 10 : 0,
                      y: isShuffling ? Math.random() * 20 - 10 : 0,
                      rotate: isShuffling ? Math.random() * 10 - 5 : 0
                    }}
                    exit={{ opacity: 0, scale: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EgyptianCard
                      card={card}
                      isFlipped={false}
                      onClick={() => selectCard(index)}
                      disabled={disabled || isShuffling || selectedCards.length >= numberOfCards}
                      size="small"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Deck empilé avant mélange */}
      {phase === 'initial' && (
        <div className="relative h-40 w-32">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ 
                top: i * 2, 
                left: i * 2,
                zIndex: 5 - i 
              }}
              animate={{ rotate: i * 2 - 4 }}
            >
              <EgyptianCard
                card={EGYPTIAN_CARDS[0]}
                isFlipped={false}
                disabled
                size="normal"
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}