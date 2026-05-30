export interface Poetry {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  content: string;
  translation: string;
  appreciation: string;
  category: string;
}

export interface ReciteRecord {
  id: string;
  poetryId: string;
  reciteDate: string;
  reciteType: 'first' | 'normal' | 'quick';
  pointsEarned: number;
}

export interface UserData {
  totalPoints: number;
  streakDays: number;
  lastReciteDate: string | null;
  reciteRecords: ReciteRecord[];
  lastReciteDates: Record<string, string>;
}

export interface PoetryCircle {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  reciteRecords: CircleReciteRecord[];
}

export interface CircleReciteRecord {
  id: string;
  userId: string;
  userName: string;
  poetryId: string;
  poetryTitle: string;
  points: number;
  date: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  points: number;
  avatar?: string;
}

export interface LevelInfo {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  emoji: string;
}