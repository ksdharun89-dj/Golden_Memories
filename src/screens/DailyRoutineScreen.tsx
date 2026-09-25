import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../utils/audio';

interface DailyRoutineScreenProps {
  onFinishExercise: () => void;
  onDoneForToday: () => void;
  onOneMoreActivity: () => void;
}

interface RoutineItem {
  id: number;
  routine: string;
  detail: string;
  emoji: string;
  correctTime: string;
  options: string[];
}

const ROUTINES_POOL = [
  {
    routine: 'Morning Tea & Fresh Breakfast',
    detail: 'A calm, nourishing start as sunlight enters the kitchen.',
    emoji: '🍵',
    correctTime: '8:00 AM',
    distractors: ['1:00 PM', '10:00 PM', '3:00 AM'],
  },
  {
    routine: 'Watering Garden Blooms & Herbs',
    detail: 'Tending to marigolds and fresh mint in the cool morning shade.',
    emoji: '🪴',
    correctTime: '10:00 AM',
    distractors: ['2:00 AM', '11:30 PM', '6:00 PM'],
  },
  {
    routine: 'Nourishing Midday Warm Lunch',
    detail: 'Enjoying comforting soup and fresh fruit with family.',
    emoji: '🍲',
    correctTime: '12:30 PM',
    distractors: ['7:00 AM', '11:00 PM', '4:00 AM'],
  },
  {
    routine: 'Afternoon Garden Stroll',
    detail: 'Walking among blooming flowers in gentle afternoon breeze.',
    emoji: '🚶‍♂️',
    correctTime: '2:30 PM',
    distractors: ['6:00 AM', '11:00 PM', '3:00 AM'],
  },
  {
    routine: 'Relaxing Evening Family Story',
    detail: 'Resting on the comfortable sofa with warm lighting and soft tea.',
    emoji: '🛋️',
    correctTime: '7:00 PM',
    distractors: ['12:00 PM', '3:00 AM', '9:00 AM'],
  },
  {
    routine: 'Restful Sleep & Peaceful Bedtime',
    detail: 'Tucking under a soft blanket with serene nighttime quiet.',
    emoji: '🌙',
    correctTime: '9:30 PM',
    distractors: ['1:00 PM', '7:00 AM', '11:00 AM'],
  },
];

const generateRoutineQuestions = (count = 3): RoutineItem[] => {
  const pool = [...ROUTINES_POOL].sort(() => Math.random() - 0.5);
  const selected = pool.slice(0, count);

  return selected.map((r, idx) => {
    const shuffledDistractors = [...r.distractors].sort(() => Math.random() - 0.5);
    const chosenDistractors = shuffledDistractors.slice(0, 2);

    // Shuffle options so correct time is randomly placed!
    const allOptions = [r.correctTime, ...chosenDistractors].sort(() => Math.random() - 0.5);

    return {
      id: idx + 1,
      routine: r.routine,
      detail: r.detail,
      emoji: r.emoji,
      correctTime: r.correctTime,
      options: allOptions,
    };
  });
};

