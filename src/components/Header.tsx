import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { soundService } from '../utils/audio';
import { translations } from '../utils/i18n';

interface HeaderProps {
  currentTab: 'home' | 'activities' | 'family';
  isInExercise?: boolean;
  exerciseTitle?: string;
  onBack?: () => void;
  easyView: boolean;
  onToggleEasyView: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  isInExercise,
  exerciseTitle = 'Active Exercise',
  onBack,
  easyView,
  onToggleEasyView,
  language,
  onToggleLanguage,
  onOpenSettings,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const t = translations[language];

  useEffect(() => {
    const checkSpeaking = setInterval(() => {
      setIsSpeaking(soundService.isSpeaking());
    }, 300);
    return () => clearInterval(checkSpeaking);
  }, []);

  const handleHearHeader = () => {
    if (soundService.isSpeaking()) {
      soundService.stopSpeech();
      setIsSpeaking(false);
      return;
    }

    let speechText = '';
    if (language === 'ta') {
      if (isInExercise) {
        speechText = `நீங்கள் இப்போது ${exerciseTitle} பயிற்சியில் உள்ளீர்கள். நிதானமாக நேரத்தை எடுத்துக் கொள்ளுங்கள்.`;
      } else if (currentTab === 'home') {
        speechText = `பொன்னான நினைவுகள் முகப்பு. காலை வணக்கம், ரவி. இது ஒரு அமைதியான, இனிய நாள். உங்கள் மனநிலையைப் பதிவிடலாம் அல்லது பரிந்துரைக்கப்பட்ட பயிற்சியைத் தொடங்கலாம்.`;
      } else if (currentTab === 'activities') {
        speechText = `பொன்னான நினைவுகள் பயிற்சிகள். இன்று நீங்கள் பல்வேறு எளிய பயிற்சிகளை தேர்வு செய்யலாம். அனைத்துப் பயிற்சிகளும் உங்கள் அமைதியான நலனுக்காக வடிவமைக்கப்பட்டவை.`;
      } else {
        speechText = `பொன்னான நினைவுகள் குடும்பப் பார்வை. குடும்ப பராமரிப்பாளர் பிரியா இணைந்துள்ளார். ரவியின் தினசரி செயல்பாடுகள் மற்றும் கடந்த ஏழு நாட்களின் முன்னேற்றத்தை இங்கே பார்க்கலாம்.`;
      }
    } else {
      if (isInExercise) {
        speechText = `You are doing ${exerciseTitle}. Remember to take all the time you need. There is no rush or time limit.`;
      } else if (currentTab === 'home') {
        speechText = `Welcome to Golden Memories Home. Good morning, Ravi. It is a calm, peaceful day. You can check in your mood or start your recommended picture memory activity.`;
      } else if (currentTab === 'activities') {
        speechText = `Golden Memories Activities. Today you can choose between gentle cognitive exercises paced for comfort and joy.`;
      } else {
        speechText = `Golden Memories Family View. Connected as family caregiver Priya. Reviewing Ravi's daily activities, 7-day progress, and sending warm photo notes.`;
      }
    }

    soundService.speakText(speechText, {
      lang: language,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const logoSrc =
    'https://lh3.googleusercontent.com/aida/AEtjO1U78I3A-zh2pJSv1fmICOZgICW7NzwJMYtyoPFtaTtIMDvjoL3-ZuqPuMfDFh_whqqxWMNhBpZFIe1OD59FLJriJGi19_XXBCkfJ47cUTH_VGZN7gRhaQ_gAPZcIfX8lB_jB-HZ8O9qzYkC9ngPSQ9yPOWlA-WimfVJRFTdXTwtEXsnCROI7Fy5ySB19F-mDDlPYi7dbqJYj_erV3DfL6pI46YtwsAYVgmDgUoM3FPhAN2DLT9aim1Faa0';

  const tabTitle =
    currentTab === 'home'
      ? t.home
      : currentTab === 'activities'
      ? t.activities
      : t.family;

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#f7f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#ebeef3]">
      <div className="h-20 px-3 sm:px-6 max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left Slot: Logo or Back + Title */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {isInExercise ? (
            <>
              <button
                type="button"
                aria-label={t.back}
                onClick={onBack}
                className="min-h-[48px] min-w-[48px] -ml-2 rounded-full flex items-center justify-center text-[#181c20] hover:bg-[#e5e8ee] active:bg-[#e0e3e8] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[28px]">arrow_back</span>
              </button>
              <img
                alt="Golden Memories Logo"
                className="h-8 w-auto object-contain shrink-0"
                src={logoSrc}
              />
              <span className="text-[20px] sm:text-[24px] font-bold text-[#181c20] tracking-tight truncate ml-1">
                {exerciseTitle}
              </span>
            </>
          ) : (
            <>
              <img
                alt="Golden Memories Logo"
                className="h-8 w-auto object-contain shrink-0"
                src={logoSrc}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[20px] sm:text-[24px] font-bold text-[#0c405e] tracking-tight truncate leading-tight">
                  {language === 'ta' ? 'பொன்னான நினைவுகள்' : 'Golden Memories'}
                </span>
                <span className="text-[13px] sm:text-[15px] font-semibold text-[#42474d] truncate -mt-0.5">
                  {tabTitle}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right Slot: Accessibility Actions, Language Toggle & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Regional Language Toggle Button */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="min-h-[42px] px-3 py-1 rounded-full flex items-center gap-1 bg-[#ebeef3] hover:bg-[#b8ede3]/50 active:bg-[#b8ede3] text-[#0c405e] font-bold text-[14px] sm:text-[15px] transition-colors cursor-pointer border border-[#c2c7ce]/60 shadow-xs"
            title={language === 'en' ? 'தமிழில் மாற்றுக' : 'Switch to English'}
          >
            <span className="material-symbols-outlined text-[18px] text-[#35675f]">
              translate
            </span>
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Easy View Toggle Button */}
          <button
            type="button"
            onClick={onToggleEasyView}
            className={`min-h-[42px] px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer border ${
              easyView
                ? 'bg-[#0c405e] text-white border-[#0c405e] shadow-sm'
                : 'bg-[#e5e8ee] hover:bg-[#e0e3e8] text-[#181c20] border-transparent'
            }`}
            title="Toggle Easy View (Larger text and enhanced contrast)"
          >
            <span
              className={`material-symbols-outlined text-[18px] sm:text-[20px] ${
                easyView ? 'text-white' : 'text-[#0c405e]'
              }`}
            >
              visibility
            </span>
            <span className="text-[14px] sm:text-[16px] font-semibold hidden xs:inline">
              {easyView ? t.easyViewOn : t.easyView}
            </span>
          </button>

          {/* Hear Audio Button */}
          <button
            type="button"
            aria-label="Hear page aloud"
            onClick={handleHearHeader}
            className={`min-h-[42px] min-w-[42px] px-2 rounded-full flex items-center justify-center gap-1 transition-colors cursor-pointer border ${
              isSpeaking
                ? 'bg-[#b8ede3] text-[#00201c] border-[#35675f] animate-pulse'
                : 'bg-[#e5e8ee] hover:bg-[#e0e3e8] text-[#181c20] border-transparent'
            }`}
            title={language === 'ta' ? 'இப்பக்கத்தைக் கேட்க' : 'Listen to screen overview'}
          >
            <span className="material-symbols-outlined text-[22px] sm:text-[24px] text-[#0c405e]">
              {isSpeaking ? 'pause' : 'volume_up'}
            </span>
            <span className="text-[15px] font-semibold hidden md:inline">
              {isSpeaking ? t.pause : t.hear}
            </span>
          </button>

          {/* Profile / Perspective Switcher */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0c405e] hover:bg-[#2b5777] active:scale-95 flex items-center justify-center shrink-0 text-white shadow-sm transition-all cursor-pointer"
            title="Profile & Settings"
            aria-label="Profile and Settings"
          >
            <span className="material-symbols-outlined text-[19px] sm:text-[20px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
