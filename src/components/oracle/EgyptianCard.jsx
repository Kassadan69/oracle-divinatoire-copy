import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const EGYPTIAN_CARDS = [
  { id: 0, name: "Râ", deity: "Dieu Soleil", symbol: "☀️", meaning: "Puissance, vie, création" },
  { id: 1, name: "Isis", deity: "Déesse de la Magie", symbol: "🌙", meaning: "Magie, protection, sagesse" },
  { id: 2, name: "Osiris", deity: "Dieu de l'Au-delà", symbol: "⚱️", meaning: "Renaissance, éternité, jugement" },
  { id: 3, name: "Anubis", deity: "Guide des Morts", symbol: "🐺", meaning: "Transition, protection, vérité" },
  { id: 4, name: "Horus", deity: "Dieu Faucon", symbol: "🦅", meaning: "Vision, royauté, victoire" },
  { id: 5, name: "Thot", deity: "Dieu de la Sagesse", symbol: "📜", meaning: "Connaissance, écriture, magie" },
  { id: 6, name: "Bastet", deity: "Déesse Chatte", symbol: "🐱", meaning: "Foyer, fertilité, joie" },
  { id: 7, name: "Seth", deity: "Dieu du Chaos", symbol: "⚡", meaning: "Chaos, force, tempête" },
  { id: 8, name: "Maât", deity: "Déesse de la Justice", symbol: "⚖️", meaning: "Vérité, équilibre, ordre" },
  { id: 9, name: "Hathor", deity: "Déesse de l'Amour", symbol: "💫", meaning: "Amour, beauté, musique" },
  { id: 10, name: "Sekhmet", deity: "Déesse Lionne", symbol: "🦁", meaning: "Guerre, guérison, puissance" },
  { id: 11, name: "Ptah", deity: "Dieu Créateur", symbol: "🔨", meaning: "Artisanat, création, stabilité" },
  { id: 12, name: "Nephthys", deity: "Dame du Temple", symbol: "🏛️", meaning: "Mystère, mort, renaissance" },
  { id: 13, name: "Sobek", deity: "Dieu Crocodile", symbol: "🐊", meaning: "Force, fertilité, protection" },
  { id: 14, name: "Khépri", deity: "Scarabée Sacré", symbol: "🪲", meaning: "Transformation, aube, renouveau" },
  { id: 15, name: "Nout", deity: "Déesse du Ciel", symbol: "✨", meaning: "Ciel, étoiles, protection" },
  { id: 16, name: "Geb", deity: "Dieu de la Terre", symbol: "🌍", meaning: "Terre, fertilité, fondation" },
  { id: 17, name: "Amon", deity: "Roi des Dieux", symbol: "👑", meaning: "Mystère, souffle, création" },
  { id: 18, name: "Sekhemet", deity: "Œil de Râ", symbol: "👁️", meaning: "Protection, clairvoyance, feu" },
  { id: 19, name: "Le Nil", deity: "Fleuve Sacré", symbol: "🌊", meaning: "Abondance, vie, purification" },
  { id: 20, name: "L'Ankh", deity: "Clé de Vie", symbol: "☥", meaning: "Vie éternelle, santé, bonheur" },
  { id: 21, name: "Le Scarabée d'Or", deity: "Talisman", symbol: "🌟", meaning: "Chance, protection, destinée" }
];

export { EGYPTIAN_CARDS };

export default function EgyptianCard({ 
  card, 
  isFlipped = false, 
  isSelected = false,
  onClick,
  disabled = false,
  size = "normal",
  reversed = false,
  showName = false
}) {
  const sizeClasses = {
    small: "w-16 h-24 md:w-20 md:h-32",
    normal: "w-20 h-32 md:w-28 md:h-44",
    large: "w-28 h-44 md:w-36 md:h-56"
  };

  return (
    <motion.div
      className={cn(
        "relative cursor-pointer",
        sizeClasses[size],
        disabled && "cursor-not-allowed opacity-50"
      )}
      onClick={!disabled ? onClick : undefined}
      whileHover={!disabled ? { scale: 1.05, y: -8 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          rotateZ: reversed && isFlipped ? 180 : 0
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Dos de la carte - Style Égyptien */}
        <div 
          className={cn(
            "absolute inset-0 rounded-lg",
            "bg-gradient-to-br from-[#1a0f0a] via-[#2c1810] to-[#0d0705]",
            "border-2 border-[#d4a84b]",
            "flex items-center justify-center",
            "shadow-lg shadow-amber-900/50",
            isSelected && "ring-2 ring-[#ffd700] ring-offset-2 ring-offset-[#1a0f0a]"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Bordure intérieure dorée */}
          <div className="absolute inset-1.5 border border-[#d4a84b]/40 rounded" />
          <div className="absolute inset-3 border border-[#d4a84b]/20 rounded" />
          
          {/* Motif central - Œil d'Horus */}
          <div className="relative">
            <div className="text-[#d4a84b] text-3xl md:text-5xl">𓂀</div>
          </div>
          
          {/* Hiéroglyphes décoratifs */}
          <div className="absolute top-2 left-2 text-[#d4a84b]/30 text-xs">𓁹</div>
          <div className="absolute top-2 right-2 text-[#d4a84b]/30 text-xs">𓁹</div>
          <div className="absolute bottom-2 left-2 text-[#d4a84b]/30 text-xs">𓆣</div>
          <div className="absolute bottom-2 right-2 text-[#d4a84b]/30 text-xs">𓆣</div>
        </div>

        {/* Face de la carte */}
        <div 
          className={cn(
            "absolute inset-0 rounded-lg",
            "bg-gradient-to-br from-[#f4e4c1] via-[#e8d4a8] to-[#d4bc8a]",
            "border-2 border-[#8b6914]",
            "flex flex-col items-center justify-center p-2",
            "shadow-xl shadow-amber-900/30"
          )}
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {/* Décoration supérieure */}
          <div className="absolute top-1 w-full flex justify-center">
            <div className="text-[#8b6914]/60 text-xs">𓊝𓊝𓊝</div>
          </div>
          
          {/* Symbole principal */}
          <div className="text-3xl md:text-5xl mb-1">{card?.symbol}</div>
          
          {/* Nom de la carte */}
          {showName && (
            <>
              <div className="text-xs md:text-sm text-center font-bold text-[#3d2914] leading-tight">
                {card?.name}
              </div>
              <div className="text-[8px] md:text-[10px] text-center text-[#6b4423] italic">
                {card?.deity}
              </div>
            </>
          )}
          
          {reversed && (
            <div className="absolute bottom-1 text-[8px] text-red-700 font-medium bg-red-100/80 px-1 rounded">
              Inversée
            </div>
          )}
          
          {/* Décoration inférieure */}
          <div className="absolute bottom-1 w-full flex justify-center">
            <div className="text-[#8b6914]/60 text-xs">𓊝𓊝𓊝</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}