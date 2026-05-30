import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserData, ReciteRecord} from '../data/types';

interface AppState {
  userData: UserData;
  currentPoetryId: string | null;
  isReciting: boolean;
  transcribedText: string;
  similarityScore: number;
  voiceRecitePassed: boolean;
  
  // Actions
  setUserData: (data: UserData) => void;
  startRecite: (poetryId: string) => void;
  endRecite: () => void;
  setTranscribedText: (text: string) => void;
  setSimilarityScore: (score: number) => void;
  setVoiceRecitePassed: (passed: boolean) => void;
  loadUserData: () => Promise<void>;
  saveUserData: () => Promise<void>;
  addReciteRecord: (record: ReciteRecord) => void;
  calculatePoints: (poetryId: string) => {points: number; type: 'first' | 'normal' | 'quick'};
}

const initialUserData: UserData = {
  totalPoints: 0,
  streakDays: 0,
  lastReciteDate: null,
  reciteRecords: [],
  lastReciteDates: {},
};

export const useAppStore = create<AppState>((set, get) => ({
  userData: initialUserData,
  currentPoetryId: null,
  isReciting: false,
  transcribedText: '',
  similarityScore: 0,
  voiceRecitePassed: false,

  setUserData: data => set({userData: data}),

  startRecite: poetryId => set({
    currentPoetryId: poetryId,
    isReciting: true,
    transcribedText: '',
    similarityScore: 0,
    voiceRecitePassed: false,
  }),

  endRecite: () => set({
    currentPoetryId: null,
    isReciting: false,
  }),

  setTranscribedText: text => set({transcribedText: text}),
  setSimilarityScore: score => set({similarityScore: score}),
  setVoiceRecitePassed: passed => set({voiceRecitePassed: passed}),

  loadUserData: async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        set({userData: JSON.parse(data)});
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  },

  saveUserData: async () => {
    try {
      const data = get().userData;
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  },

  addReciteRecord: record => {
    const {userData} = get();
    const newUserData = {
      ...userData,
      totalPoints: userData.totalPoints + record.pointsEarned,
      reciteRecords: [...userData.reciteRecords, record],
      lastReciteDates: {
        ...userData.lastReciteDates,
        [record.poetryId]: record.reciteDate,
      },
    };
    set({userData: newUserData});
    get().saveUserData();
  },

  calculatePoints: poetryId => {
    const {userData} = get();
    const lastDate = userData.lastReciteDates[poetryId];
    
    if (!lastDate) {
      return {points: 10, type: 'first' as const};
    }
    
    const daysDiff = Math.floor(
      (Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24),
    );
    
    if (daysDiff >= 3) {
      return {points: 5, type: 'normal' as const};
    }
    
    return {points: 3, type: 'quick' as const};
  },
}));