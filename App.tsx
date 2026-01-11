import React, { useState, useEffect } from 'react';
import { Card, SelectionMode, AIAdvice } from './types';
import PlayingCard from './components/PlayingCard';
import CardPicker from './components/CardPicker';
import AdviceDisplay from './components/AdviceDisplay';
import { getBlackjackAdvice } from './services/geminiService';
import { RefreshCw, Zap, Shield, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [dealerCard, setDealerCard] = useState<Card | null>(null);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('PLAYER');
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(-1); // -1 for new add, 0+ for replacing specific index

  const handleOpenPicker = (mode: SelectionMode, index: number = -1) => {
    setSelectionMode(mode);
    setActiveSlotIndex(index);
    setIsPickerOpen(true);
  };

  const handleSelectCard = (card: Card) => {
    if (selectionMode === 'DEALER') {
      setDealerCard(card);
    } else {
      setPlayerCards(prev => {
        const newCards = [...prev];
        if (activeSlotIndex >= 0 && activeSlotIndex < newCards.length) {
          newCards[activeSlotIndex] = card;
        } else {
          // Limit to 3 cards max
          if (newCards.length < 3) newCards.push(card);
        }
        return newCards;
      });
    }
    // Don't close immediately if we are filling the initial hand, maybe? 
    // No, better to close for clarity. User can click again.
    setIsPickerOpen(false);
    
    // Clear advice when state changes so user knows to re-ask
    if (advice) setAdvice(null);
  };

  const removePlayerCard = (index: number) => {
    setPlayerCards(prev => prev.filter((_, i) => i !== index));
    setAdvice(null);
  };

  const resetGame = () => {
    setDealerCard(null);
    setPlayerCards([]);
    setAdvice(null);
    setLoading(false);
  };

  const getAdvice = async () => {
    if (!dealerCard || playerCards.length < 2) return;
    
    setLoading(true);
    setAdvice(null);
    try {
      const result = await getBlackjackAdvice(dealerCard, playerCards);
      setAdvice(result);
    } catch (error) {
      console.error(error);
      alert('Failed to get advice. Check your internet connection or API key.');
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom when advice appears
  useEffect(() => {
    if (advice) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, [advice]);

  const canAsk = dealerCard && playerCards.length >= 2;

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-felt-dark to-slate-950 text-white font-sans selection:bg-gold selection:text-black">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="bg-gold text-black p-1.5 rounded font-bold text-xl">BJ</div>
          <h1 className="text-xl font-serif font-bold tracking-tight text-white">
            Blackjack<span className="text-gold">Bible</span>.ai
          </h1>
        </div>
        <button 
          onClick={resetGame}
          className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
          title="Reset Table"
        >
          <RefreshCw size={18} />
        </button>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-8 mt-4">
        
        {/* Dealer Section */}
        <section className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold">
            <Shield size={12} /> Dealer's Upcard
          </div>
          <div className="flex justify-center w-full">
            <PlayingCard 
              card={dealerCard || undefined} 
              isPlaceholder={!dealerCard}
              label="Select"
              onClick={() => handleOpenPicker('DEALER')}
              size="md"
            />
          </div>
        </section>

        {/* Player Section */}
        <section className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold">
            <Zap size={12} /> Your Hand
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full min-h-[160px]">
            {playerCards.map((card, index) => (
              <PlayingCard 
                key={card.id} 
                card={card}
                onClick={() => handleOpenPicker('PLAYER', index)}
                size="md"
              />
            ))}
            {playerCards.length < 3 && (
              <PlayingCard 
                isPlaceholder 
                label={playerCards.length === 0 ? "First Card" : playerCards.length === 1 ? "Second Card" : "Hit Card"}
                onClick={() => handleOpenPicker('PLAYER', -1)}
                size="md"
              />
            )}
          </div>
          {playerCards.length >= 2 && (
             <button 
               onClick={() => setPlayerCards([])} 
               className="text-xs text-slate-500 hover:text-red-400 transition-colors"
             >
               Clear Player Hand
             </button>
          )}
        </section>

        {/* Action Button */}
        <section className="pt-4">
          {!advice && (
            <button
              disabled={!canAsk || loading}
              onClick={getAdvice}
              className={`
                w-full py-4 rounded-xl font-bold text-lg tracking-wide shadow-lg
                flex items-center justify-center gap-2 transition-all duration-300
                ${canAsk 
                  ? 'bg-gradient-to-r from-gold to-yellow-300 text-black hover:shadow-gold/20 hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}
              `}
            >
              {loading ? 'Analyzing...' : 'Ask the Oracle'}
              {!loading && canAsk && <BrainIcon />}
            </button>
          )}
          
          {!canAsk && !loading && (
             <p className="text-center text-slate-500 text-xs mt-2">
               Select Dealer's card and at least 2 Player cards.
             </p>
          )}
        </section>

        {/* Result Display */}
        <div id="results">
           <AdviceDisplay advice={advice} loading={loading} onReset={resetGame} />
        </div>

      </main>

      <CardPicker 
        isOpen={isPickerOpen} 
        onClose={() => setIsPickerOpen(false)} 
        onSelect={handleSelectCard} 
      />
    </div>
  );
};

const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
);

export default App;