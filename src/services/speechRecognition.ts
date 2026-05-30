import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

const {SpeechRecognitionModule} = NativeModules;

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventEmitter: NativeEventEmitter | null = null;
    
    if (SpeechRecognitionModule) {
      eventEmitter = new NativeEventEmitter(SpeechRecognitionModule);
      const subscription = eventEmitter.addListener('onSpeechResult', (event: any) => {
        setTranscribedText(event.text);
      });
      
      return () => {
        subscription.remove();
      };
    }
  }, []);

  const requestAuth = useCallback(async () => {
    if (!SpeechRecognitionModule) {
      setError('Speech recognition not available');
      return false;
    }
    
    try {
      const result = await SpeechRecognitionModule.requestAuth();
      return result[0] === 'authorized';
    } catch (e) {
      setError('Auth request failed');
      return false;
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!SpeechRecognitionModule) {
      setError('Speech recognition not available');
      return;
    }
    
    setTranscribedText('');
    setError(null);
    setIsListening(true);
    
    try {
      await SpeechRecognitionModule.startListening();
    } catch (e: any) {
      setError(e.message || 'Failed to start');
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(async () => {
    if (!SpeechRecognitionModule) return;
    
    try {
      await SpeechRecognitionModule.stopListening();
    } catch (e) {
      // Ignore stop errors
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcribedText,
    error,
    requestAuth,
    startListening,
    stopListening,
  };
};

// Calculate similarity between two texts
export const calculateSimilarity = (target: string, spoken: string): number => {
  if (!spoken.trim()) return 0;
  
  const normalize = (text: string) => text
    .replace(/\s/g, '')
    .replace(/，/g, '')
    .replace(/。/g, '')
    .replace(/？/g, '')
    .replace(/！/g, '');
  
  const t = normalize(target);
  const s = normalize(spoken);
  
  const distance = levenshteinDistance(t, s);
  const maxLen = Math.max(t.length, s.length);
  
  if (maxLen === 0) return 0;
  
  return Math.max(0, Math.min(1, 1 - distance / maxLen)) * 100;
};

const levenshteinDistance = (s1: string, s2: string): number => {
  const m = s1.length;
  const n = s2.length;
  
  if (m === 0) return n;
  if (n === 0) return m;
  
  const matrix: number[][] = [];
  
  for (let i = 0; i <= m; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  return matrix[m][n];
};