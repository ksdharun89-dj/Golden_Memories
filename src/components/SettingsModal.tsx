import React from 'react';
import { TabType, Language } from '../types';
import { soundService } from '../utils/audio';
import { translations } from '../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  easyView: boolean;
  onToggleEasyView: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  onSwitchPerspective: (tab: TabType) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  easyView,
  onToggleEasyView,
  language,
  onSelectLanguage,
  onSwitchPerspective,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const handleTestAudio = () => {
    const text =
      language === 'ta'
        ? 'இது பொன்னான நினைவுகள் குரல் உதவியாளரின் மாதிரி ஒலி. நிதானமாகவும் தெளிவாகவும் வாசிக்கப்படுகிறது.'
        : 'This is a gentle sample of the Golden Memories companion voice. Paced comfortably for clarity and calm.';

    soundService.speakText(text, {
      lang: language,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#eae4dc] animate-fade-in flex flex-col space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#ebeef3]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#0c405e] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">person</span>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#181c20]">
                {t.settingsTitle}
              </h2>
              <p className="text-[14px] text-[#42474d]">{t.tabletSub}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#f1f4f9] hover:bg-[#e5e8ee] flex items-center justify-center text-[#181c20] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Regional Language Selection */}
        <div>
          <label className="block text-[15px] font-bold text-[#181c20] mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#35675f]">
              translate
            </span>
            <span>{t.languageSetting}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelectLanguage('en')}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                language === 'en'
                  ? 'bg-[#b8ede3] border-[#35675f] text-[#00201c] font-bold shadow-xs'
                  : 'bg-[#f1f4f9] hover:bg-[#ebeef3] border-[#ebeef3] text-[#181c20]'
              }`}
            >
              <span>English (US)</span>
              {language === 'en' && (
                <span className="material-symbols-outlined text-[18px] text-[#35675f]">
                  check
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelectLanguage('ta')}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                language === 'ta'
                  ? 'bg-[#b8ede3] border-[#35675f] text-[#00201c] font-bold shadow-xs'
                  : 'bg-[#f1f4f9] hover:bg-[#ebeef3] border-[#ebeef3] text-[#181c20]'
              }`}
            >
              <span>தமிழ் (Tamil)</span>
              {language === 'ta' && (
                <span className="material-symbols-outlined text-[18px] text-[#35675f]">
                  check
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Perspective Switcher */}
        <div>
          <label className="block text-[15px] font-bold text-[#181c20] mb-2">
            {t.switchPerspective}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onSwitchPerspective('home');
                onClose();
              }}
              className="p-3 rounded-2xl bg-[#f1f4f9] hover:bg-[#b8ede3]/40 border border-[#ebeef3] flex flex-col items-start cursor-pointer text-left"
            >
              <span className="text-[16px] font-bold text-[#0c405e]">{t.elderView}</span>
              <span className="text-[13px] text-[#42474d]">{t.elderViewSub}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSwitchPerspective('family');
                onClose();
              }}
              className="p-3 rounded-2xl bg-[#f1f4f9] hover:bg-[#b8ede3]/40 border border-[#ebeef3] flex flex-col items-start cursor-pointer text-left"
            >
              <span className="text-[16px] font-bold text-[#35675f]">{t.caregiverView}</span>
              <span className="text-[13px] text-[#42474d]">{t.caregiverViewSub}</span>
            </button>
          </div>
        </div>

        {/* Accessibility & Audio Controls */}
        <div className="space-y-3">
          <label className="block text-[15px] font-bold text-[#181c20]">
            {t.comfortAudio}
          </label>

          {/* Easy View */}
          <div className="flex items-center justify-between p-3.5 bg-[#f1f4f9] rounded-2xl border border-[#ebeef3]">
            <div>
              <span className="text-[16px] font-bold text-[#181c20] block">
                {t.easyView}
              </span>
              <span className="text-[13px] text-[#42474d]">
                {t.easyViewDesc}
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleEasyView}
              className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                easyView ? 'bg-[#0c405e]' : 'bg-[#c2c7ce]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform absolute top-1 ${
                  easyView ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Speech Test */}
          <button
            type="button"
            onClick={handleTestAudio}
            className="w-full py-3 px-4 rounded-2xl bg-[#e5e8ee] hover:bg-[#e0e3e8] text-[#0c405e] font-bold text-[15px] flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">volume_up</span>
              <span>{t.testSpeech}</span>
            </div>
            <span className="text-[13px] text-[#35675f] font-semibold">{t.playSample}</span>
          </button>
        </div>

        {/* About info */}
        <div className="pt-2 border-t border-[#ebeef3] text-center text-[#42474d] text-[13px]">
          <p className="font-semibold text-[#181c20]">{t.footerInfo}</p>
          <p className="mt-0.5">{t.footerSub}</p>
        </div>
      </div>
    </div>
  );
};
