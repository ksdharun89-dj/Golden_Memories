import React from 'react';
import { TabType, Language } from '../types';
import { soundService } from '../utils/audio';
import { translations } from '../utils/i18n';

interface BottomNavProps {
  currentTab: TabType;
  language: Language;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  language,
  onSelectTab,
}) => {
  const t = translations[language];

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: t.home, icon: 'home' },
    { id: 'activities', label: t.activities, icon: 'psychology' },
    { id: 'family', label: t.family, icon: 'group' },
  ];

  const handleTabClick = (tabId: TabType) => {
    soundService.playSoftTap();
    onSelectTab(tabId);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-[#f7f9ff]/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)] border-t border-[#ebeef3]"
      aria-label="Main Navigation"
    >
      <div className="flex justify-around items-center h-20 px-4 max-w-xl mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-h-[56px] min-w-[84px] px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#b8ede3] text-[#00201c] font-bold shadow-sm scale-105'
                  : 'text-[#42474d] hover:bg-[#ebeef3] active:bg-[#e0e3e8]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[28px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="text-[15px] sm:text-[17px] tracking-tight mt-0.5 font-bold">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
