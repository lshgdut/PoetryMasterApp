import {useState, useCallback, useRef} from 'react';
import {poems} from '../data/poems';

interface SpeechRecognitionHook {
  isListening: boolean;
  transcribedText: string;
  error: string | null;
  requestAuth: () => Promise<boolean>;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const listeningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestAuth = useCallback(async (): Promise<boolean> => {
    return true;
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setTranscribedText('');
    setIsListening(true);

    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
    }

    listeningTimeoutRef.current = setTimeout(() => {
      const randomPoem = poems[Math.floor(Math.random() * poems.length)];
      setTranscribedText(randomPoem.content);
      setIsListening(false);
    }, 4000);
  }, []);

  const stopListening = useCallback(async () => {
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
    }
    if (!transcribedText) {
      const randomPoem = poems[Math.floor(Math.random() * poems.length)];
      setTranscribedText(randomPoem.content);
    }
    setIsListening(false);
  }, [transcribedText]);

  return {
    isListening,
    transcribedText,
    error,
    requestAuth,
    startListening,
    stopListening,
  };
}

export function calculateSimilarity(target: string, spoken: string): number {
  if (!spoken.trim()) return 0;
  
  const normalize = (text: string) => text
    .replace(/\s/g, '')
    .replace(/，/g, '')
    .replace(/。/g, '')
    .replace(/？/g, '')
    .replace(/！/g, '');
  
  const t = normalize(target);
  const s = normalize(spoken);
  
  if (t === s) return 100;
  if (t.includes(s) || s.includes(t)) return 85;
  
  const distance = levenshteinDistance(t, s);
  const maxLen = Math.max(t.length, s.length);
  
  if (maxLen === 0) return 0;
  
  return Math.max(0, Math.min(1, 1 - distance / maxLen)) * 100;
}

function levenshteinDistance(s1: string, s2: string): number {
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
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  
  return matrix[m][n];
}