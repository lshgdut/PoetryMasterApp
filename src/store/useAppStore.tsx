import React, {createContext, useContext, useReducer, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ReciteRecord} from '../data/types';

interface UserData {
  totalPoints: number;
  streakDays: number;
  lastReciteDate: string | null;
  reciteRecords: ReciteRecord[];
  lastReciteDates: Record<string, string>;
}

interface AppState {
  userData: UserData;
  currentPoetryId: string | null;
  isReciting: boolean;
  transcribedText: string;
  similarityScore: number;
  voiceRecitePassed: boolean;
}

type Action =
  | {type: 'SET_USER_DATA'; payload: UserData}
  | {type: 'START_RECITE'; payload: string}
  | {type: 'END_RECITE'}
  | {type: 'SET_TRANSCRIBED'; payload: string}
  | {type: 'SET_SIMILARITY'; payload: number}
  | {type: 'SET_VOICE_PASSED'; payload: boolean}
  | {type: 'ADD_RECORD'; payload: {record: ReciteRecord; pointsEarned: number}};

const initialUserData: UserData = {
  totalPoints: 0,
  streakDays: 0,
  lastReciteDate: null,
  reciteRecords: [],
  lastReciteDates: {},
};

const initialState: AppState = {
  userData: initialUserData,
  currentPoetryId: null,
  isReciting: false,
  transcribedText: '',
  similarityScore: 0,
  voiceRecitePassed: false,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER_DATA':
      return {...state, userData: action.payload};
    case 'START_RECITE':
      return {
        ...state,
        currentPoetryId: action.payload,
        isReciting: true,
        transcribedText: '',
        similarityScore: 0,
        voiceRecitePassed: false,
      };
    case 'END_RECITE':
      return {...state, currentPoetryId: null, isReciting: false};
    case 'SET_TRANSCRIBED':
      return {...state, transcribedText: action.payload};
    case 'SET_SIMILARITY':
      return {...state, similarityScore: action.payload};
    case 'SET_VOICE_PASSED':
      return {...state, voiceRecitePassed: action.payload};
    case 'ADD_RECORD': {
      const {record, pointsEarned} = action.payload;
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const lastDate = state.userData.lastReciteDate;
      let newStreakDays = state.userData.streakDays;
      if (lastDate) {
        const lastDay = lastDate.split('T')[0];
        const diff = Math.floor((now.getTime() - new Date(lastDay).getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          newStreakDays = state.userData.streakDays + 1;
        } else if (diff > 1) {
          newStreakDays = 1;
        }
      } else {
        newStreakDays = 1;
      }
      return {
        ...state,
        userData: {
          ...state.userData,
          totalPoints: state.userData.totalPoints + pointsEarned,
          streakDays: newStreakDays,
          lastReciteDate: now.toISOString(),
          reciteRecords: [...state.userData.reciteRecords, record],
          lastReciteDates: {
            ...state.userData.lastReciteDates,
            [record.poetryId]: record.reciteDate,
          },
        },
      };
    }
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  loadUserData: () => Promise<void>;
  saveUserData: () => Promise<void>;
  calculatePoints: (poetryId: string) => {points: number; type: 'first' | 'normal' | 'quick'};
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        dispatch({type: 'SET_USER_DATA', payload: JSON.parse(data)});
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const saveUserData = async () => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(state.userData));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  const calculatePoints = (poetryId: string): {points: number; type: 'first' | 'normal' | 'quick'} => {
    const lastDate = state.userData.lastReciteDates[poetryId];
    if (!lastDate) {
      return {points: 10, type: 'first'};
    }
    const daysDiff = Math.floor(
      (Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysDiff >= 3) {
      return {points: 5, type: 'normal'};
    }
    return {points: 3, type: 'quick'};
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    saveUserData();
  }, [state.userData]);

  return (
    <AppContext.Provider value={{state, dispatch, loadUserData, saveUserData, calculatePoints}}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppProvider');
  }

  // 返回兼容旧接口的结构
  const {state, dispatch, loadUserData, saveUserData, calculatePoints} = context;

  return {
    userData: state.userData,
    currentPoetryId: state.currentPoetryId,
    isReciting: state.isReciting,
    transcribedText: state.transcribedText,
    similarityScore: state.similarityScore,
    voiceRecitePassed: state.voiceRecitePassed,
    loadUserData,
    saveUserData,
    startRecite: (poetryId: string) => dispatch({type: 'START_RECITE', payload: poetryId}),
    endRecite: () => dispatch({type: 'END_RECITE'}),
    setTranscribedText: (text: string) => dispatch({type: 'SET_TRANSCRIBED', payload: text}),
    setSimilarityScore: (score: number) => dispatch({type: 'SET_SIMILARITY', payload: score}),
    setVoiceRecitePassed: (passed: boolean) => dispatch({type: 'SET_VOICE_PASSED', payload: passed}),
    calculatePoints,
    addReciteRecord: (record: ReciteRecord) => {
      const pointsResult = calculatePoints(record.poetryId);
      dispatch({type: 'ADD_RECORD', payload: {record, pointsEarned: pointsResult.points}});
    },
  };
}