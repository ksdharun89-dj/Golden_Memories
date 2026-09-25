import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../utils/audio';

interface ColorLanternsScreenProps {
  onFinishExercise: () => void;
  onDoneForToday: () => void;
  onOneMoreActivity: () => void;
}

interface Lantern {
  id: number;
  name: string;
  colorName: string;
  bgActive: string;
  bgNormal: string;
  borderActive: string;
  icon: string;
}

export const ColorLanternsScreen: React.FC<ColorLanternsScreenProps> = ({
  onFinishExercise,
  onDoneForToday,
  onOneMoreActivity,
}) => {
  const lanterns: Lantern[] = [
    {
      id: 0,
      name: 'Sky Blue',
      colorName: 'Blue',
      bgActive: 'bg-[#cbe6ff]',
      bgNormal: 'bg-white',
      borderActive: 'border-[#0c405e]',
      icon: 'water_drop',
    },
    {
      id: 1,
      name: 'Warm Amber',
      colorName: 'Amber',
      bgActive: 'bg-[#ffdcc1]',
      bgNormal: 'bg-white',
      borderActive: 'border-[#5d3100]',
      icon: 'lightbulb',
    },
    {
      id: 2,
      name: 'Gentle Sage',
      colorName: 'Sage',
      bgActive: 'bg-[#b8ede3]',
      bgNormal: 'bg-white',
      borderActive: 'border-[#35675f]',
      icon: 'spa',
    },
  ];

  // Sequence stages
  const generateLanternSequence = (length: number): number[] => {
    const seq: number[] = [];
    for (let i = 0; i < length; i++) {
      let next = Math.floor(Math.random() * 3);
      if (i > 0 && next === seq[i - 1]) {
        next = (next + 1) % 3;
      }
      seq.push(next);
    }
    return seq;
  };

  const [level, setLevel] = useState<1 | 2>(1);
  const [level1Seq, setLevel1Seq] = useState<number[]>(() => generateLanternSequence(2));
  const [level2Seq, setLevel2Seq] = useState<number[]>(() => generateLanternSequence(3));

  const targetSequence = level === 1 ? level1Seq : level2Seq;
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [instruction, setInstruction] = useState('Watch the soft light glow first.');
  const hasFinishedRef = useRef(false);

  const handlePlayAgain = () => {
    soundService.playGentleChime();
    setLevel1Seq(generateLanternSequence(2));
    setLevel2Seq(generateLanternSequence(3));
    setLevel(1);
    setUserSequence([]);
    hasFinishedRef.current = false;
    setIsCompleted(false);
  };

  // Play sequence demo
  const playSequenceDemo = (seq: number[]) => {
    setIsPlayingDemo(true);
    setUserSequence([]);
    setInstruction('Watch the peaceful glow...');

    seq.forEach((lanternIdx, stepIdx) => {
      setTimeout(() => {
        setActiveHighlight(lanternIdx);
        soundService.playGentleChime();
        setTimeout(() => {
          setActiveHighlight(null);
          if (stepIdx === seq.length - 1) {
            setIsPlayingDemo(false);
            setInstruction('Your turn! Tap the lanterns in the same order.');
          }
        }, 800);
      }, (stepIdx + 1) * 1100);
    });
  };

  useEffect(() => {
    // Start demo after mount
    const timer = setTimeout(() => {
      playSequenceDemo(targetSequence);
    }, 700);
    return () => clearTimeout(timer);
  }, [level]);

  useEffect(() => {
    if (isCompleted && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      soundService.playCelebrationSound();
      onFinishExercise();
    }
  }, [isCompleted, onFinishExercise]);

  const handleLanternTap = (idx: number) => {
    if (isPlayingDemo) return;
    soundService.playSoftTap();
    setActiveHighlight(idx);
    setTimeout(() => setActiveHighlight(null), 300);

    const updated = [...userSequence, idx];
    setUserSequence(updated);

    // Check if so far matches
    const expected = targetSequence[updated.length - 1];
    if (idx !== expected) {
      setInstruction('Almost! Let us watch the gentle rhythm once more.');
      setTimeout(() => {
        playSequenceDemo(targetSequence);
      }, 1200);
      return;
    }

    // If completed this sequence
    if (updated.length === targetSequence.length) {
      soundService.playGentleChime();
      if (level === 1) {
        setInstruction('Wonderful! Now let us try 3 gentle chimes.');
        setTimeout(() => {
          setLevel(2);
        }, 1400);
      } else {
        setIsCompleted(true);
      }
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto pb-28 pt-24 px-4 sm:px-6">
      {!isCompleted ? (
        <div className="flex flex-col w-full space-y-5 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between py-1">
            <span className="text-[16px] font-semibold text-[#42474d]">
              Level {level} of 2
            </span>
            <span className="text-[15px] text-[#35675f] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
              <span>Sensory Rhythm</span>
            </span>
          </div>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#eae4dc] text-center">
            <h1 className="text-[26px] font-bold text-[#181c20] tracking-tight mb-1">
              Lantern Harmony
            </h1>
            <p className="text-[18px] text-[#0c405e] font-semibold mt-1">
              {instruction}
            </p>
          </section>

          {/* 3 Lantern Cards */}
          <div className="grid grid-cols-3 gap-3">
            {lanterns.map((l) => {
              const isGlowing = activeHighlight === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  disabled={isPlayingDemo}
                  onClick={() => handleLanternTap(l.id)}
                  className={`min-h-[170px] rounded-3xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 border-2 shadow-sm cursor-pointer ${
                    isGlowing
                      ? `${l.bgActive} ${l.borderActive} ring-4 ring-[#b8ede3] scale-105 shadow-lg`
                      : `${l.bgNormal} border-[#eae4dc] hover:border-[#b8ede3]`
                  } ${isPlayingDemo ? 'cursor-default' : 'active:scale-95'}`}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors mb-2 ${
                      isGlowing ? 'bg-white text-[#0c405e] shadow-md' : 'bg-[#f1f4f9] text-[#42474d]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[32px]">
                      {l.icon}
                    </span>
                  </div>
                  <span className="text-[17px] font-bold text-[#181c20]">
                    {l.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Replay demo button */}
          <button
            type="button"
            disabled={isPlayingDemo}
            onClick={() => playSequenceDemo(targetSequence)}
            className="w-full py-3.5 px-4 bg-white hover:bg-[#f1f4f9] border border-[#eae4dc] rounded-2xl flex items-center justify-center gap-2 text-[#0c405e] font-bold text-[16px] cursor-pointer shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[22px]">replay</span>
            <span>Replay the glowing sequence</span>
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
            Harmonious Focus, Ravi!
          </h1>
          <p className="text-[18px] text-[#42474d] mt-1.5 leading-relaxed">
            You matched the melodic chimes and lantern glows with calm grace.
          </p>

          <section className="mt-5 rounded-2xl bg-[#b8ede3] text-[#00201c] p-5 shadow-sm border border-[#35675f]/20 text-left">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#35675f] text-[26px]">
                headphones
              </span>
              <div>
                <p className="font-bold text-[18px]">Calming Sensory Focus</p>
                <p className="text-[16px] text-[#00201c]/90 mt-0.5">
                  Rhythmic audio-visual sequences settle wandering thoughts and promote mindful concentration.
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
              <span>PLAY WITH NEW PATTERN</span>
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
