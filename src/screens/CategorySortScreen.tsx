import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../utils/audio';

interface CategorySortScreenProps {
  onFinishExercise: () => void;
  onDoneForToday: () => void;
  onOneMoreActivity: () => void;
}

interface SortItem {
  id: number;
  name: string;
  emoji: string;
  category: 'kitchen' | 'garden';
  detail: string;
}

const CATEGORY_ITEMS_POOL: Omit<SortItem, 'id'>[] = [
  { name: 'Ceramic Teapot', emoji: '🫖', category: 'kitchen', detail: 'Warm morning brew' },
  { name: 'Red Garden Rose', emoji: '🌹', category: 'garden', detail: 'Sweet summer fragrance' },
  { name: 'Soup Spoon', emoji: '🥄', category: 'kitchen', detail: 'Comforting meals' },
  { name: 'Watering Can', emoji: '🪴', category: 'garden', detail: 'Nurturing green plants' },
  { name: 'Wooden Cutting Board', emoji: '🪵', category: 'kitchen', detail: 'Preparing family supper' },
  { name: 'Garden Trowel', emoji: '🌱', category: 'garden', detail: 'Planting flower bulbs' },
  { name: 'Yellow Sunflower', emoji: '🌻', category: 'garden', detail: 'Turning toward sunlight' },
  { name: 'Baking Whisk', emoji: '🥣', category: 'kitchen', detail: 'Whipping fresh cream' },
  { name: 'Straw Sun Hat', emoji: '👒', category: 'garden', detail: 'Shade on sunny afternoons' },
  { name: 'Tea Kettle', emoji: '☕', category: 'kitchen', detail: 'Boiling water for tea' },
  { name: 'Ripe Tomato Vine', emoji: '🍅', category: 'garden', detail: 'Plucking sweet garden tomatoes' },
  { name: 'Rolling Pin', emoji: '🥖', category: 'kitchen', detail: 'Baking soft bread' },
];

const generateSortItems = (count = 4): SortItem[] => {
  const kitchen = CATEGORY_ITEMS_POOL.filter((i) => i.category === 'kitchen').sort(() => Math.random() - 0.5);
  const garden = CATEGORY_ITEMS_POOL.filter((i) => i.category === 'garden').sort(() => Math.random() - 0.5);
  const selected = [
    ...kitchen.slice(0, Math.floor(count / 2)),
    ...garden.slice(0, Math.ceil(count / 2)),
  ].sort(() => Math.random() - 0.5);
  return selected.map((item, idx) => ({ ...item, id: idx + 1 }));
};