export const DailyRoutineScreen: React.FC<DailyRoutineScreenProps> = ({
  onFinishExercise,
  onDoneForToday,
  onOneMoreActivity,
}) => {
  const [routines, setRoutines] = useState<RoutineItem[]>(() => generateRoutineQuestions(3));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const hasFinishedRef = useRef(false);

  const currentRoutine = routines[currentIndex];

  const handlePlayAgain = () => {
    soundService.playGentleChime();
    setRoutines(generateRoutineQuestions(3));
    setCurrentIndex(0);
    setSelectedTime(null);
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

  const handleSelectTime = (time: string) => {
    soundService.playSoftTap();
    setSelectedTime(time);

    if (time === currentRoutine.correctTime) {
      soundService.playClockChime();
      setFeedback(`Yes! ${time} is a comforting time for ${currentRoutine.routine.toLowerCase()}.`);

      setTimeout(() => {
        if (currentIndex < routines.length - 1) {
          setCurrentIndex((i) => i + 1);
          setSelectedTime(null);
          setFeedback(null);
        } else {
          setIsCompleted(true);
        }
      }, 1400);
    } else {
      setFeedback('Take a gentle look at the time of day: morning, afternoon, or evening?');
    }
  };

  const handleHearPrompt = () => {
    soundService.speakText(
      `When do we usually enjoy ${currentRoutine.routine}? Choose the clock time below.`
    );
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto pb-28 pt-24 px-4 sm:px-6">
      {!isCompleted ? (
        <div className="flex flex-col w-full space-y-5 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between py-1">
            <span className="text-[16px] font-semibold text-[#42474d]">
              Routine {currentIndex + 1} of {routines.length}
            </span>
            <span className="text-[15px] text-[#35675f] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              <span>Daily Rhythm</span>
            </span>
          </div>

          {/* Routine Presentation Card */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#eae4dc] text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#f1f4f9] flex items-center justify-center text-[48px] shadow-inner mb-2 select-none">
              {currentRoutine.emoji}
            </div>
            <h1 className="text-[26px] font-bold text-[#181c20] tracking-tight">
              {currentRoutine.routine}
            </h1>
            <p className="text-[16px] text-[#42474d] mt-1 leading-relaxed">
              {currentRoutine.detail}
            </p>

            <button
              type="button"
              onClick={handleHearPrompt}
              className="mt-3 px-3.5 py-1.5 rounded-full bg-[#ebeef3] hover:bg-[#e0e3e8] text-[#0c405e] font-bold text-[14px] flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">volume_up</span>
              <span>Hear prompt</span>
            </button>
          </section>

          {/* Feedback */}
          {feedback && (
            <div className="p-3.5 bg-[#b8ede3] text-[#00201c] rounded-2xl font-bold text-[16px] flex items-center gap-2 border border-[#35675f]/30">
              <span className="material-symbols-outlined text-[22px] text-[#35675f]">
                favorite
              </span>
              <span>{feedback}</span>
            </div>
          )}

          {/* 3 Clock Time Options */}
          <div className="flex flex-col space-y-3">
            {currentRoutine.options.map((time, idx) => {
              const isSelected = selectedTime === time;
              const isCorrect = time === currentRoutine.correctTime;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectTime(time)}
                  className={`min-h-[72px] px-6 py-4 rounded-2xl flex items-center justify-between border-2 transition-all cursor-pointer shadow-sm ${
                    isSelected && isCorrect
                      ? 'bg-[#b8ede3] border-[#35675f] text-[#00201c] scale-[1.01]'
                      : isSelected && !isCorrect
                      ? 'bg-[#ffdad6]/40 border-[#ba1a1a] text-[#181c20]'
                      : 'bg-white hover:bg-[#f1f4f9] border-[#eae4dc] text-[#181c20]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[32px] text-[#0c405e]">
                      schedule
                    </span>
                    <span className="text-[22px] font-bold font-mono tracking-tight">
                      {time}
                    </span>
                  </div>
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
            Peaceful Rhythm, Ravi!
          </h1>
          <p className="text-[18px] text-[#42474d] mt-1.5 leading-relaxed">
            You matched all the comfortable daily habits with their gentle times of day.
          </p>

          <section className="mt-5 rounded-2xl bg-[#b8ede3] text-[#00201c] p-5 shadow-sm border border-[#35675f]/20 text-left">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#35675f] text-[26px]">
                wb_sunny
              </span>
              <div>
                <p className="font-bold text-[18px]">Circadian Grounding</p>
                <p className="text-[16px] text-[#00201c]/90 mt-0.5">
                  Predictable, loving daily rhythms provide reassurance, stability, and peaceful sleep.
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
              <span>PLAY WITH NEW ROUTINES</span>
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
