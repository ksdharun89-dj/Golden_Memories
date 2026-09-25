export type TabType = 'home' | 'activities' | 'family';

export type MoodType = 'good' | 'okay' | 'tired';

export type Language = 'en' | 'ta';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
  category: 'memory' | 'words' | 'sensory' | 'rhythm';
  categoryLabel: string;
  interactivity: string;
  completed: boolean;
  completedAt?: string;
  durationMinutes: number;
}

export interface PhotoNote {
  id: string;
  senderName: string;
  relationship: string;
  message: string;
  photoUrl: string;
  timestamp: string;
  read: boolean;
}

export interface ExerciseItem {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  alt: string;
}

