import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../utils/audio';

interface WordSayingsScreenProps {
  onFinishExercise: () => void;
  onDoneForToday: () => void;
  onOneMoreActivity: () => void;
}

interface SayingPrompt {
  id: number;
  prefix: string;
  correctSuffix: string;
  options: string[];
  meaning: string;
}

const SAYINGS_POOL = [
  {
    prefix: 'Home is where the...',
    correctSuffix: 'Heart is',
    distractors: ['Sun shines', 'Garden blooms', 'River flows'],
    meaning: 'Love and warmth are always centered at home with family.',
  },
  {
    prefix: 'A stitch in time saves...',
    correctSuffix: 'Nine',
    distractors: ['Five', 'Ten', 'Seven'],
    meaning: 'Taking small, gentle steps today brings peace tomorrow.',
  },
  {
    prefix: 'Early to bed and early to...',
    correctSuffix: 'Rise',
    distractors: ['Rest', 'Walk', 'Smile'],
    meaning: 'A steady, restful sleep routine keeps our spirits bright.',
  },
  {
    prefix: 'Every cloud has a silver...',
    correctSuffix: 'Lining',
    distractors: ['Shine', 'Border', 'Morning'],
    meaning: 'There is always hope, brightness, and comfort even on cloudy days.',
  },
  {
    prefix: 'Laughter is the best...',
    correctSuffix: 'Medicine',
    distractors: ['Sunshine', 'Treasure', 'Melody'],
    meaning: 'A joyful smile and lighthearted laugh bring wellness to the soul.',
  },
  {
    prefix: 'Actions speak louder than...',
    correctSuffix: 'Words',
    distractors: ['Echoes', 'Whispers', 'Songs'],
    meaning: 'Gentle loving care shows in everyday thoughtful gestures.',
  },
  {
    prefix: 'Birds of a feather flock...',
    correctSuffix: 'Together',
    distractors: ['Forever', 'Far away', 'In harmony'],
    meaning: 'Family and friends who love each other stay close together.',
  },
  {
    prefix: 'Good things come to those who...',
    correctSuffix: 'Wait',
    distractors: ['Dream', 'Listen', 'Smile'],
    meaning: 'Patience and a relaxed pace bring peace and good tidings.',
  },
  {
    prefix: 'A picture is worth a thousand...',
    correctSuffix: 'Words',
    distractors: ['Stories', 'Moments', 'Smiles'],
    meaning: 'Cherished photographs hold warm memories across time.',
  },
  {
    prefix: 'When one door closes, another...',
    correctSuffix: 'Opens',
    distractors: ['Unlocks', 'Appears', 'Welcomes'],
    meaning: 'Each new day brings welcoming warmth and fresh blessings.',
  },
];

const generateSayingPrompts = (count = 3): SayingPrompt[] => {
  const pool = [...SAYINGS_POOL].sort(() => Math.random() - 0.5);
  const selected = pool.slice(0, count);

  return selected.map((item, idx) => {
    const shuffledDistractors = [...item.distractors].sort(() => Math.random() - 0.5);
    const chosenDistractors = shuffledDistractors.slice(0, 2);
    // Shuffle the options so the correct answer is NOT always in the first position
    const options = [item.correctSuffix, ...chosenDistractors].sort(() => Math.random() - 0.5);

    return {
      id: idx + 1,
      prefix: item.prefix,
      correctSuffix: item.correctSuffix,
      options,
      meaning: item.meaning,
    };
  });
};

