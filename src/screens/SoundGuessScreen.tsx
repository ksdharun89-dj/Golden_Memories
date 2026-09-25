import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../utils/audio';

interface SoundGuessScreenProps {
  onFinishExercise: () => void;
  onDoneForToday: () => void;
  onOneMoreActivity: () => void;
}

interface SoundQuestion {
  id: number;
  title: string;
  correctAnswer: string;
  playSound: () => void;
  options: { name: string; emoji: string }[];
  hint: string;
}

const SOUND_QUESTIONS_POOL = [
  {
    title: 'A familiar morning song in the trees',
    correctAnswer: 'Garden Songbird',
    playSound: () => soundService.playBirdChirp(),
    correctEmoji: '🐦',
    distractors: [
      { name: 'Motor Car', emoji: '🚗' },
      { name: 'Brass Bell', emoji: '🔔' },
      { name: 'Rainstorm', emoji: '⛈️' },
    ],
    hint: 'Listen closely: it has high, cheerful chirps.',
  },
  {
    title: 'Getting ready for warm morning tea',
    correctAnswer: 'Whistling Kettle',
    playSound: () => soundService.playKettleWhistle(),
    correctEmoji: '🫖',
    distractors: [
      { name: 'Friendly Puppy', emoji: '🐕' },
      { name: 'Soft Violin', emoji: '🎻' },
      { name: 'Wind Chimes', emoji: '🎐' },
    ],
    hint: 'It sings steam right when water is boiling hot.',
  },
  {
    title: 'Gentle drops outside the window',
    correctAnswer: 'Spring Raindrops',
    playSound: () => soundService.playRaindrops(),
    correctEmoji: '🌧️',
    distractors: [
      { name: 'Wooden Drum', emoji: '🥁' },
      { name: 'Ticking Watch', emoji: '⌚' },
      { name: 'Bicycle Bell', emoji: '🚲' },
    ],
    hint: 'Soft pitter-patter falling upon the leaves.',
  },
  {
    title: 'A steady mantelpiece chiming the hour',
    correctAnswer: 'Grandfather Clock',
    playSound: () => soundService.playClockChime(),
    correctEmoji: '🕰️',
    distractors: [
      { name: 'Rooster Crow', emoji: '🐓' },
      { name: 'Door Knock', emoji: '🚪' },
      { name: 'Steam Kettle', emoji: '🫖' },
    ],
    hint: 'A comforting, steady resonant chime keeping track of time.',
  },
  {
    title: 'Soothing bells at the garden temple gate',
    correctAnswer: 'Gentle Wind Chime',
    playSound: () => soundService.playGentleChime(),
    correctEmoji: '🎐',
    distractors: [
      { name: 'Lawn Mower', emoji: '🚜' },
      { name: 'Ocean Waves', emoji: '🌊' },
      { name: 'Train Whistle', emoji: '🚂' },
    ],
    hint: 'Delicate, sweet crystalline chimes swaying in a breeze.',
  },
];

