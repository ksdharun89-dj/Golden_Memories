import React, { useState } from 'react';
import { MoodType, ActivityItem, Language } from '../types';
import { soundService } from '../utils/audio';
import { translations } from '../utils/i18n';
import { Past7DaysLineChart } from '../components/Past7DaysLineChart';

interface FamilyScreenProps {
  mood: MoodType;
  activities: ActivityItem[];
  language: Language;
  onOpenSendPhotoNote: () => void;
  onOpenCall: () => void;
  onOpenVoiceCheer: () => void;
}

export const FamilyScreen: React.FC<FamilyScreenProps> = ({
  mood,
  activities,
  language,
  onOpenSendPhotoNote,
  onOpenCall,
  onOpenVoiceCheer,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const t = translations[language];

  const completedCount = activities.filter((a) => a.completed).length;

  const showToast = (msg: string) => {
    soundService.playGentleChime();
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getMoodLabel = () => {
    if (mood === 'good') return t.joyCheckin;
    if (mood === 'okay') return t.calmCheckin;
    return t.tiredCheckin;
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto space-y-5 pb-28 pt-24 px-4 sm:px-6">
      {/* Header Section */}
      <section className="flex flex-col gap-2 pt-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b8ede3] text-[#00201c] w-fit shadow-sm">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span className="text-[14px] font-bold">
            {t.connectedAs}
          </span>
        </div>
        <div className="mt-1">
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#181c20] tracking-tight">
            {t.familyView}
          </h1>
          <p className="text-[18px] text-[#42474d]">{t.raviActivity}</p>
        </div>
      </section>

      {/* Photo Banner of Connection */}
      <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-sm border border-[#eae4dc]">
        <img
          alt="Warm affectionate moment of Ravi and Priya"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrWZTLB0znBYOPxSMsMGF4_2Tww51_RgbPUrkg-yNXM_MymhRvHp5mtn5hDi3dtusicKpnAZURjMoCe9b08dT8Xg7gWiHBq91ODfTSfYAQ8YyTXi9kZEhTJ8_uyU8ljjiviplIh0ObZsKe4xQ8j0MLev9qERJYxG5Z5cEMCZwWG91vH4I-sWGau3tU2zVtYNQN4khUgFyK3RnHCPPiAinXTJJwO0H1EPGQyVTBi-8Dq__YFGrevmGU"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c405e]/85 via-[#0c405e]/30 to-transparent flex items-end p-4">
          <div className="flex items-center gap-2 text-white">
            <span
              className="material-symbols-outlined text-[22px] text-[#ffdcc1]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <span className="text-[16px] sm:text-[17px] font-bold leading-snug">
              {getMoodLabel()}
            </span>
          </div>
        </div>
      </div>

      {/* High-Level Summary Stats */}
      <section className="grid grid-cols-2 gap-3">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm border border-[#eae4dc]">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-[#42474d]">
              {t.activitiesToday}
            </span>
            <span className="material-symbols-outlined text-[24px] text-[#0c405e]">
              task_alt
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[36px] font-bold text-[#0c405e] leading-none tabular-nums font-mono">
              {completedCount}
            </div>
            <p className="text-[14px] text-[#42474d] mt-1 font-medium">
              {t.goalCompleted}
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm border border-[#eae4dc]">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-[#42474d]">
              {t.thisWeek}
            </span>
            <span className="material-symbols-outlined text-[24px] text-[#35675f]">
              calendar_today
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[36px] font-bold text-[#35675f] leading-none tabular-nums font-mono">
              14
            </div>
            <p className="text-[14px] text-[#42474d] mt-1 font-medium">
              {t.consistentDays}
            </p>
          </div>
        </div>
      </section>

      {/* AI Supportive Caregiver Note */}
      <section className="bg-[#f1f4f9] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm border border-[#ebeef3]">
        <div className="w-11 h-11 rounded-full bg-[#cbe6ff] flex items-center justify-center shrink-0 text-[#0c405e] shadow-sm">
          <span className="material-symbols-outlined text-[24px]">psychology</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[17px] font-bold text-[#0c405e]">
            {t.caregiverInsight}
          </span>
          <p className="text-[16px] text-[#42474d] mt-1 leading-relaxed">
            {t.caregiverInsightText}
          </p>
        </div>
      </section>

      {/* NEW: Simple Line Chart Visualizing Past 7 Days Progress with Live State Connection */}
      <Past7DaysLineChart
        todayCompletedCount={completedCount}
        language={language}
      />

      {/* Today's Activities Status List */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#eae4dc] space-y-3">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-[20px] font-bold text-[#181c20]">
            {t.todayActivitiesMonday}
          </h2>
          <span className="text-[15px] font-bold text-[#35675f]">
            {completedCount} of {activities.length} {t.done}
          </span>
        </div>

        <div className="space-y-2.5">
          {activities.map((act) => {
            const localized = t.activitiesList[act.id as keyof typeof t.activitiesList];
            const title = localized?.title || act.title;
            return (
              <div
                key={act.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  act.completed
                    ? 'bg-[#f1f4f9] border-[#ebeef3]'
                    : 'bg-[#ebeef3]/60 border-[#e0e3e8]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      act.completed
                        ? 'bg-[#b8ede3] text-[#00201c]'
                        : 'bg-[#e0e3e8] text-[#42474d]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {act.completed ? 'check' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[17px] font-bold text-[#181c20] truncate">
                      {title}
                    </span>
                    <span className="text-[14px] text-[#42474d]">
                      {act.completed
                        ? `${act.completedAt || '10:15 AM'} • ${act.durationMinutes} min`
                        : language === 'ta'
                        ? 'இன்னும் முடியவில்லை • மாலையில் செய்யலாம்'
                        : 'Not completed yet • Gentle evening prompt'}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[22px] text-[#42474d] shrink-0 ml-2">
                  {act.icon}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Family Actions */}
      <section className="space-y-3 pt-1 pb-4">
        {/* Primary Family Action Button */}
        <button
          type="button"
          onClick={onOpenSendPhotoNote}
          className="w-full min-h-[58px] px-6 py-3 bg-[#0c405e] hover:bg-[#2b5777] active:scale-[0.99] text-white rounded-2xl flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer font-bold text-[19px]"
        >
          <span className="material-symbols-outlined text-[26px]">
            add_photo_alternate
          </span>
          <span>{t.sendPhotoNote}</span>
        </button>

        {/* Dual Quick Contacts */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onOpenCall}
            className="min-h-[54px] px-4 py-2.5 bg-[#e5e8ee] hover:bg-[#e0e3e8] active:bg-[#d7dadf] text-[#181c20] rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-[17px] border border-[#eae4dc]"
          >
            <span className="material-symbols-outlined text-[22px] text-[#0c405e]">
              phone
            </span>
            <span>{t.callRavi}</span>
          </button>

          <button
            type="button"
            onClick={onOpenVoiceCheer}
            className="min-h-[54px] px-4 py-2.5 bg-[#e5e8ee] hover:bg-[#e0e3e8] active:bg-[#d7dadf] text-[#181c20] rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-[17px] border border-[#eae4dc]"
          >
            <span className="material-symbols-outlined text-[22px] text-[#5d3100]">
              mic
            </span>
            <span>{t.leaveVoiceCheer}</span>
          </button>
        </div>

        {/* Micro interaction confirmation toast */}
        {toastMessage && (
          <div className="p-3.5 bg-[#b8ede3] text-[#00201c] rounded-2xl flex items-center gap-2.5 shadow-md animate-fade-in border border-[#35675f]/30">
            <span className="material-symbols-outlined text-[22px] text-[#35675f]">
              check_circle
            </span>
            <span className="text-[15px] font-bold">{toastMessage}</span>
          </div>
        )}
      </section>
    </div>
  );
};
