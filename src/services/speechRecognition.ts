import {useState, useCallback, useRef} from 'react';

interface SpeechRecognitionHook {
  isListening: boolean;
  transcribedText: string;
  partialText: string;
  error: string | null;
  requestAuth: () => Promise<boolean>;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  setTargetPoem: (content: string) => void;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [partialText, setPartialText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const targetPoemRef = useRef<string>('');
  const listeningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const partialIndexRef = useRef<number>(0);

  const requestAuth = useCallback(async (): Promise<boolean> => {
    return true;
  }, []);

  const setTargetPoem = useCallback((content: string) => {
    targetPoemRef.current = content;
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setTranscribedText('');
    setPartialText('');
    setIsListening(true);
    partialIndexRef.current = 0;

    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
    }

    // 模拟实时转写：每隔800ms追加几个字
    const chars = targetPoemRef.current.split('');
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < chars.length) {
        const chunk = chars.slice(index, index + 3).join('');
        setPartialText(prev => prev + chunk);
        index += 3;
      } else {
        clearInterval(intervalId);
        // 完成后把最终内容设进 transcribedText
        setTranscribedText(targetPoemRef.current);
        setPartialText('');
      }
    }, 600);

    listeningTimeoutRef.current = intervalId as unknown as ReturnType<typeof setTimeout>;
  }, []);

  const stopListening = useCallback(async () => {
    if (listeningTimeoutRef.current) {
      clearInterval(listeningTimeoutRef.current as unknown as ReturnType<typeof setInterval>);
      listeningTimeoutRef.current = null;
    }
    // 把实时识别内容凝固为最终结果
    setTranscribedText(prev => prev || partialText);
    setPartialText('');
    setIsListening(false);
  }, [partialText]);

  return {
    isListening,
    transcribedText,
    partialText,
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