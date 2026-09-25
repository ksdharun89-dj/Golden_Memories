import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../utils/audio';

interface MatchPicturesScreenProps {
  onFinishExercise: () => void;
  onDoneForToday: () => void;
  onOneMoreActivity: () => void;
}

interface Card {
  id: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_PAIRS_POOL = [
  { emoji: '🌻', name: 'Sunflower' },
  { emoji: '🍓', name: 'Strawberry' },
  { emoji: '🍊', name: 'Orange' },
  { emoji: '🪻', name: 'Lavender' },
  { emoji: '🍎', name: 'Red Apple' },
  { emoji: '☕', name: 'Warm Teacup' },
  { emoji: '🦋', name: 'Blue Butterfly' },
  { emoji: '🔔', name: 'Golden Bell' },
];

const generateMatchCards = (pairCount = 3): Card[] => {
  const shuffledPairs = [...CARD_PAIRS_POOL].sort(() => Math.random() - 0.5).slice(0, pairCount);
  const deck: Card[] = [];
  let idCounter = 1;
  shuffledPairs.forEach((pair) => {
    deck.push({ id: idCounter++, emoji: pair.emoji, name: pair.name, isFlipped: false, isMatched: false });
    deck.push({ id: idCounter++, emoji: pair.emoji, name: pair.name, isFlipped: false, isMatched: false });
  });
  return deck.sort(() => Math.random() - 0.5);
};

export const MatchPicturesScreen: React.FC<MatchPicturesScreenProps> = ({
  onFinishExercise,
  onDoneForToday,
  onOneMoreActivity,
}) => {
  const [cards, setCards] = useState<Card[]>(() => generateMatchCards(3));
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeakingGuide, setIsSpeakingGuide] = useState(false);
  const hasFinishedRef = useRef(false);

  const handlePlayAgain = () => {
    soundService.playGentleChime();
    setCards(generateMatchCards(3));
    setSelectedCards([]);
    hasFinishedRef.current = false;
    setIsCompleted(false);
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.isMatched) && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      setIsCompleted(true);
      soundService.playCelebrationSound();
      onFinishExercise();
    }
  }, [cards, onFinishExercise]);

  const handleCardClick = (index: number) => {
    if (selectedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    soundService.playSoftTap();
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [firstIdx, secondIdx] = newSelected;
      if (newCards[firstIdx].name === newCards[secondIdx].name) {
        // Matched
        setTimeout(() => {
          soundService.playGentleChime();
          const matchedCards = [...newCards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setSelectedCards([]);
        }, 500);
      } else {
        // Not matched, flip back gently
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setSelectedCards([]);
        }, 1200);
      }
    }
  };

  const handleHearGuide = () => {
    if (isSpeakingGuide) {
      soundService.stopSpeech();
      setIsSpeakingGuide(false);
      return;
    }

    const text =
      "Match the pictures. Tap any two cards to find matching pairs of flowers and fruits. Take your time, there is no hurry.";

    soundService.speakText(text, {
      onStart: () => setIsSpeakingGuide(true),
      onEnd: () => setIsSpeakingGuide(false),
      onError: () => setIsSpeakingGuide(false),
    });
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto pb-28 pt-24 px-4 sm:px-6">
      {!isCompleted ? (
        <div className="flex flex-col w-full space-y-4">
          <div className="flex items-center justify-between py-1">
            <span className="text-[16px] font-semibold text-[#42474d]">
              Gentle Activity: Picture Pairs
            </span>
            <span className="text-[15px] text-[#35675f] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">nature_people</span>
              <span>Paced for Comfort</span>
            </span>
          </div>

          <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#eae4dc]">
            <h1 className="text-[26px] font-bold text-[#181c20] tracking-tight mb-1">
              Match the Pictures
            </h1>
            <p className="text-[18px] text-[#42474d] leading-relaxed">
              Find pairs of everyday flowers and fruits. Tap two cards to turn them over.
            </p>
          </section>

          {/* 3x2 Grid of Cards */}
          <div className="grid grid-cols-3 gap-3">
            {cards.map((card, index) => {
              const showFace = card.isFlipped || card.isMatched;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleCardClick(index)}
                  className={`h-32 sm:h-36 rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer border-2 shadow-sm ${
                    card.isMatched
                      ? 'bg-[#b8ede3]/50 border-[#35675f] scale-98'
                      : showFace
                      ? 'bg-white border-[#0c405e]'
                      : 'bg-[#f1f4f9] hover:bg-[#ebeef3] border-[#eae4dc]'
                  }`}
                >
                  {showFace ? (
                    <>
                      <span className="text-5xl select-none">{card.emoji}</span>
                      <span className="text-[15px] font-bold text-[#181c20] mt-1">
                        {card.name}
                      </span>
                    </>
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-[#35675f]">
                      psychology
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Audio Prompt Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eae4dc] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#35675f] text-[26px]">
                spa
              </span>
              <p className="text-[15px] text-[#42474d]">
                Take all the time you need. No rushing.
              </p>
            </div>
            <button
              type="button"
              onClick={handleHearGuide}
              className="px-3.5 py-2 rounded-xl bg-[#e5e8ee] hover:bg-[#e0e3e8] text-[#0c405e] font-bold text-[14px] flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">volume_up</span>
              <span>Hear</span>
            </button>
          </div>
        </div>
      ) : (
        /* Celebration on completion */
        <div className="flex flex-col w-full pb-6 max-w-[560px] mx-auto animate-fade-in text-center">
          <div className="relative w-28 h-28 rounded-full bg-[#ffdcc1] flex items-center justify-center shadow-lg mx-auto mt-2">
            <span
              className="material-symbols-outlined text-[64px] text-[#5d3100]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
          </div>

          <h1 className="text-[28px] sm:text-[34px] font-bold text-[#181c20] mt-4 tracking-tight">
            Splendid Job, Ravi!
          </h1>
          <p className="text-[18px] text-[#42474d] mt-1.5 leading-relaxed">
            You matched all the picture pairs gracefully.
          </p>

          <section className="mt-5 rounded-2xl bg-[#b8ede3] text-[#00201c] p-5 shadow-sm border border-[#35675f]/20 text-left">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#35675f] text-[26px]">
                local_florist
              </span>
              <div>
                <p className="font-bold text-[18px]">Gentle Visual Memory</p>
                <p className="text-[16px] text-[#00201c]/90 mt-0.5">
                  Observing shapes and colors helps nurture quiet calm and mental clarity.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-6 flex flex-col gap-3 text-left">
            <button
              type="button"
              onClick={handlePlayAgain}
              className="w-full min-h-[60px] rounded-2xl bg-[#b8ede3] text-[#00201c] font-bold text-[19px] flex items-center justify-center gap-2 hover:bg-[#a0e4d7] active:scale-[0.99] transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[24px]">replay</span>
              <span>PLAY WITH NEW CARDS</span>
            </button>

            <button
              type="button"
              onClick={onOneMoreActivity}
              className="w-full min-h-[60px] rounded-2xl bg-[#2b5777] text-white font-bold text-[19px] flex items-center justify-center gap-2.5 shadow-md hover:bg-[#0c405e] cursor-pointer"
            >
              <span>ONE MORE ACTIVITY</span>
              <span className="material-symbols-outlined text-[26px]">arrow_forward</span>
            </button>

            <button
              type="button"
              onClick={onDoneForToday}
              className="w-full min-h-[56px] rounded-2xl bg-[#e5e8ee] text-[#181c20] font-bold text-[18px] flex items-center justify-center gap-2 hover:bg-[#e0e3e8] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">home</span>
              <span>I’M DONE FOR TODAY</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