export const WordSayingsScreen: React.FC<WordSayingsScreenProps> = ({
  onFinishExercise,
  onDoneForToday,
  onOneMoreActivity,
}) => {
  const [prompts, setPrompts] = useState<SayingPrompt[]>(() => generateSayingPrompts(3));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const hasFinishedRef = useRef(false);

  const currentPrompt = prompts[currentIndex];

  const handlePlayAgain = () => {
    soundService.playGentleChime();
    setPrompts(generateSayingPrompts(3));
    setCurrentIndex(0);
    setSelectedOption(null);
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

  const handleHearSaying = () => {
    soundService.speakText(
      `Complete this familiar saying: ${currentPrompt.prefix}... Choose the words that fit.`
    );
  };

  const handleSelectOption = (option: string) => {
    soundService.playSoftTap();
    setSelectedOption(option);

    if (option === currentPrompt.correctSuffix) {
      soundService.playGentleChime();
      setFeedback('Beautifully remembered! 🌿');

      setTimeout(() => {
        if (currentIndex < prompts.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setFeedback(null);
        } else {
          setIsCompleted(true);
        }
      }, 1400);
    } else {
      setFeedback('A lovely thought! Try the timeless classic saying.');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto pb-28 pt-24 px-4 sm:px-6">
      {!isCompleted ? (
        <div className="flex flex-col w-full space-y-5 animate-fade-in">
          {/* Header step */}
          <div className="flex items-center justify-between py-1">
            <span className="text-[16px] font-semibold text-[#42474d]">
              Saying {currentIndex + 1} of {prompts.length}
            </span>
            <span className="text-[15px] text-[#35675f] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>Words of Comfort</span>
            </span>
          </div>

          {/* Main Card */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#eae4dc]">
            <span className="text-[14px] font-bold text-[#35675f] uppercase tracking-wider block mb-1">
              Familiar Sayings
            </span>
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0c405e] tracking-tight leading-snug">
              “{currentPrompt.prefix}”
            </h1>
            <p className="text-[17px] text-[#42474d] mt-2">
              Which comforting phrase finishes this timeless saying?
            </p>
          </section>

          {/* Large, comfortable options */}
          <div className="flex flex-col space-y-3">
            {currentPrompt.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentPrompt.correctSuffix;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`min-h-[64px] px-5 py-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer border-2 text-left shadow-sm ${
                    isSelected && isCorrect
                      ? 'bg-[#b8ede3] border-[#35675f] text-[#00201c] scale-[1.01]'
                      : isSelected && !isCorrect
                      ? 'bg-[#ffdad6]/40 border-[#ba1a1a] text-[#181c20]'
                      : 'bg-white hover:bg-[#f1f4f9] border-[#eae4dc] text-[#181c20]'
                  }`}
                >
                  <span className="text-[20px] font-bold tracking-wide">
                    {opt}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected && isCorrect
                        ? 'bg-[#35675f] text-white'
                        : 'bg-[#e5e8ee] text-[#42474d]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isSelected && isCorrect ? 'check' : 'arrow_forward'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Gentle feedback banner */}
          {feedback && (
            <div className="p-3.5 bg-[#b8ede3] text-[#00201c] rounded-2xl font-bold text-[16px] flex items-center gap-2 border border-[#35675f]/30">
              <span className="material-symbols-outlined text-[22px] text-[#35675f]">
                favorite
              </span>
              <span>{feedback}</span>
            </div>
          )}

          {/* Audio read aloud helper */}
          <button
            type="button"
            onClick={handleHearSaying}
            className="w-full py-3.5 px-4 bg-white hover:bg-[#f1f4f9] border border-[#eae4dc] rounded-2xl flex items-center justify-center gap-2 text-[#0c405e] font-bold text-[16px] cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[22px]">volume_up</span>
            <span>Hear saying aloud</span>
          </button>
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
            Heartwarming, Ravi!
          </h1>
          <p className="text-[18px] text-[#42474d] mt-1.5 leading-relaxed">
            You completed all the familiar sayings with wonderful reminiscence.
          </p>

          <section className="mt-5 rounded-2xl bg-[#b8ede3] text-[#00201c] p-5 shadow-sm border border-[#35675f]/20 text-left">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#35675f] text-[26px]">
                psychology
              </span>
              <div>
                <p className="font-bold text-[18px]">Linguistic Reminiscence</p>
                <p className="text-[16px] text-[#00201c]/90 mt-0.5">
                  Recalling cherished proverbs connects deep long-term memories and fosters a peaceful sense of grounding.
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
              <span>PLAY WITH NEW SAYINGS</span>
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
