import React, { useState, useEffect, useCallback } from 'react';
import { TabType, MoodType, ActivityItem, PhotoNote, Language } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { ActivitiesScreen } from './screens/ActivitiesScreen';
import { ActiveExerciseScreen } from './screens/ActiveExerciseScreen';
import { MatchPicturesScreen } from './screens/MatchPicturesScreen';
import { NumberMemoryScreen } from './screens/NumberMemoryScreen';
import { WordSayingsScreen } from './screens/WordSayingsScreen';
import { CategorySortScreen } from './screens/CategorySortScreen';
import { ColorLanternsScreen } from './screens/ColorLanternsScreen';
import { SoundGuessScreen } from './screens/SoundGuessScreen';
import { DailyRoutineScreen } from './screens/DailyRoutineScreen';
import { FamilyScreen } from './screens/FamilyScreen';
import { SendPhotoNoteModal } from './components/SendPhotoNoteModal';
import { CallModal } from './components/CallModal';
import { VoiceCheerModal } from './components/VoiceCheerModal';
import { PhotoNoteDetailModal } from './components/PhotoNoteDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { soundService } from './utils/audio';
import { translations } from './utils/i18n';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [mood, setMood] = useState<MoodType>('good');
  const [easyView, setEasyView] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');

  // Modals state
  const [sendPhotoModalOpen, setSendPhotoModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callerInfo, setCallerInfo] = useState({ name: 'Anita', relation: 'Daughter' });
  const [voiceCheerModalOpen, setVoiceCheerModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedPhotoNote, setSelectedPhotoNote] = useState<PhotoNote | null>(null);

  // Rich catalog of 8 diverse cognitive games for elder memory care
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 'picture-memory',
      title: 'Picture Memory',
      description: 'Remember familiar objects you see in a peaceful observation grid.',
      icon: 'photo_library',
      badge: 'Recommended for Ravi',
      category: 'memory',
      categoryLabel: 'Memory',
      interactivity: 'Visual Observation',
      completed: true,
      completedAt: '10:15 AM',
      durationMinutes: 2,
    },
    {
      id: 'match-pictures',
      title: 'Match the Pictures',
      description: 'Find pairs of everyday flowers & fruits with gentle tile flips.',
      icon: 'extension',
      category: 'memory',
      categoryLabel: 'Memory',
      interactivity: 'Card Pair Matching',
      completed: true,
      completedAt: '2:30 PM',
      durationMinutes: 3,
    },
    {
      id: 'number-memory',
      title: 'Number Memory',
      description: 'Remember simple friendly numbers with a comfortable keypad.',
      icon: 'pin',
      category: 'memory',
      categoryLabel: 'Memory',
      interactivity: 'Sequence Keypad',
      completed: false,
      durationMinutes: 2,
    },
    {
      id: 'word-sayings',
      title: 'Familiar Sayings',
      description: 'Recall comforting proverbs like "Home is where the heart is".',
      icon: 'menu_book',
      badge: 'Reminiscence Favorite',
      category: 'words',
      categoryLabel: 'Words & Sayings',
      interactivity: 'Words & Sayings',
      completed: false,
      durationMinutes: 2,
    },
    {
      id: 'category-sort',
      title: 'Kitchen or Garden',
      description: 'Sort familiar treasures into the home hearth or garden baskets.',
      icon: 'category',
      category: 'words',
      categoryLabel: 'Words & Sayings',
      interactivity: 'Two-Basket Sorting',
      completed: false,
      durationMinutes: 3,
    },
    {
      id: 'color-lanterns',
      title: 'Lantern Harmony',
      description: 'Follow peaceful glowing lanterns and soothing musical chimes.',
      icon: 'graphic_eq',
      category: 'sensory',
      categoryLabel: 'Sensory & Sounds',
      interactivity: 'Light & Chime Rhythm',
      completed: false,
      durationMinutes: 2,
    },
    {
      id: 'sound-guess',
      title: 'Familiar Sounds',
      description: 'Listen to songbirds, whistling kettles, and spring raindrops.',
      icon: 'hearing',
      category: 'sensory',
      categoryLabel: 'Sensory & Sounds',
      interactivity: 'Sound Recognition',
      completed: false,
      durationMinutes: 3,
    },
    {
      id: 'daily-routine',
      title: 'Daily Rhythm Clocks',
      description: 'Connect gentle times of day to pleasant habits like morning tea.',
      icon: 'schedule',
      category: 'rhythm',
      categoryLabel: 'Daily Rhythm',
      interactivity: 'Clock & Habit Match',
      completed: false,
      durationMinutes: 2,
    },
  ]);

  // Family photo notes
  const [photoNotes, setPhotoNotes] = useState<PhotoNote[]>([
    {
      id: 'note-1',
      senderName: 'Priya',
      relationship: 'Daughter',
      message: 'Thinking of you, Dad! We planted new yellow marigolds in the garden today. Sending big warm hugs!',
      photoUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDKe6ampXYTfUCePC-3FlIi0HgLFyKF8MOh0zGpteJy4ODp4sYMYvWPg_UsgWDtjTD8g_lAVzbRm0p7dY0kSWPdiLZBXXKlH7nhFUTIkhYYCNXcbR-m_EhycNLBM9J1_IzTx0V0AoeHeAihP_-4hinOB0PTskCAogHsj9BFz6qqXEUH_KjjarPBI4JOyONlyK4v-DmZ8sz-3b-5O52jkm4oGUoG6_G6kNx0E859fJybW2B6YUt-Z16F',
      timestamp: 'Today at 9:30 AM',
      read: false,
    },
  ]);

  // Apply Easy View body class
  useEffect(() => {
    if (easyView) {
      document.body.classList.add('easy-view-active');
    } else {
      document.body.classList.remove('easy-view-active');
    }
  }, [easyView]);

  const handleStartActivity = (activityId: string) => {
    soundService.playGentleChime();
    setActiveExercise(activityId);
  };

  const handleMarkActivityCompleted = useCallback((activityId: string) => {
    setActivities((prev) => {
      const existing = prev.find((a) => a.id === activityId);
      if (existing && existing.completed) {
        return prev;
      }
      return prev.map((act) =>
        act.id === activityId
          ? {
              ...act,
              completed: true,
              completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : act
      );
    });
  }, []);

  const onFinishPictureMemory = useCallback(() => handleMarkActivityCompleted('picture-memory'), [handleMarkActivityCompleted]);
  const onFinishMatchPictures = useCallback(() => handleMarkActivityCompleted('match-pictures'), [handleMarkActivityCompleted]);
  const onFinishNumberMemory = useCallback(() => handleMarkActivityCompleted('number-memory'), [handleMarkActivityCompleted]);
  const onFinishWordSayings = useCallback(() => handleMarkActivityCompleted('word-sayings'), [handleMarkActivityCompleted]);
  const onFinishCategorySort = useCallback(() => handleMarkActivityCompleted('category-sort'), [handleMarkActivityCompleted]);
  const onFinishColorLanterns = useCallback(() => handleMarkActivityCompleted('color-lanterns'), [handleMarkActivityCompleted]);
  const onFinishSoundGuess = useCallback(() => handleMarkActivityCompleted('sound-guess'), [handleMarkActivityCompleted]);
  const onFinishDailyRoutine = useCallback(() => handleMarkActivityCompleted('daily-routine'), [handleMarkActivityCompleted]);

  const handleBackFromExercise = () => {
    soundService.stopSpeech();
    setActiveExercise(null);
  };

  const handleDoneForToday = () => {
    soundService.stopSpeech();
    setActiveExercise(null);
    setCurrentTab('home');
  };

  const handleOneMoreActivity = () => {
    soundService.stopSpeech();
    setActiveExercise(null);
    setCurrentTab('activities');
  };

  const handleSendPhotoNote = (newNoteData: Omit<PhotoNote, 'id' | 'timestamp' | 'read'>) => {
    const newNote: PhotoNote = {
      ...newNoteData,
      id: `note-${Date.now()}`,
      timestamp: language === 'ta' ? 'இப்போது' : 'Just now',
      read: false,
    };
    setPhotoNotes((prev) => [newNote, ...prev]);
  };

  const handleOpenCall = (name = 'Anita', relation = 'Daughter') => {
    setCallerInfo({ name, relation });
    setCallModalOpen(true);
  };

  const getExerciseTitle = () => {
    const t = translations[language];
    if (!activeExercise) return t.activeExercise;
    const localized = t.activitiesList[activeExercise as keyof typeof t.activitiesList];
    return localized?.title || t.activeExercise;
  };

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#181c20] font-sans flex flex-col antialiased selection:bg-[#b8ede3] selection:text-[#00201c]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        isInExercise={activeExercise !== null}
        exerciseTitle={getExerciseTitle()}
        onBack={handleBackFromExercise}
        easyView={easyView}
        onToggleEasyView={() => setEasyView(!easyView)}
        language={language}
        onToggleLanguage={() => {
          soundService.playSoftTap();
          setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
        }}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1 w-full">
        {activeExercise === 'picture-memory' ? (
          <ActiveExerciseScreen
            onFinishExercise={onFinishPictureMemory}
            onDoneForToday={handleDoneForToday}
            onOneMoreActivity={handleOneMoreActivity}
          />
        ) : activeExercise === 'match-pictures' ? (
          <MatchPicturesScreen
            onFinishExercise={onFinishMatchPictures}
            onDoneForToday={handleDoneForToday}
            onOneMoreActivity={handleOneMoreActivity}
          />
        ) : activeExercise === 'number-memory' ? (
          <NumberMemoryScreen
            onFinishExercise={onFinishNumberMemory}
            onDoneForToday={handleDoneForToday}
            onOneMoreActivity={handleOneMoreActivity}
          />
        ) : activeExercise === 'word-sayings' ? (
          <WordSayingsScreen
            onFinishExercise={onFinishWordSayings}
            onDoneForToday={handleDoneForToday}
            onOneMoreActivity={handleOneMoreActivity}
          />
        ) : activeExercise === 'category-sort' ? (
          <CategorySortScreen
            onFinishExercise={onFinishCategorySort}
            onDoneForToday={handleDoneForToday}
            onOneMoreActivity={handleOneMoreActivity}
          />
        ) : activeExercise === 'color-lanterns' ? (
          <ColorLanternsScreen
            onFinishExercise={onFinishColorLanterns}
            onDoneForToday={handleDoneForToday}
            onOneMoreActivity={handleOneMoreActivity}
          />
        ) : activeExercise === 'sound-guess' ? (
          <SoundGuessScreen
            onFinishExercise={onFinishSoundGuess}
            onDoneForToday={handleDoneForToday}
            onOneMoreActivity={handleOneMoreActivity}
          />
        ) : activeExercise === 'daily-routine' ? (
          <DailyRoutineScreen
            onFinishExercise={onFinishDailyRoutine}
            onDoneForToday={handleDoneForToday}
            onOneMoreActivity={handleOneMoreActivity}
          />
        ) : currentTab === 'home' ? (
          <HomeScreen
            mood={mood}
            language={language}
            onSelectMood={setMood}
            onStartActivity={handleStartActivity}
            photoNotes={photoNotes}
            onOpenCall={handleOpenCall}
            onOpenNoteDetail={(note) => {
              setSelectedPhotoNote(note);
              setPhotoNotes((prev) =>
                prev.map((n) => (n.id === note.id ? { ...n, read: true } : n))
              );
            }}
          />
        ) : currentTab === 'activities' ? (
          <ActivitiesScreen
            activities={activities}
            language={language}
            onStartActivity={handleStartActivity}
          />
        ) : (
          <FamilyScreen
            mood={mood}
            activities={activities}
            language={language}
            onOpenSendPhotoNote={() => setSendPhotoModalOpen(true)}
            onOpenCall={() => handleOpenCall('Ravi', language === 'ta' ? 'தந்தை' : 'Father')}
            onOpenVoiceCheer={() => setVoiceCheerModalOpen(true)}
          />
        )}
      </main>

      {/* Bottom Tab Navigation (Only visible when not actively in an exercise) */}
      {activeExercise === null && (
        <BottomNav
          currentTab={currentTab}
          language={language}
          onSelectTab={(tab) => {
            soundService.stopSpeech();
            setCurrentTab(tab);
          }}
        />
      )}

      {/* Interactive Modals */}
      <SendPhotoNoteModal
        isOpen={sendPhotoModalOpen}
        onClose={() => setSendPhotoModalOpen(false)}
        onSendNote={handleSendPhotoNote}
      />

      <CallModal
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        callerName={callerInfo.name}
        callerRelation={callerInfo.relation}
      />

      <VoiceCheerModal
        isOpen={voiceCheerModalOpen}
        onClose={() => setVoiceCheerModalOpen(false)}
        onCheerSent={(msg) => {
          handleSendPhotoNote({
            senderName: 'Priya',
            relationship: language === 'ta' ? 'மகள்' : 'Daughter',
            message: msg,
            photoUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDrWZTLB0znBYOPxSMsMGF4_2Tww51_RgbPUrkg-yNXM_MymhRvHp5mtn5hDi3dtusicKpnAZURjMoCe9b08dT8Xg7gWiHBq91ODfTSfYAQ8YyTXi9kZEhTJ8_uyU8ljjiviplIh0ObZsKe4xQ8j0MLev9qERJYxG5Z5cEMCZwWG91vH4I-sWGau3tU2zVtYNQN4khUgFyK3RnHCPPiAinXTJJwO0H1EPGQyVTBi-8Dq__YFGrevmGU',
          });
        }}
      />

      <PhotoNoteDetailModal
        note={selectedPhotoNote}
        onClose={() => setSelectedPhotoNote(null)}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        easyView={easyView}
        onToggleEasyView={() => setEasyView(!easyView)}
        language={language}
        onSelectLanguage={(lang) => {
          soundService.playSoftTap();
          setLanguage(lang);
        }}
        onSwitchPerspective={(tab) => {
          setActiveExercise(null);
          setCurrentTab(tab);
        }}
      />
    </div>
  );
}
