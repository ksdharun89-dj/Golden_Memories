import React, { useState } from 'react';
import { ActivityItem, Language } from '../types';
import { soundService } from '../utils/audio';
import { translations } from '../utils/i18n';

interface ActivitiesScreenProps {
  activities: ActivityItem[];
  language: Language;
  onStartActivity: (activityId: string) => void;
}

export const ActivitiesScreen: React.FC<ActivitiesScreenProps> = ({
  activities,
  language,
  onStartActivity,
}) => {
  const [speakingItem, setSpeakingItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = translations[language];

  const speakActivity = (id: string, text: string) => {
    if (speakingItem === id) {
      soundService.stopSpeech();
      setSpeakingItem(null);
      return;
    }

    soundService.speakText(text, {
      lang: language,
      onStart: () => setSpeakingItem(id),
      onEnd: () => setSpeakingItem(null),
      onError: () => setSpeakingItem(null),
    });
  };

  const handleHearAllChoices = () => {
    if (speakingItem === 'all') {
      soundService.stopSpeech();
      setSpeakingItem(null);
      return;
    }

    const script =
      language === 'ta'
        ? `இன்று நீங்கள் செய்யக்கூடிய ${activities.length} அமைதியான பயிற்சிகள் இங்கே உள்ளன. பட நினைவாற்றல், படங்களை இணைத்தல், பழமொழிகள், தினசரி பழக்கங்கள். தேவையான நேரத்தை நிதானமாக எடுத்துக் கொள்ளுங்கள்.`
        : `Today you have ${activities.length} comfortable activities available: ${activities
            .map((a) => a.title)
            .join(', ')}. Take all the time you need, there is no time limit or pressure.`;

    soundService.speakText(script, {
      lang: language,
      onStart: () => setSpeakingItem('all'),
      onEnd: () => setSpeakingItem(null),
      onError: () => setSpeakingItem(null),
    });
  };

  const completedCount = activities.filter((a) => a.completed).length;

  const categories = [
    { id: 'all', label: t.allActivities },
    { id: 'memory', label: t.catMemory },
    { id: 'words', label: t.catWords },
    { id: 'sensory', label: t.catSensory },
    { id: 'rhythm', label: t.catRhythm },
  ];

  const filteredActivities =
    selectedCategory === 'all'
      ? activities
      : activities.filter((a) => a.category === selectedCategory);

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto space-y-5 pb-28 pt-24 px-4 sm:px-6">
      {/* Title & Badge */}
      <div className="flex flex-col space-y-2 pt-1 pb-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#b8ede3] text-[#00201c] font-semibold text-[15px] shadow-sm">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              spa
            </span>
            <span>{t.gentleDailyFocus}</span>
          </div>

          <div className="px-3 py-1 rounded-full bg-[#f1f4f9] border border-[#ebeef3] text-[14px] font-bold text-[#0c405e]">
            {completedCount} of {activities.length} {t.completedOf}
          </div>
        </div>

        <h1 className="text-[28px] sm:text-[32px] font-bold text-[#181c20] tracking-tight">
          {t.todayActivities}
        </h1>
        <p className="text-[18px] text-[#42474d]">
          {activities.length} {t.activitiesSub}
        </p>
      </div>

      {/* Category Filter Tabs (Zero-pill discipline: segmented control buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              soundService.playSoftTap();
              setSelectedCategory(cat.id);
            }}
            className={`px-3.5 py-2 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#0c405e] text-white shadow-sm'
                : 'bg-[#f1f4f9] hover:bg-[#e5e8ee] text-[#42474d]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="flex flex-col space-y-4">
        {filteredActivities.map((act) => {
          const isCurrentSpeaking = speakingItem === act.id;
          const localized = t.activitiesList[act.id as keyof typeof t.activitiesList];
          const title = localized?.title || act.title;
          const description = localized?.description || act.description;
          const interactivity = localized?.interactivity || act.interactivity;

          return (
            <div
              key={act.id}
              className={`relative bg-white rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md overflow-hidden ${
                act.completed ? 'border-[#b8ede3]' : 'border-[#eae4dc]'
              }`}
            >
              <div className="flex flex-col space-y-3 relative z-10">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {act.badge ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b8ede3] text-[#00201c] font-bold text-[14px]">
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          auto_awesome
                        </span>
                        <span>
                          {language === 'ta' && act.id === 'picture-memory'
                            ? 'ரவிக்கு பரிந்துரை'
                            : act.badge}
                        </span>
                      </span>
                    ) : (
                      <span className="text-[14px] font-bold text-[#35675f] tracking-wide">
                        {interactivity}
                      </span>
                    )}

                    {act.completed && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f1f4f9] text-[#35675f] text-[13px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">
                          check_circle
                        </span>
                        <span>{t.doneToday}</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label={`Listen to ${title} details`}
                    onClick={() => speakActivity(act.id, `${title}: ${description}`)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                      isCurrentSpeaking
                        ? 'bg-[#b8ede3] text-[#00201c] border-[#35675f]'
                        : 'bg-[#e5e8ee] hover:bg-[#e0e3e8] text-[#0c405e] border-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {isCurrentSpeaking ? 'pause' : 'volume_up'}
                    </span>
                  </button>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                      act.category === 'memory'
                        ? 'bg-[#b8ede3]/60 text-[#35675f]'
                        : act.category === 'words'
                        ? 'bg-[#ffdcc1] text-[#5d3100]'
                        : act.category === 'sensory'
                        ? 'bg-[#cbe6ff] text-[#0c405e]'
                        : 'bg-[#e5e8ee] text-[#181c20]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[36px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {act.icon}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h2 className="text-[22px] font-bold text-[#181c20] leading-snug">
                      {title}
                    </h2>
                    <p className="text-[16px] text-[#42474d] mt-0.5 leading-snug">
                      {description}
                    </p>
                    <span className="text-[13px] text-[#42474d]/80 mt-1 font-medium">
                      ⏱️ {act.durationMinutes} min • {t.twoMinGentle.split('•')[1] || 'Gentle pace'}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onStartActivity(act.id)}
                    className={`w-full min-h-[56px] px-5 py-3 rounded-xl font-bold text-[20px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer ${
                      act.completed
                        ? 'bg-[#35675f] hover:bg-[#28524a] text-white'
                        : 'bg-[#2b5777] hover:bg-[#0c405e] text-white'
                    }`}
                  >
                    <span>{act.completed ? t.playAgain : t.start}</span>
                    <span className="material-symbols-outlined text-[26px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent Hear All Choices Button */}
      <div className="flex flex-col items-center text-center pt-2 space-y-3">
        <button
          type="button"
          onClick={handleHearAllChoices}
          className={`w-full max-w-[360px] min-h-[54px] px-5 py-3 rounded-full flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer font-bold text-[17px] border ${
            speakingItem === 'all'
              ? 'bg-[#b8ede3] text-[#00201c] border-[#35675f] animate-pulse'
              : 'bg-[#e5e8ee] hover:bg-[#e0e3e8] text-[#0c405e] border-transparent'
          }`}
        >
          <span
            className="material-symbols-outlined text-[26px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {speakingItem === 'all' ? 'pause_circle' : 'volume_up'}
          </span>
          <span>
            {speakingItem === 'all' ? t.pause : t.hearAllChoices}
          </span>
        </button>

        <div className="flex items-center justify-center gap-2 text-[#42474d]">
          <span className="material-symbols-outlined text-[20px] text-[#35675f]">
            favorite
          </span>
          <p className="text-[15px] font-medium">
            {t.takeYourTime}
          </p>
        </div>
      </div>
    </div>
  );
};
