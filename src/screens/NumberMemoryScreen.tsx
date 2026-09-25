import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../utils/audio';

interface NumberMemoryScreenProps {
  onFinishExercise: () => void;
  onDoneForToday: () => void;
  onOneMoreActivity: () => void;
}

const generateRandomNumbers = (count = 3): number[] => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits.slice(0, count);
};

export const NumberMemoryScreen: React.FC<NumberMemoryScreenProps> = ({
  onFinishExercise,
  onDoneForToday,
  onOneMoreActivity,
}) => {
  const [targetNumbers, setTargetNumbers] = useState<number[]>(() => generateRandomNumbers(3));
  const [round, setRound] = useState(1);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Memorize, 2: Recall, 3: Completed
  const [userTaps, setUserTaps] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const hasFinishedRef = useRef(false);

  const handlePlayAgainWithNewNumbers = () => {
    soundService.playGentleChime();
    setTargetNumbers(generateRandomNumbers(3));
    setUserTaps([]);
    setFeedback(null);
    hasFinishedRef.current = false;
    setRound((r) => r + 1);
    setStep(1);
  };

  useEffect(() => {
    if (step === 3 && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      soundService.playCelebrationSound();
      onFinishExercise();
    }
  }, [step, onFinishExercise]);

  const handleAdvanceToRecall = () => {
    soundService.playGentleChime();
    setStep(2);
  };

  const handleDigitTap = (num: number) => {
    soundService.playSoftTap();
    const newTaps = [...userTaps, num];
    setUserTaps(newTaps);

    if (newTaps.length === targetNumbers.length) {
      // Check correctness
      const isCorrect = newTaps.every((val, i) => val === targetNumbers[i]);
      if (isCorrect) {
        soundService.playCelebrationSound();
        setStep(3);
      } else {
        setFeedback("Almost! Let's try recalling those numbers gently again.");
        setTimeout(() => {
          setUserTaps([]);
          setFeedback(null);
        }, 1500);
      }
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto pb-28 pt-24 px-4 sm:px-6">
      {step === 1 && (
        <div className="flex flex-col w-full space-y-5">
          <div className="flex items-center justify-between py-1">
            <span className="text-[16px] font-semibold text-[#42474d]">
              Step 1 of 2: Observation {round > 1 ? `• Round ${round}` : ''}
            </span>
            <span className="text-[15px] text-[#35675f] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">nature_people</span>
              <span>Paced for Comfort</span>
            </span>
          </div>

          <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#eae4dc]">
            <h1 className="text-[26px] font-bold text-[#181c20] tracking-tight mb-1">
              Number Memory
            </h1>
            <p className="text-[20px] font-bold text-[#0c405e] mb-1">
              Remember these friendly numbers
            </p>
            <p className="text-[18px] text-[#42474d] leading-relaxed">
              Take a quiet moment to look at the three numbers below.
            </p>
          </section>

          {/* 3 Friendly Number Tiles */}
          <div className="grid grid-cols-3 gap-3">
            {targetNumbers.map((num, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center border-2 border-[#eae4dc] shadow-sm text-center"
              >
                <span className="text-6xl font-bold text-[#0c405e] select-none font-mono">
                  {num}
                </span>
                <span className="text-[14px] text-[#42474d] mt-2 font-medium">
                  {i === 0 ? 'First' : i === 1 ? 'Second' : 'Third'}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAdvanceToRecall}
            className="w-full min-h-[64px] bg-[#2b5777] hover:bg-[#0c405e] text-white rounded-2xl font-bold text-[22px] flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] transition-all cursor-pointer mt-2"
          >
            <span>I REMEMBER THESE</span>
            <span className="material-symbols-outlined text-[28px]">arrow_forward</span>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col w-full space-y-5 animate-fade-in">
          <div className="flex items-center justify-between py-1">
            <span className="text-[16px] font-semibold text-[#42474d]">
              Step 2 of 2: Gentle Recall
            </span>
            <span className="text-[15px] text-[#35675f] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>No rush</span>
            </span>
          </div>

          <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#eae4dc]">
            <h1 className="text-[26px] font-bold text-[#181c20] tracking-tight mb-1">
              Tap the 3 numbers in order
            </h1>
            <p className="text-[18px] text-[#42474d] leading-relaxed">
              Tap the digits from left to right as you remember them.
            </p>
          </section>

          {/* Current Taps Display */}
          <div className="bg-[#f1f4f9] rounded-2xl p-4 flex items-center justify-center gap-4">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="w-14 h-16 rounded-xl bg-white border border-[#eae4dc] flex items-center justify-center text-3xl font-bold text-[#0c405e] shadow-sm font-mono"
              >
                {userTaps[idx] !== undefined ? userTaps[idx] : '·'}
              </div>
            ))}
          </div>

          {feedback && (
            <div className="p-3 bg-[#ffdcc1] text-[#5d3100] rounded-xl text-center font-bold">
              {feedback}
            </div>
          )}

          {/* Numeric keypad / choices */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigitTap(digit)}
                className="h-16 rounded-2xl bg-white hover:bg-[#b8ede3]/40 active:bg-[#b8ede3] border border-[#eae4dc] text-3xl font-bold text-[#181c20] flex items-center justify-center shadow-sm cursor-pointer"
              >
                {digit}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setUserTaps([]);
              setStep(1);
            }}
            className="w-full py-2.5 text-[#42474d] hover:text-[#181c20] text-[16px] font-bold underline flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Take another calm look at Step 1</span>
          </button>
        </div>
      )}

      {step === 3 && (
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
            Wonderful, Ravi!
          </h1>
          <p className="text-[18px] text-[#42474d] mt-1.5 leading-relaxed">
            You remembered the sequence of numbers with flying colors.
          </p>

          <section className="mt-5 rounded-2xl bg-[#b8ede3] text-[#00201c] p-5 shadow-sm border border-[#35675f]/20 text-left">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#35675f] text-[26px]">
                psychology
              </span>
              <div>
                <p className="font-bold text-[18px]">Steady Attention</p>
                <p className="text-[16px] text-[#00201c]/90 mt-0.5">
                  Remembering numbers in sequence gently exercises working memory and mental focus.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-6 flex flex-col gap-3 text-left">
            <button
              type="button"
              onClick={handlePlayAgainWithNewNumbers}
              className="w-full min-h-[60px] rounded-2xl bg-[#b8ede3] text-[#00201c] font-bold text-[19px] flex items-center justify-center gap-2 hover:bg-[#a0e4d7] active:scale-[0.99] transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[24px]">replay</span>
              <span>PLAY WITH NEW NUMBERS</span>
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
