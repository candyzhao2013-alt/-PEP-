export interface Sentence {
  id: string;
  charName?: string; // e.g. "Zhang Peng", "Peter"
  english: string;
  chinese: string;
  audioText: string; // text optimized for speech synthesis
}

export interface Unit {
  id: number;
  title: string;
  subTitle: string;
  topic: string;
  emoji: string;
  coverColor: string; // Tailwind bg color class
  accentColor: string; // Tailwind border/text class
  sentences: Sentence[];
}

export interface PetState {
  level: number;
  foodCount: number;
  exp: number;
  name: string;
  avatar: 'happy' | 'hungry' | 'excited' | 'sleepy' | 'eating';
  accessory: string; // Unlocked decorations
  lastActiveDate: string; // YYYY-MM-DD
  dailyPractices: string[]; // Set of completed sentence ids today
}

export interface UserProgress {
  scores: Record<string, number>; // sentenceId -> highest score (1-5)
  completedCountToday: number;
  lastDate: string;
}