const generateSoundQuestions = (count = 3): SoundQuestion[] => {
  const pool = [...SOUND_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  const selected = pool.slice(0, count);

  return selected.map((q, idx) => {
    const shuffledDistractors = [...q.distractors].sort(() => Math.random() - 0.5);
    const chosenDistractors = shuffledDistractors.slice(0, 2);

    const allOptions = [
      { name: q.correctAnswer, emoji: q.correctEmoji },
      ...chosenDistractors,
    ].sort(() => Math.random() - 0.5); // Randomize option position!

    return {
      id: idx + 1,
      title: q.title,
      correctAnswer: q.correctAnswer,
      playSound: q.playSound,
      options: allOptions,
      hint: q.hint,
    };
  });
};

export const SoundGuessScreen: React.FC<SoundGuessScreenProps> = ({
  onFinishExercise,
  onDoneForToday,
  onOneMoreActivity,
}) => {
  const [questions, setQuestions] = useState<SoundQuestion[]>(() => generateSoundQuestions(3));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const hasFinishedRef = useRef(false);

  const currentQ = questions[currentIndex];

  const handlePlaySound = () => {
    setIsPlayingSound(true);
    currentQ.playSound();
    setTimeout(() => setIsPlayingSound(false), 1600);
  };

  const handlePlayAgain = () => {
    soundService.playGentleChime();
    setQuestions(generateSoundQuestions(3));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setFeedback(null);
    hasFinishedRef.current = false;
    setIsCompleted(false);
  };

  useEffect(() => {
    // Play sound automatically on question load
    const timer = setTimeout(() => {
      handlePlaySound();
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (isCompleted && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      soundService.playCelebrationSound();
      onFinishExercise();
    }
  }, [isCompleted, onFinishExercise]);

  const handleSelectAnswer = (name: string) => {
    soundService.playSoftTap();
    setSelectedAnswer(name);

    if (name === currentQ.correctAnswer) {
      soundService.playGentleChime();
      setFeedback(`Wonderful! You recognized the ${name}!`);

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((i) => i + 1);
          setSelectedAnswer(null);
          setFeedback(null);
        } else {
          setIsCompleted(true);
        }
      }, 1300);
    } else {
      setFeedback(`That is a lovely guess! Tap "Play sound again" to listen closely.`);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto pb-28 pt-24 px-4 sm:px-6">
      {!isCompleted ? (
        <div className="flex flex-col w-full space-y-5 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between py-1">
            <span className="text-[16px] font-semibold text-[#42474d]">
              Sound {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-[15px] text-[#35675f] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">hearing</span>
              <span>Auditory Recognition</span>
            </span>
          </div>

          {/* Sound listening card */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#eae4dc] text-center flex flex-col items-center">
            <span className="text-[14px] font-bold text-[#35675f] uppercase tracking-wider mb-2">
              Familiar Sounds
            </span>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#181c20] tracking-tight">
              {currentQ.title}
            </h1>
            <p className="text-[16px] text-[#42474d] mt-1">
              Listen to the comforting sound, then choose which picture matches.
            </p>

            {/* Play Sound Button */}
            <button
              type="button"
              onClick={handlePlaySound}
              className={`mt-4 px-6 py-3.5 rounded-2xl flex items-center gap-2.5 font-bold text-[18px] transition-all cursor-pointer shadow-md ${
                isPlayingSound
                  ? 'bg-[#b8ede3] text-[#00201c] scale-105 ring-4 ring-[#35675f]/20'
                  : 'bg-[#0c405e] hover:bg-[#2b5777] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[28px]">
                {isPlayingSound ? 'graphic_eq' : 'volume_up'}
              </span>
              <span>{isPlayingSound ? 'Playing sound...' : 'Play sound again'}</span>
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

          {/* 3 Choices */}
          <div className="flex flex-col space-y-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedAnswer === opt.name;
              const isCorrect = opt.name === currentQ.correctAnswer;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectAnswer(opt.name)}
                  className={`min-h-[72px] px-5 py-3 rounded-2xl flex items-center justify-between border-2 transition-all cursor-pointer shadow-sm ${
                    isSelected && isCorrect
                      ? 'bg-[#b8ede3] border-[#35675f] text-[#00201c] scale-[1.01]'
                      : isSelected && !isCorrect
                      ? 'bg-[#ffdad6]/40 border-[#ba1a1a] text-[#181c20]'
                      : 'bg-white hover:bg-[#f1f4f9] border-[#eae4dc] text-[#181c20]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl select-none">{opt.emoji}</span>
                    <span className="text-[20px] font-bold">{opt.name}</span>
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
            Sharp Hearing, Ravi!
          </h1>
          <p className="text-[18px] text-[#42474d] mt-1.5 leading-relaxed">
            You recognized all the familiar daily sounds with gentle ease.
          </p>

          <section className="mt-5 rounded-2xl bg-[#b8ede3] text-[#00201c] p-5 shadow-sm border border-[#35675f]/20 text-left">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#35675f] text-[26px]">
                hearing
              </span>
              <div>
                <p className="font-bold text-[18px]">Auditory Orientation</p>
                <p className="text-[16px] text-[#00201c]/90 mt-0.5">
                  Listening to everyday sounds connects our attention to the comforting surroundings of daily life.
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
              <span>PLAY WITH NEW SOUNDS</span>
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
