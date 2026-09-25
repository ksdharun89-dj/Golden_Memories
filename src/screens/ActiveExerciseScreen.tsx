import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../utils/audio';

interface ActiveExerciseScreenProps {
  onFinishExercise: () => void;
  onDoneForToday: () => void;
  onOneMoreActivity: () => void;
}

interface RecallItem {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  isCorrect: boolean;
}

export const ActiveExerciseScreen: React.FC<ActiveExerciseScreenProps> = ({
  onFinishExercise,
  onDoneForToday,
  onOneMoreActivity,
}) => {
  // Step 1: Observation, Step 2: Gentle Recall, Step 3: Celebration (Well Done!)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [timerActive, setTimerActive] = useState(true);
  const [isSpeakingGuide, setIsSpeakingGuide] = useState(false);
  const [isSpeakingCongrats, setIsSpeakingCongrats] = useState(false);

  // Recall items pool
  const RECALL_ITEMS_POOL: Omit<RecallItem, 'isCorrect'>[] = [
    { id: 'apple', name: 'Apple', subtitle: 'Fresh & sweet', emoji: '🍎' },
    { id: 'key', name: 'Key', subtitle: 'House key', emoji: '🗝️' },
    { id: 'book', name: 'Book', subtitle: 'For reading', emoji: '📖' },
    { id: 'cup', name: 'Cup', subtitle: 'Warm tea', emoji: '☕' },
    { id: 'flower', name: 'Flower', subtitle: 'Garden rose', emoji: '🌸' },
    { id: 'clock', name: 'Clock', subtitle: 'Mantel clock', emoji: '🕰️' },
    { id: 'glasses', name: 'Glasses', subtitle: 'Reading glasses', emoji: '👓' },
    { id: 'bell', name: 'Bell', subtitle: 'Golden chime', emoji: '🔔' },
    { id: 'hat', name: 'Hat', subtitle: 'Straw sun hat', emoji: '👒' },
    { id: 'teapot', name: 'Teapot', subtitle: 'Warm brew', emoji: '🫖' },
    { id: 'pen', name: 'Pen', subtitle: 'Letter writing', emoji: '✒️' },
    { id: 'orange', name: 'Orange', subtitle: 'Sweet citrus', emoji: '🍊' },
  ];

  const generatePictureMemoryItems = (): RecallItem[] => {
    const shuffled = [...RECALL_ITEMS_POOL].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, 4).map((item) => ({ ...item, isCorrect: true }));
    const distractors = shuffled.slice(4, 6).map((item) => ({ ...item, isCorrect: false }));
    return [...targets, ...distractors].sort(() => Math.random() - 0.5);
  };

  const [allItems, setAllItems] = useState<RecallItem[]>(() => generatePictureMemoryItems());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [gentleRecallHint, setGentleRecallHint] = useState<string | null>(null);
  const hasFinishedRef = useRef(false);

  const handlePlayAgainWithNewItems = () => {
    soundService.playGentleChime();
    setAllItems(generatePictureMemoryItems());
    setSelectedIds([]);
    setGentleRecallHint(null);
    setSecondsRemaining(10);
    setTimerActive(true);
    hasFinishedRef.current = false;
    setStep(1);
  };

  // Timer countdown for Step 1
  useEffect(() => {
    if (step !== 1 || !timerActive) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timerActive]);

  // Trigger celebration effects on Step 3
  useEffect(() => {
    if (step === 3 && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      soundService.playCelebrationSound();
      onFinishExercise();
    }
  }, [step, onFinishExercise]);

  const handleHearGuide = () => {
    if (isSpeakingGuide) {
      soundService.stopSpeech();
      setIsSpeakingGuide(false);
      return;
    }

    const targetNames = allItems
      .filter((i) => i.isCorrect)
      .map((i) => i.name)
      .join(', ');

    const script = `Look at the ${targetNames}. Take all the time you need. When you feel ready, tap I Remember These to continue.`;

    soundService.speakText(script, {
      onStart: () => setIsSpeakingGuide(true),
      onEnd: () => setIsSpeakingGuide(false),
      onError: () => setIsSpeakingGuide(false),
    });
  };

  const handleHearCongrats = () => {
    if (isSpeakingCongrats) {
      soundService.stopSpeech();
      setIsSpeakingCongrats(false);
      return;
    }

    const script =
      "Well done, Ravi! You completed today's Picture Memory activity. Great focus today! Doing short daily activities helps keep your mind active and refreshed. You have completed your recommended activities for today.";

    soundService.speakText(script, {
      onStart: () => setIsSpeakingCongrats(true),
      onEnd: () => setIsSpeakingCongrats(false),
      onError: () => setIsSpeakingCongrats(false),
    });
  };

  const handleAdvanceToRecall = () => {
    soundService.playGentleChime();
    setStep(2);
  };

  const handleToggleCardSelection = (item: RecallItem) => {
    soundService.playSoftTap();
    if (selectedIds.includes(item.id)) {
      setSelectedIds((prev) => prev.filter((id) => id !== item.id));
      setGentleRecallHint(null);
    } else {
      setSelectedIds((prev) => [...prev, item.id]);
      if (item.isCorrect) {
        soundService.playGentleChime();
        setGentleRecallHint(`Yes, you remembered the ${item.name}! 🌸`);
      } else {
        setGentleRecallHint(
          `That ${item.name} is lovely, too! Look closely for the items from earlier.`
        );
      }
    }
  };

  const handleCompleteRecall = () => {
    soundService.playCelebrationSound();
    setStep(3);
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto pb-28 pt-24 px-4 sm:px-6">
      {/* ================= STEP 1: OBSERVATION ================= */}
      {step === 1 && (
        <div className="flex flex-col w-full space-y-4">
          {/* Progress / Step Indicator */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#b8ede3] text-[#00201c] font-bold text-[16px]">
                1
              </span>
              <span className="text-[16px] font-semibold text-[#42474d]">
                Step 1 of 2: Observation
              </span>
            </div>
            <span className="text-[15px] text-[#35675f] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">
                nature_people
              </span>
              <span>Paced for Comfort</span>
            </span>
          </div>

          {/* Instruction Block */}
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#eae4dc]">
            <h1 className="text-[26px] font-bold text-[#181c20] tracking-tight mb-1">
              Picture Memory
            </h1>
            <p className="text-[22px] font-bold text-[#0c405e] mb-1">
              Remember these objects
            </p>
            <p className="text-[18px] text-[#42474d] leading-relaxed">
              Take a calm look at the 4 pictures below. There is no rush at all.
            </p>
          </section>

          {/* 2x2 Picture Memory Grid */}
          <section
            aria-label="Objects to remember"
            className="grid grid-cols-2 gap-4"
          >
            {/* Item 1: Apple */}
            <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm border border-[#eae4dc] transition-transform active:scale-[0.98]">
              <div
                role="img"
                aria-label="Red crisp apple"
                className="w-20 h-20 rounded-full bg-[#f1f4f9] flex items-center justify-center mb-2 text-[52px] select-none shadow-inner"
              >
                🍎
              </div>
              <span className="text-[20px] font-bold text-[#181c20] tracking-wide">
                Apple
              </span>
              <span className="text-[15px] font-medium text-[#42474d] mt-0.5">
                Fresh &amp; sweet
              </span>
            </div>

            {/* Item 2: Key */}
            <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm border border-[#eae4dc] transition-transform active:scale-[0.98]">
              <div
                role="img"
                aria-label="Brass key"
                className="w-20 h-20 rounded-full bg-[#f1f4f9] flex items-center justify-center mb-2 text-[52px] select-none shadow-inner"
              >
                🗝️
              </div>
              <span className="text-[20px] font-bold text-[#181c20] tracking-wide">
                Key
              </span>
              <span className="text-[15px] font-medium text-[#42474d] mt-0.5">
                House key
              </span>
            </div>

            {/* Item 3: Book */}
            <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm border border-[#eae4dc] transition-transform active:scale-[0.98]">
              <div
                role="img"
                aria-label="Open storybook"
                className="w-20 h-20 rounded-full bg-[#f1f4f9] flex items-center justify-center mb-2 text-[52px] select-none shadow-inner"
              >
                📖
              </div>
              <span className="text-[20px] font-bold text-[#181c20] tracking-wide">
                Book
              </span>
              <span className="text-[15px] font-medium text-[#42474d] mt-0.5">
                For reading
              </span>
            </div>

            {/* Item 4: Cup */}
            <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm border border-[#eae4dc] transition-transform active:scale-[0.98]">
              <div
                role="img"
                aria-label="Warm ceramic cup with tea"
                className="w-20 h-20 rounded-full bg-[#f1f4f9] flex items-center justify-center mb-2 text-[52px] select-none shadow-inner"
              >
                ☕
              </div>
              <span className="text-[20px] font-bold text-[#181c20] tracking-wide">
                Cup
              </span>
              <span className="text-[15px] font-medium text-[#42474d] mt-0.5">
                Warm tea
              </span>
            </div>
          </section>

          {/* Paced Timer Indicator (Calm, Non-urgent) */}
          <div className="flex items-center justify-center gap-2 bg-[#b8ede3]/40 border border-[#b8ede3] text-[#00201c] px-4 py-2 rounded-full mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[22px] text-[#35675f]">
              hourglass_top
            </span>
            <span className="text-[16px] font-bold">
              {secondsRemaining > 0
                ? `Take your time • ${secondsRemaining} seconds remaining`
                : 'Ready whenever you are • No rush'}
            </span>
            <button
              type="button"
              onClick={() => setTimerActive(!timerActive)}
              className="ml-1 text-[13px] underline text-[#35675f] font-semibold cursor-pointer"
            >
              {timerActive ? 'Pause timer' : 'Resume'}
            </button>
          </div>

          {/* Primary Advance Action */}
          <div className="flex flex-col pt-1">
            <button
              type="button"
              id="btn-continue"
              onClick={handleAdvanceToRecall}
              className="w-full min-h-[64px] bg-[#2b5777] hover:bg-[#0c405e] text-white rounded-2xl font-bold text-[22px] flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>I REMEMBER THESE</span>
              <span className="material-symbols-outlined text-[28px]">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Audio Prompt Card & Reassurance Support */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eae4dc] flex flex-col gap-3">
            <button
              type="button"
              aria-label="Listen to voice guide"
              onClick={handleHearGuide}
              className={`w-full flex items-start gap-3 text-left p-2 rounded-xl transition-colors cursor-pointer border ${
                isSpeakingGuide
                  ? 'bg-[#b8ede3] border-[#35675f]'
                  : 'hover:bg-[#f1f4f9] border-transparent'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#e5e8ee] flex items-center justify-center shrink-0 text-[#0c405e]">
                <span className="material-symbols-outlined text-[26px]">
                  {isSpeakingGuide ? 'pause' : 'record_voice_over'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[17px] font-bold text-[#0c405e] flex items-center gap-1.5">
                  Tap to listen
                  <span className="material-symbols-outlined text-[18px]">
                    volume_up
                  </span>
                </span>
                <span className="text-[16px] text-[#42474d] mt-0.5 leading-snug">
                  “Look at the apple, key, book, and cup. When you feel ready, tap Continue.”
                </span>
              </div>
            </button>

            <div className="flex items-center gap-2 pt-1 border-t border-[#ebeef3] text-[#42474d]">
              <span className="material-symbols-outlined text-[22px] text-[#35675f]">
                spa
              </span>
              <span className="text-[15px] font-medium">
                You can take as long as you need. No rushing.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: GENTLE RECALL ================= */}
      {step === 2 && (
        <div className="flex flex-col w-full space-y-4 animate-fade-in">
          {/* Progress / Step Indicator */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#b8ede3] text-[#00201c] font-bold text-[16px]">
                2
              </span>
              <span className="text-[16px] font-semibold text-[#42474d]">
                Step 2 of 2: Gentle Recall
              </span>
            </div>
            <span className="text-[15px] text-[#35675f] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Take your time</span>
            </span>
          </div>

          {/* Instruction Block */}
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#eae4dc]">
            <h1 className="text-[26px] font-bold text-[#181c20] tracking-tight mb-1">
              Which objects do you recall?
            </h1>
            <p className="text-[18px] text-[#42474d] leading-relaxed">
              Tap the 4 pictures you saw in the previous step. Tap to select or unselect.
            </p>
          </section>

          {/* Items selection grid */}
          <section
            aria-label="Recall choices"
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {allItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleCardSelection(item)}
                  className={`min-h-[140px] rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer border-2 relative ${
                    isSelected
                      ? 'bg-[#b8ede3]/40 border-[#35675f] shadow-md scale-[1.02]'
                      : 'bg-white border-[#eae4dc] hover:border-[#b8ede3] shadow-sm'
                  }`}
                >
                  <div className="text-[48px] select-none mb-1">{item.emoji}</div>
                  <span className="text-[18px] font-bold text-[#181c20]">
                    {item.name}
                  </span>
                  <span className="text-[13px] text-[#42474d] mt-0.5">
                    {item.subtitle}
                  </span>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#35675f] text-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">
                        check
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </section>

          {/* Hint / Warm feedback message */}
          {gentleRecallHint && (
            <div className="p-3.5 rounded-xl bg-[#b8ede3] text-[#00201c] font-medium text-[16px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-[#35675f]">
                favorite
              </span>
              <span>{gentleRecallHint}</span>
            </div>
          )}

          {/* Recall Progress & Complete Button */}
          <div className="pt-2 flex flex-col space-y-3">
            <button
              type="button"
              onClick={handleCompleteRecall}
              className="w-full min-h-[64px] bg-[#0c405e] hover:bg-[#2b5777] text-white rounded-2xl font-bold text-[22px] flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>SEE RESULTS</span>
              <span className="material-symbols-outlined text-[28px]">
                arrow_forward
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2.5 text-[#42474d] hover:text-[#181c20] text-[16px] font-bold underline flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              <span>Take another calm look at Step 1</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: CELEBRATION (WELL DONE!) ================= */}
      {step === 3 && (
        <div className="flex flex-col w-full pb-6 max-w-[560px] mx-auto animate-fade-in">
          {/* Festive Warm Sun/Star Icon Badge */}
          <div className="relative w-full flex flex-col items-center pt-2 pb-2 text-center select-none overflow-hidden">
            <div className="relative w-28 h-28 rounded-full bg-[#ffdcc1] flex items-center justify-center shadow-lg transition-transform active:scale-95 duration-200">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ffb778]/40 to-transparent" />
              <span
                className="material-symbols-outlined text-[64px] text-[#5d3100]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                stars
              </span>
              <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-[#b8ede3] flex items-center justify-center shadow-sm">
                <span
                  className="material-symbols-outlined text-[20px] text-[#00201c]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
              </div>
            </div>

            {/* Festive Affirmation Stars Row */}
            <div className="flex items-center gap-2 mt-4 text-[#5d3100]">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>

            {/* Heartfelt Warm Headings */}
            <h1 className="text-[28px] sm:text-[34px] font-bold text-[#181c20] mt-3 tracking-tight">
              Well Done, Ravi!
            </h1>
            <p className="text-[18px] text-[#42474d] mt-1.5 px-2 leading-relaxed max-w-md">
              You completed today’s Picture Memory activity.
            </p>
          </div>

          {/* Encouragement Affirmation Card */}
          <section className="mt-4 rounded-2xl bg-[#b8ede3] text-[#00201c] p-5 shadow-sm border border-[#35675f]/20 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <span className="material-symbols-outlined text-[#35675f] text-[24px]">
                  psychology
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[18px] text-[#00201c] mb-1">
                  Wonderful focus today
                </p>
                <p className="text-[16px] text-[#00201c]/90 leading-relaxed">
                  Great focus today! Doing short daily activities helps keep your mind active and refreshed.
                </p>
              </div>
            </div>
          </section>

          {/* Photo Memory Anchor for Calm Continuity */}
          <section className="mt-4 rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-[#eae4dc]">
            <div className="flex items-center gap-4">
              <img
                className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-inner"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKe6ampXYTfUCePC-3FlIi0HgLFyKF8MOh0zGpteJy4ODp4sYMYvWPg_UsgWDtjTD8g_lAVzbRm0p7dY0kSWPdiLZBXXKlH7nhFUTIkhYYCNXcbR-m_EhycNLBM9J1_IzTx0V0AoeHeAihP_-4hinOB0PTskCAogHsj9BFz6qqXEUH_KjjarPBI4JOyONlyK4v-DmZ8sz-3b-5O52jkm4oGUoG6_G6kNx0E859fJybW2B6YUt-Z16F"
                alt="Sunlit garden bench surrounded by lavender blooms"
              />
              <div className="min-w-0 flex flex-col justify-center">
                <span className="text-[13px] font-bold text-[#42474d] uppercase tracking-wider">
                  MEMORY LOGGED
                </span>
                <p className="text-[20px] font-bold text-[#181c20] truncate mt-0.5">
                  Afternoon in the Garden
                </p>
                <span className="text-[16px] text-[#35675f] font-semibold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[18px]">
                    verified
                  </span>
                  <span>Pleasant moments shared</span>
                </span>
              </div>
            </div>
          </section>

          {/* Gentle Daily Journey Metric Card */}
          <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm border border-[#eae4dc] flex flex-col gap-3">
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffdcc1] flex items-center justify-center shadow-sm">
                  <span
                    className="material-symbols-outlined text-[#2e1500] text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_florist
                  </span>
                </div>
                <div>
                  <p className="text-[17px] font-bold text-[#181c20]">
                    Today’s Daily Rhythm
                  </p>
                  <p className="text-[15px] text-[#42474d]">3 days in a row</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#ebeef3] text-[14px] font-semibold text-[#42474d]">
                Gentle Routine 🌱
              </span>
            </div>

            {/* Soft Progress Visual Indicator */}
            <div className="mt-1 pt-2 bg-[#f1f4f9] rounded-xl p-3 border border-[#ebeef3]">
              <div className="flex items-center justify-between text-[#42474d] mb-2">
                <span className="text-[15px] font-medium">Activities Completed</span>
                <span className="text-[16px] font-bold text-[#0c405e]">
                  2 of 2 recommended
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#e0e3e8] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#2b5777] transition-all duration-700 ease-out"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </section>

          {/* Clear, Large Action Touch Targets */}
          <section className="mt-6 flex flex-col gap-3">
            {/* Play Again with New Objects */}
            <button
              type="button"
              onClick={handlePlayAgainWithNewItems}
              className="w-full min-h-[60px] rounded-2xl bg-[#b8ede3] text-[#00201c] font-bold text-[19px] flex items-center justify-center gap-2 hover:bg-[#a0e4d7] active:scale-[0.99] transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[24px]">
                replay
              </span>
              <span>PLAY WITH NEW OBJECTS</span>
            </button>

            {/* Primary CTA: One More Activity */}
            <button
              type="button"
              onClick={onOneMoreActivity}
              className="w-full min-h-[60px] rounded-2xl bg-[#2b5777] text-white font-bold text-[19px] flex items-center justify-center gap-2.5 shadow-md hover:bg-[#0c405e] active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>ONE MORE ACTIVITY</span>
              <span className="material-symbols-outlined text-[26px]">
                arrow_forward
              </span>
            </button>

            {/* Secondary CTA: Done for today */}
            <button
              type="button"
              onClick={onDoneForToday}
              className="w-full min-h-[56px] rounded-2xl bg-[#e5e8ee] text-[#181c20] font-bold text-[18px] flex items-center justify-center gap-2 hover:bg-[#e0e3e8] active:scale-[0.99] transition-all cursor-pointer border border-[#ebeef3]"
            >
              <span className="material-symbols-outlined text-[22px] text-[#42474d]">
                home
              </span>
              <span>I’M DONE FOR TODAY</span>
            </button>
          </section>

          {/* Voice Accessibility Helper Bar */}
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={handleHearCongrats}
              className={`min-h-[52px] px-5 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer border ${
                isSpeakingCongrats
                  ? 'bg-[#b8ede3] text-[#00201c] border-[#35675f]'
                  : 'bg-white hover:bg-[#f1f4f9] text-[#181c20] border-[#eae4dc]'
              }`}
            >
              <span className="material-symbols-outlined text-[#0c405e] text-[24px]">
                {isSpeakingCongrats ? 'graphic_eq' : 'volume_up'}
              </span>
              <span>
                {isSpeakingCongrats
                  ? 'Speaking softly...'
                  : 'Hear congratulations message'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
