import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useAppStore} from '../store/useAppStore';
import {useSpeechRecognition, calculateSimilarity} from '../services/speechRecognition';
import {poems} from '../data/poems';
import {Poetry} from '../data/types';

export const ReciteScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {
    userData,
    startRecite,
    endRecite,
    addReciteRecord,
    calculatePoints,
  } = useAppStore();
  
  const [currentPoetry, setCurrentPoetry] = useState<Poetry | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [result, setResult] = useState<{points: number; type: string} | null>(null);
  
  const {
    isListening,
    transcribedText,
    error,
    requestAuth,
    startListening,
    stopListening,
  } = useSpeechRecognition();
  
  const [similarityScore, setSimilarityScore] = useState(0);
  const [voicePassed, setVoicePassed] = useState(false);

  useEffect(() => {
    if (transcribedText && currentPoetry) {
      const score = calculateSimilarity(currentPoetry.content, transcribedText);
      setSimilarityScore(score);
      setVoicePassed(score >= 90);
    }
  }, [transcribedText, currentPoetry]);

  const handleStartRecite = async () => {
    const poetry = poems[Math.floor(Math.random() * poems.length)];
    setCurrentPoetry(poetry);
    setResult(null);
    setSimilarityScore(0);
    setVoicePassed(false);
    startRecite(poetry.id);
    
    const auth = await requestAuth();
    if (!auth) {
      Alert.alert(
        '权限未授权',
        '请在设置中开启语音识别权限',
        [{text: '确定'}]
      );
    }
  };

  const handleStartListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  };

  const handleStopAndCheck = () => {
    stopListening();
  };

  const handleConfirmRecite = () => {
    if (!currentPoetry || !voicePassed) return;
    
    const {points, type} = calculatePoints(currentPoetry.id);
    
    const record = {
      id: Date.now().toString(),
      poetryId: currentPoetry.id,
      reciteDate: new Date().toISOString(),
      reciteType: type,
      pointsEarned: points,
    };
    
    addReciteRecord(record);
    setResult({points, type});
    
    setTimeout(() => {
      handleReset();
    }, 2500);
  };

  const handleReset = () => {
    setCurrentPoetry(null);
    setResult(null);
    setSimilarityScore(0);
    setVoicePassed(false);
    endRecite();
  };

  const getScoreFeedback = () => {
    if (similarityScore >= 90) {
      return {text: `✅ 匹配度 ${Math.round(similarityScore)}% - 背诵通过！`, color: '#34C759'};
    } else if (similarityScore >= 70) {
      return {text: `⚠️ 匹配度 ${Math.round(similarityScore)}% - 还差一点点`, color: '#FF9500'};
    } else if (similarityScore > 0) {
      return {text: `❌ 匹配度 ${Math.round(similarityScore)}% - 请重新背诵`, color: '#FF3B30'};
    }
    return {text: '🎤 点击开始朗读诗词', color: '#86868B'};
  };

  if (result) {
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultEmoji}>✅</Text>
        <Text style={styles.resultTitle}>背诵成功！</Text>
        <Text style={styles.resultPoints}>+{result.points}</Text>
        <Text style={styles.resultType}>
          {result.type === 'first' ? '🌟 首次背诵！太棒了！' :
           result.type === 'normal' ? '📚 温故知新，继续保持！' :
           '⚡ 快速复习，记忆深刻！'}
        </Text>
      </View>
    );
  }

  if (!currentPoetry) {
    return (
      <View style={styles.startContainer}>
        <Text style={styles.startTitle}>🎤 背诵诗词</Text>
        <Text style={styles.startSubtitle}>
          选择一首诗词进行背诵，{`\n`}语音识别匹配度达到90%即可通过
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={handleStartRecite}>
          <Text style={styles.startButtonText}>开始背诵</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>背诵中</Text>
        <View style={{width: 30}} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.poetryCard}>
          <Text style={styles.poetryTitle}>{currentPoetry.title}</Text>
          <Text style={styles.poetryAuthor}>{currentPoetry.dynasty} · {currentPoetry.author}</Text>
          <Text style={styles.poetryContent}>{currentPoetry.content}</Text>
        </View>

        <View style={styles.voiceCard}>
          <Text style={styles.voiceTitle}>🎤 语音背诵</Text>
          
          <View style={styles.voiceStatus}>
            {isListening ? (
              <View style={styles.listeningIndicator}>
                <View style={styles.dot} />
                <Text style={styles.listeningText}>正在聆听...</Text>
              </View>
            ) : transcribedText ? (
              <Text style={styles.transcribedText}>识别: {transcribedText}</Text>
            ) : (
              <Text style={styles.hintText}>点击按钮开始朗读诗词</Text>
            )}
          </View>

          {similarityScore > 0 && (
            <View style={[styles.scoreCard, {backgroundColor: getScoreFeedback().color + '20'}]}>
              <Text style={[styles.scoreText, {color: getScoreFeedback().color}]}>
                {getScoreFeedback().text}
              </Text>
            </View>
          )}

          <View style={styles.voiceButtons}>
            <TouchableOpacity
              style={[styles.micButton, isListening && styles.micButtonActive]}
              onPress={handleStartListening}
            >
              <Text style={styles.micIcon}>{isListening ? '⏹' : '🎤'}</Text>
            </TouchableOpacity>
            
            {isListening && (
              <TouchableOpacity style={styles.stopButton} onPress={handleStopAndCheck}>
                <Text style={styles.stopText}>停止并识别</Text>
              </TouchableOpacity>
            )}
          </View>

          {voicePassed && (
            <View style={styles.passedBadge}>
              <Text style={styles.passedText}>✓ 语音识别通过</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.translationToggle}
          onPress={() => setShowTranslation(!showTranslation)}
        >
          <Text style={styles.translationToggleText}>
            {showTranslation ? '收起译文' : '查看译文'}
          </Text>
        </TouchableOpacity>

        {showTranslation && (
          <View style={styles.translationCard}>
            <Text style={styles.translationTitle}>译文</Text>
            <Text style={styles.translationText}>{currentPoetry.translation}</Text>
            <Text style={[styles.translationTitle, {marginTop: 16}]}>赏析</Text>
            <Text style={styles.translationText}>{currentPoetry.appreciation}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.confirmButton, !voicePassed && styles.confirmButtonDisabled]}
          onPress={handleConfirmRecite}
          disabled={!voicePassed}
        >
          <Text style={styles.confirmButtonText}>
            {voicePassed ? '✓ 确认已背诵' : '请先通过语音识别'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    fontSize: 20,
    color: '#86868B',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  poetryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  poetryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
    textAlign: 'center',
  },
  poetryAuthor: {
    fontSize: 15,
    color: '#86868B',
    textAlign: 'center',
    marginTop: 4,
  },
  poetryContent: {
    fontSize: 20,
    color: '#1D1D1F',
    textAlign: 'center',
    lineHeight: 32,
    marginTop: 20,
  },
  voiceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  voiceTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  voiceStatus: {
    marginTop: 12,
    minHeight: 40,
    justifyContent: 'center',
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    marginRight: 8,
  },
  listeningText: {
    color: '#FF3B30',
    fontSize: 15,
  },
  transcribedText: {
    fontSize: 14,
    color: '#86868B',
  },
  hintText: {
    fontSize: 14,
    color: '#86868B',
  },
  scoreCard: {
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  voiceButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 16,
  },
  micButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonActive: {
    backgroundColor: '#FF3B30',
  },
  micIcon: {
    fontSize: 28,
  },
  stopButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#E5E5E7',
    borderRadius: 8,
  },
  stopText: {
    fontSize: 15,
    color: '#1D1D1F',
  },
  passedBadge: {
    marginTop: 16,
    alignItems: 'center',
  },
  passedText: {
    fontSize: 15,
    color: '#34C759',
    fontWeight: '600',
  },
  translationToggle: {
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  translationToggleText: {
    color: '#007AFF',
    fontSize: 15,
  },
  translationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 20,
  },
  translationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  translationText: {
    fontSize: 15,
    color: '#86868B',
    lineHeight: 24,
    marginTop: 8,
  },
  bottomBar: {
    padding: 16,
    paddingBottom: 34,
    backgroundColor: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  startTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
  },
  startSubtitle: {
    fontSize: 16,
    color: '#86868B',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backText: {
    color: '#007AFF',
    fontSize: 15,
    marginTop: 24,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
  },
  resultEmoji: {
    fontSize: 80,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginTop: 16,
  },
  resultPoints: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 8,
  },
  resultType: {
    fontSize: 17,
    color: '#86868B',
    marginTop: 8,
  },
});