export const CategorySortScreen: React.FC<CategorySortScreenProps> = ({
  onFinishExercise,
  onDoneForToday,
  onOneMoreActivity,
}) => {
  const [items, setItems] = useState<SortItem[]>(() => generateSortItems(4));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [kitchenCount, setKitchenCount] = useState(0);
  const [gardenCount, setGardenCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const hasFinishedRef = useRef(false);

  const currentItem = items[currentIndex];

  const handlePlayAgain = () => {
    soundService.playGentleChime();
    setItems(generateSortItems(4));
    setCurrentIndex(0);
    setKitchenCount(0);
    setGardenCount(0);
    setFeedback(null);
    hasFinishedRef.current = false;
    setIsCompleted(false);
  };

  useEffect(() => {
    if (isCompleted && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      soundService.playCelebrationSound();
      onFinishExercise();
    }
  }, [isCompleted, onFinishExercise]);

  const handleSort = (destination: 'kitchen' | 'garden') => {
    soundService.playSoftTap();
    if (destination === currentItem.category) {
      soundService.playGentleChime();
      if (destination === 'kitchen') setKitchenCount((c) => c + 1);
      else setGardenCount((c) => c + 1);

      setFeedback(`Correct! The ${currentItem.name} belongs in the ${destination}.`);
      setTimeout(() => {
        if (currentIndex < items.length - 1) {
          setCurrentIndex((i) => i + 1);
          setFeedback(null);
        } else {
          setIsCompleted(true);
        }
      }, 1200);
    } else {
      setFeedback(`Take a gentle look: where would you find a ${currentItem.name}?`);
    }
  };

  const handleHearItem = () => {
    soundService.speakText(
      `Where does the ${currentItem.name} go? Tap the Kitchen basket or the Garden basket.`
    );
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto pb-28 pt-24 px-4 sm:px-6">
      {!isCompleted ? (
        <div className="flex flex-col w-full space-y-5 animate-fade-in">
          {/* Step header */}
          <div className="flex items-center justify-between py-1">
            <span className="text-[16px] font-semibold text-[#42474d]">
              Item {currentIndex + 1} of {items.length}
            </span>
            <span className="text-[15px] text-[#35675f] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">category</span>
              <span>Gentle Sorting</span>
            </span>
          </div>

          {/* Current Item Presentation */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#eae4dc] text-center flex flex-col items-center">
            <span className="text-[14px] font-bold text-[#35675f] uppercase tracking-wider mb-2">
              Where does this belong?
            </span>
            <div className="w-24 h-24 rounded-full bg-[#f1f4f9] flex items-center justify-center text-[58px] shadow-inner mb-2 select-none">
              {currentItem.emoji}
            </div>
            <h2 className="text-[26px] font-bold text-[#181c20]">
              {currentItem.name}
            </h2>
            <p className="text-[16px] text-[#42474d] mt-0.5">
              {currentItem.detail}
            </p>

            <button
              type="button"
              onClick={handleHearItem}
              className="mt-3 px-3 py-1.5 rounded-full bg-[#ebeef3] hover:bg-[#e0e3e8] text-[#0c405e] font-bold text-[14px] flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">volume_up</span>
              <span>Hear prompt</span>
            </button>
          </section>

          {/* Feedback banner */}
          {feedback && (
            <div className="p-3.5 bg-[#b8ede3] text-[#00201c] rounded-2xl font-bold text-[16px] flex items-center gap-2 border border-[#35675f]/30">
              <span className="material-symbols-outlined text-[22px] text-[#35675f]">
                favorite
              </span>
              <span>{feedback}</span>
            </div>
          )}

          {/* Two Large Basket Touch Targets */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            {/* Kitchen Basket */}
            <button
              type="button"
              onClick={() => handleSort('kitchen')}
              className="min-h-[140px] rounded-2xl bg-white hover:bg-[#cbe6ff]/30 active:scale-[0.98] border-2 border-[#0c405e] p-4 flex flex-col items-center justify-center text-center shadow-md transition-all cursor-pointer"
            >
              <span className="text-5xl select-none mb-1">🍽️</span>
              <span className="text-[20px] font-bold text-[#0c405e]">
                In the Kitchen
              </span>
              <span className="text-[13px] text-[#42474d] mt-1 font-medium">
                {kitchenCount} items sorted
              </span>
            </button>

            {/* Garden Basket */}
            <button
              type="button"
              onClick={() => handleSort('garden')}
              className="min-h-[140px] rounded-2xl bg-white hover:bg-[#b8ede3]/40 active:scale-[0.98] border-2 border-[#35675f] p-4 flex flex-col items-center justify-center text-center shadow-md transition-all cursor-pointer"
            >
              <span className="text-5xl select-none mb-1">🌿</span>
              <span className="text-[20px] font-bold text-[#35675f]">
                In the Garden
              </span>
              <span className="text-[13px] text-[#42474d] mt-1 font-medium">
                {gardenCount} items sorted
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Celebration */
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
            Nicely Sorted, Ravi!
          </h1>
          <p className="text-[18px] text-[#42474d] mt-1.5 leading-relaxed">
            All kitchen and garden treasures are neatly in their right places.
          </p>

          <section className="mt-5 rounded-2xl bg-[#b8ede3] text-[#00201c] p-5 shadow-sm border border-[#35675f]/20 text-left">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#35675f] text-[26px]">
                inventory_2
              </span>
              <div>
                <p className="font-bold text-[18px]">Everyday Organization</p>
                <p className="text-[16px] text-[#00201c]/90 mt-0.5">
                  Sorting familiar objects by their place strengthens functional memory and daily independence.
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
              <span>PLAY WITH NEW ITEMS</span>
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
