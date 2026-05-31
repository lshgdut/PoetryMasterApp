import {useState, useCallback, useRef} from 'react';

interface SpeechRecognitionHook {
  isListening: boolean;
  transcribedText: string;
  error: string | null;
  requestAuth: () => Promise<boolean>;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  setTargetPoem: (content: string) => void;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const targetPoemRef = useRef<string>('');
  const listeningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestAuth = useCallback(async (): Promise<boolean> => {
    return true;
  }, []);

  const setTargetPoem = useCallback((content: string) => {
    targetPoemRef.current = content;
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setTranscribedText('');
    setIsListening(true);

    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
    }

    // 模拟：4秒后返回目标诗词内容（模拟器模式下）
    listeningTimeoutRef.current = setTimeout(() => {
      setTranscribedText(targetPoemRef.current);
      setIsListening(false);
    }, 4000);
  }, []);

  const stopListening = useCallback(async () => {
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
    }
    // 停止时返回已识别的内容（用户说出的内容）
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcribedText,
    error,
    requestAuth,
    startListening,
    stopListening,
    setTargetPoem,
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