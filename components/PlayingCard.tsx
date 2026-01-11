import React from 'react';
import { Card, Suit } from '../types';

interface PlayingCardProps {
  card?: Card;
  onClick?: () => void;
  isPlaceholder?: boolean;
  label?: string;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PlayingCard: React.FC<PlayingCardProps> = ({ 
  card, 
  onClick, 
  isPlaceholder = false, 
  label,
  selected = false,
  size = 'md'
}) => {
  
  const isRed = card?.suit === Suit.HEARTS || card?.suit === Suit.DIAMONDS;
  
  const sizeClasses = {
    sm: 'w-12 h-16 text-xs',
    md: 'w-20 h-28 sm:w-24 sm:h-36 text-base',
    lg: 'w-28 h-40 sm:w-32 sm:h-48 text-xl',
  };

  const baseClasses = `
    relative rounded-lg border-2 flex flex-col items-center justify-center 
    transition-all duration-200 cursor-pointer shadow-md select-none
    ${sizeClasses[size]}
  `;

  if (isPlaceholder) {
    return (
      <div 
        onClick={onClick}
        className={`${baseClasses} border-dashed border-white/30 bg-white/5 hover:bg-white/10 hover:border-gold/50 ${selected ? 'ring-2 ring-gold border-gold bg-gold/10' : ''}`}
      >
        <span className="text-white/50 font-bold text-2xl">+</span>
        {label && <span className="text-white/40 text-[10px] uppercase mt-1 tracking-widest absolute bottom-2">{label}</span>}
      </div>
    );
  }

  if (!card) return null;

  return (
    <div 
      onClick={onClick}
      className={`${baseClasses} bg-white border-white ${selected ? 'ring-4 ring-gold transform -translate-y-2' : 'hover:-translate-y-1'}`}
    >
      {/* Top Left Rank/Suit */}
      <div className={`absolute top-1 left-1.5 flex flex-col items-center leading-none ${isRed ? 'text-card-red' : 'text-card-black'}`}>
        <span className="font-bold">{card.rank}</span>
        <span className="text-sm">{card.suit}</span>
      </div>

      {/* Center Suit */}
      <div className={`text-4xl sm:text-5xl ${isRed ? 'text-card-red' : 'text-card-black'}`}>
        {card.suit}
      </div>

      {/* Bottom Right Rank/Suit (Rotated) */}
      <div className={`absolute bottom-1 right-1.5 flex flex-col items-center leading-none transform rotate-180 ${isRed ? 'text-card-red' : 'text-card-black'}`}>
        <span className="font-bold">{card.rank}</span>
        <span className="text-sm">{card.suit}</span>
      </div>
    </div>
  );
};

export default PlayingCard;
