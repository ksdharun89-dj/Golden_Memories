import React, { useState } from 'react';
import { MoodType, PhotoNote, Language } from '../types';
import { soundService } from '../utils/audio';
import { translations } from '../utils/i18n';

interface HomeScreenProps {
  mood: MoodType;
  language: Language;
  onSelectMood: (mood: MoodType) => void;
  onStartActivity: (activityId: string) => void;
  photoNotes: PhotoNote[];
  onOpenCall: (name: string, relation: string) => void;
  onOpenNoteDetail: (note: PhotoNote) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  mood,
  language,
  onSelectMood,
  onStartActivity,
  photoNotes,
  onOpenCall,
  onOpenNoteDetail,
}) => {
  const [isSpeakingGreeting, setIsSpeakingGreeting] = useState(false);
  const [moodToast, setMoodToast] = useState<string | null>(null);
  const t = translations[language];

  const getMoodRecommendation = (currentMood: MoodType) => {
    if (currentMood === 'good') {
      return {
        id: 'match-pictures',
        titleEn: 'Match the Pictures',
        titleTa: 'படங்களை இணைத்தல்',
        categoryEn: 'Card Pair Matching',
        categoryTa: 'அட்டை இணைக்கும் பயிற்சி',
        reasonEn: 'Since you are feeling good & energetic! A playful flower & fruit pair match.',
        reasonTa: 'இன்று நீங்கள் மகிழ்ச்சியாக உணர்வதால்! மலர்கள் மற்றும் பழங்களை இணைக்கும் உற்சாகமான பயிற்சி.',
        durationEn: '3 minutes • Playful match',
        durationTa: '3 நிமிடங்கள் • எளிய பயிற்சி',
        photoUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDrWZTLB0znBYOPxSMsMGF4_2Tww51_RgbPUrkg-yNXM_MymhRvHp5mtn5hDi3dtusicKpnAZURjMoCe9b08dT8Xg7gWiHBq91ODfTSfYAQ8YyTXi9kZEhTJ8_uyU8ljjiviplIh0ObZsKe4xQ8j0MLev9qERJYxG5Z5cEMCZwWG91vH4I-sWGau3tU2zVtYNQN4khUgFyK3RnHCPPiAinXTJJwO0H1EPGQyVTBi-8Dq__YFGrevmGU',
        photoAlt: 'Joyful family and flower blossoms',
      };
    }
    if (currentMood === 'tired') {
      return {
        id: 'sound-guess',
        titleEn: 'Familiar Sounds',
        titleTa: 'அமைதியான ஒலிகள்',
        categoryEn: 'Soothing Audio Recognition',
        categoryTa: 'அமைதியான ஒலி அறிதல்',
        reasonEn: 'Rest and take it very easy. Sit back and listen to comforting songs of birds & raindrops.',
        reasonTa: 'அமைதியாக இளைப்பாறி மகிழுங்கள். எவ்வித அவசரமும் இன்றி பறவைகள் மற்றும் மழைத்துளிகளின் இனிய ஒலிகளைக் கேட்கலாம்.',
        durationEn: '2 minutes • Very soothing',
        durationTa: '2 நிமிடங்கள் • அமைதியான கேட்கும் பயிற்சி',
        photoUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDKe6ampXYTfUCePC-3FlIi0HgLFyKF8MOh0zGpteJy4ODp4sYMYvWPg_UsgWDtjTD8g_lAVzbRm0p7dY0kSWPdiLZBXXKlH7nhFUTIkhYYCNXcbR-m_EhycNLBM9J1_IzTx0V0AoeHeAihP_-4hinOB0PTskCAogHsj9BFz6qqXEUH_KjjarPBI4JOyONlyK4v-DmZ8sz-3b-5O52jkm4oGUoG6_G6kNx0E859fJybW2B6YUt-Z16F',
        photoAlt: 'Peaceful garden lavender bench',
      };
    }
    // 'okay' (default steady pace)
    return {
      id: 'picture-memory',
      titleEn: 'Picture Memory',
      titleTa: 'பட நினைவாற்றல்',
      categoryEn: 'Visual Observation',
      categoryTa: 'காட்சி நினைவாற்றல்',
      reasonEn: 'A calm, steady morning. Take a peaceful moment to observe everyday keepsakes.',
      reasonTa: 'அமைதியான தொடக்கம். நிதானமாக படங்களை கவனித்து நினைவில் கொள்ளும் எளிய பயிற்சி.',
      durationEn: '2 minutes • Gentle pace',
      durationTa: '2 நிமிடங்கள் • மெதுவான வேகம்',
      photoUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA7AJ5egisAdachheWWpGsfmYF_evurwjKd7uvzKey1spkbxGQEWxC2QGqiMDdcYyuETee0RzbjXF9G0lJcdvfOnIWqhdatjx9xJAzDuu-DOVBi8SgOb5II85CvzokLMDDoYhfZgKtO8VX6i1T5irJY4lHIy1JocbupyiQDi636OLqBDk11_uYSLTKGY2weU222qZcXfzl3vNX2RHGNcCx7jVrIBA2cCI-LCIokOxKLiM09KC-qg9PT',
      photoAlt: 'Familiar morning memory objects and flowers',
    };
  };

  const rec = getMoodRecommendation(mood);
  const recTitle = language === 'ta' ? rec.titleTa : rec.titleEn;
  const recReason = language === 'ta' ? rec.reasonTa : rec.reasonEn;
  const recDuration = language === 'ta' ? rec.durationTa : rec.durationEn;

  const toggleSpeechGreeting = () => {
    if (isSpeakingGreeting) {
      soundService.stopSpeech();
      setIsSpeakingGreeting(false);
      return;
    }

    const textToRead =
      language === 'ta'
        ? `காலை வணக்கம் ரவி. இன்று திங்கட்கிழமை, அக்டோபர் இருபத்தி நான்கு. நீங்கள் இப்போது ${
            mood === 'good' ? 'மகிழ்ச்சியாக' : mood === 'okay' ? 'அமைதியாக' : 'சோர்வாக'
          } உணர்வதாகப் பதிவிட்டுள்ளீர்கள். உங்களுக்காக பரிந்துரைக்கப்பட்ட பயிற்சி ${recTitle}. ${recReason}. தயாராக இருக்கும்போது தொடங்குங்கள்.`
        : `Good morning Ravi. Today is Monday, October 24. Since your feeling is recorded as ${mood}, your recommended morning activity is ${recTitle}. ${recReason}. Tap START whenever you feel ready.`;

    soundService.speakText(textToRead, {
      lang: language,
      onStart: () => setIsSpeakingGreeting(true),
      onEnd: () => setIsSpeakingGreeting(false),
      onError: () => setIsSpeakingGreeting(false),
    });
  };

  const handleMoodClick = (selected: MoodType) => {
    soundService.playSoftTap();
    onSelectMood(selected);

    let message = '';
    if (selected === 'good') {
      message = t.moodGoodToast;
    } else if (selected === 'okay') {
      message = t.moodOkayToast;
    } else {
      message = t.moodTiredToast;
    }
    setMoodToast(message);
    setTimeout(() => setMoodToast(null), 3500);
  };

  const unreadNote = photoNotes.find((n) => !n.read) || photoNotes[0];

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto space-y-5 pb-28 pt-24 px-4 sm:px-6">
      {/* 1. Voice Read Aloud Floating/Prominent Banner */}
      <section className="w-full">
        <button
          type="button"
          aria-label={t.hearScreen}
          onClick={toggleSpeechGreeting}
          className={`w-full min-h-[58px] p-3 rounded-xl shadow-sm flex items-center justify-between text-left transition-all cursor-pointer border ${
            isSpeakingGreeting
              ? 'bg-[#b8ede3] border-[#35675f] text-[#00201c]'
              : 'bg-[#f1f4f9] hover:bg-[#e5e8ee] border-[#ebeef3] text-[#181c20]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-[#b8ede3] flex items-center justify-center shrink-0 shadow-inner">
              <span
                className="material-symbols-outlined text-[#35675f] text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isSpeakingGreeting ? 'graphic_eq' : 'volume_up'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[18px] font-bold text-[#0c405e] tracking-tight">
                {isSpeakingGreeting ? t.speakingGently : t.hearScreen}
              </span>
              <span className="text-[14px] sm:text-[15px] text-[#42474d] truncate">
                {t.hearScreenSub}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#35675f] pl-2 shrink-0">
            <span className="text-[15px] font-bold">
              {isSpeakingGreeting ? t.pause : t.play}
            </span>
            <span className="material-symbols-outlined text-[24px]">
              {isSpeakingGreeting ? 'pause_circle' : 'play_circle'}
            </span>
          </div>
        </button>
      </section>

      {/* 2. Warm Humanist Greeting Card */}
      <section className="w-full bg-white p-5 rounded-2xl shadow-sm border border-[#eae4dc] flex flex-col justify-start">
        <div className="flex items-center justify-between">
          <span className="text-[17px] font-medium text-[#42474d]">
            {t.dateStr}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#ebeef3] text-[#42474d] text-[14px] font-semibold">
            {t.morning}
          </span>
        </div>
        <h1 className="text-[28px] sm:text-[32px] font-bold text-[#181c20] mt-2 tracking-tight">
          {t.greeting}
        </h1>
        <p className="text-[18px] sm:text-[19px] text-[#42474d] mt-1.5 leading-relaxed">
          {t.greetingSub}
        </p>
      </section>

      {/* 3. Mood / Feeling Section */}
      <section className="w-full bg-white p-5 rounded-2xl shadow-sm border border-[#eae4dc] flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#181c20]">
            {t.howFeeling}
          </h2>
          <span className="text-[15px] text-[#42474d] font-medium">{t.tapOne}</span>
        </div>

        {/* 3 Large Comfortable Mood Tiles */}
        <div
          role="radiogroup"
          aria-label="Current Mood Selection"
          className="grid grid-cols-3 gap-3"
        >
          {/* Good */}
          <button
            type="button"
            role="radio"
            aria-checked={mood === 'good'}
            onClick={() => handleMoodClick('good')}
            className={`min-h-[82px] flex flex-col items-center justify-center p-2 rounded-2xl transition-all relative cursor-pointer border ${
              mood === 'good'
                ? 'bg-[#b8ede3] text-[#00201c] border-[#35675f] shadow-sm'
                : 'bg-[#f1f4f9] hover:bg-[#e5e8ee] text-[#181c20] border-transparent'
            }`}
          >
            <span aria-hidden="true" className="text-3xl select-none">
              😊
            </span>
            <span className="text-[16px] sm:text-[17px] font-bold mt-1">{t.moodGood}</span>
            {mood === 'good' && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#35675f] flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
            )}
          </button>

          {/* Okay */}
          <button
            type="button"
            role="radio"
            aria-checked={mood === 'okay'}
            onClick={() => handleMoodClick('okay')}
            className={`min-h-[82px] flex flex-col items-center justify-center p-2 rounded-2xl transition-all relative cursor-pointer border ${
              mood === 'okay'
                ? 'bg-[#b8ede3] text-[#00201c] border-[#35675f] shadow-sm'
                : 'bg-[#f1f4f9] hover:bg-[#e5e8ee] text-[#181c20] border-transparent'
            }`}
          >
            <span aria-hidden="true" className="text-3xl select-none">
              🙂
            </span>
            <span className="text-[16px] sm:text-[17px] font-bold mt-1">{t.moodOkay}</span>
            {mood === 'okay' && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#35675f] flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
            )}
          </button>

          {/* Tired */}
          <button
            type="button"
            role="radio"
            aria-checked={mood === 'tired'}
            onClick={() => handleMoodClick('tired')}
            className={`min-h-[82px] flex flex-col items-center justify-center p-2 rounded-2xl transition-all relative cursor-pointer border ${
              mood === 'tired'
                ? 'bg-[#b8ede3] text-[#00201c] border-[#35675f] shadow-sm'
                : 'bg-[#f1f4f9] hover:bg-[#e5e8ee] text-[#181c20] border-transparent'
            }`}
          >
            <span aria-hidden="true" className="text-3xl select-none">
              😐
            </span>
            <span className="text-[16px] sm:text-[17px] font-bold mt-1">{t.moodTired}</span>
            {mood === 'tired' && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#35675f] flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
            )}
          </button>
        </div>

        {/* Mood feedback toast note */}
        {moodToast && (
          <div className="mt-3 p-3 rounded-xl bg-[#b8ede3] text-[#00201c] text-[15px] font-medium flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-[20px] text-[#35675f]">
              favorite
            </span>
            <span>{moodToast}</span>
          </div>
        )}
      </section>

      {/* 4. DOMINANT CARD: Today's Recommended Activity (Dynamic by Mood) */}
      <main className="w-full bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#eae4dc] flex flex-col relative overflow-hidden">
        {/* Recommendation Banner */}
        <div className="flex items-start gap-2.5 bg-[#f1f4f9] p-3 rounded-xl mb-4">
          <div className="w-9 h-9 rounded-full bg-[#b8ede3] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[#35675f] text-[22px]">
              auto_awesome
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-bold text-[#35675f]">
                {t.recommendedForYou}
              </span>
              <span className="text-[12px] font-bold bg-[#b8ede3] text-[#00201c] px-2 py-0.5 rounded-full">
                {language === 'ta'
                  ? mood === 'good' ? 'மகிழ்ச்சி தேர்வு' : mood === 'tired' ? 'அமைதியான தேர்வு' : 'நிதான தேர்வு'
                  : mood === 'good' ? 'Energized choice' : mood === 'tired' ? 'Gentle rest' : 'Steady focus'}
              </span>
            </div>
            <span className="text-[14px] text-[#42474d] mt-0.5">
              {recReason}
            </span>
          </div>
        </div>

        {/* Visual Anchor Photo */}
        <div className="w-full h-48 rounded-xl overflow-hidden relative mb-4 shadow-inner bg-slate-100">
          <img
            alt={rec.photoAlt}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            src={rec.photoUrl}
          />
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-[#181c20]">
            <span className="material-symbols-outlined text-[#0c405e] text-[20px]">
              timer
            </span>
            <span className="text-[14px] font-bold">{recDuration}</span>
          </div>
        </div>

        {/* Activity Title and Description */}
        <div className="flex flex-col mb-5">
          <h3 className="text-[26px] font-bold text-[#181c20] tracking-tight">
            {recTitle}
          </h3>
          <p className="text-[18px] text-[#42474d] mt-1 leading-relaxed">
            {recReason}
          </p>
        </div>

        {/* Big Primary Dominant Action CTA */}
        <div className="flex flex-col items-center w-full">
          <button
            type="button"
            aria-label={`Start ${recTitle} activity`}
            onClick={() => onStartActivity(rec.id)}
            className="w-full min-h-[64px] bg-[#0c405e] hover:bg-[#2b5777] active:scale-[0.99] text-white rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer font-bold text-[22px] tracking-wide"
          >
            <span>{t.start}</span>
            <span className="material-symbols-outlined text-[30px]">arrow_forward</span>
          </button>

          {/* Gentle Reassurance Prompt */}
          <p className="text-[15px] text-[#42474d] text-center mt-3 flex items-center justify-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-[18px] text-[#35675f]">
              favorite
            </span>
            <span>{t.tapWheneverReady}</span>
          </p>
        </div>
      </main>

      {/* 5. Family Photo Note Banner (If received) */}
      {unreadNote && (
        <section className="w-full bg-[#ffdcc1]/50 border border-[#ffb778] p-4 rounded-2xl flex items-start gap-3 shadow-sm">
          <img
            src={unreadNote.photoUrl}
            alt="Family photo"
            className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-sm border border-white"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[#5d3100]">
              <span className="material-symbols-outlined text-[18px]">favorite</span>
              <span className="text-[15px] font-bold">{t.noteFrom} {unreadNote.senderName}</span>
            </div>
            <p className="text-[16px] text-[#181c20] font-medium line-clamp-2 mt-0.5">
              "{unreadNote.message}"
            </p>
            <button
              type="button"
              onClick={() => onOpenNoteDetail(unreadNote)}
              className="text-[14px] font-bold text-[#5d3100] underline mt-1 cursor-pointer"
            >
              {t.openPhotoNote}
            </button>
          </div>
        </section>
      )}

      {/* 6. Reassurance / Loved One Connection Pill */}
      <section className="w-full bg-[#f1f4f9] p-4 rounded-2xl border border-[#ebeef3] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-[#e0e3e8] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#0c405e] text-[24px]">
              phone_in_talk
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[18px] font-bold text-[#181c20] truncate">
              {t.anitaOnCall}
            </span>
            <span className="text-[15px] text-[#42474d] truncate">
              {t.daughterAvailable}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenCall('Anita', 'Daughter')}
          className="px-4 py-2.5 bg-white hover:bg-[#ebeef3] text-[#0c405e] rounded-xl font-bold text-[16px] shadow-sm shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer border border-[#eae4dc]"
        >
          <span className="material-symbols-outlined text-[20px]">call</span>
          <span>{t.sayHello}</span>
        </button>
      </section>
    </div>
  );
};
