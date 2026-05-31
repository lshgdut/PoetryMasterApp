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

export function ReciteScreen({navigation}: any) {
  const {
    userData,
    startRecite,
    endRecite,
    addReciteRecord,
    calculatePoints,
  } = useAppStore();

  const [currentPoetry, setCurrentPoetry] = useState<Poetry | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showResult, setShowResult] = useState(false);

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
    setShowResult(false);
    setSimilarityScore(0);
    setVoicePassed(false);
    startRecite(poetry.id);

    const auth = await requestAuth();
    if (!auth) {
      Alert.alert(
        '权限未授权',
        '请在设置中开启语音识别权限',
        [{text: '确定'}],
      );
    }
  };

  const handleStartListening = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  const handleStopAndCheck = async () => {
    await stopListening();
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
    endRecite();
    setShowResult(true);
  };

  if (!currentPoetry) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>背诵诗词</Text>
          <View style={{width: 30}} />
        </View>

        <View style={styles.startCard}>
          <Text style={styles.startEmoji}>🎤</Text>
          <Text style={styles.startTitle}>准备开始背诵</Text>
          <Text style={styles.startHint}>
            系统将随机选取一首诗词，请看着诗词朗读背诵
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartRecite}>
            <Text style={styles.startButtonText}>开始背诵</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {endRecite(); navigation.goBack();}}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>背诵诗词</Text>
        <View style={{width: 30}} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.poetryCard}>
          <Text style={styles.poetryTitle}>{currentPoetry.title}</Text>
          <Text style={styles.poetryAuthor}>
            {currentPoetry.dynasty} · {currentPoetry.author}
          </Text>
          <Text style={styles.poetryContent}>{currentPoetry.content}</Text>

          <TouchableOpacity
            style={styles.translateToggle}
            onPress={() => setShowTranslation(!showTranslation)}>
            <Text style={styles.translateToggleText}>
              {showTranslation ? '🔼 收起译文' : '🔽 查看译文'}
            </Text>
          </TouchableOpacity>

          {showTranslation && (
            <View style={styles.translationBox}>
              <Text style={styles.translationText}>
                {currentPoetry.translation}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.voiceCard}>
          <Text style={styles.voiceTitle}>🎤 语音背诵</Text>

          {transcribedText ? (
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>识别内容：</Text>
              <Text style={styles.transcribedText}>{transcribedText}</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>匹配度：</Text>
                <Text
                  style={[
                    styles.scoreValue,
                    voicePassed ? styles.scorePass : styles.scoreFail,
                  ]}>
                  {Math.round(similarityScore)}%
                </Text>
                {voicePassed && <Text style={styles.passBadge}>✓ 通过</Text>}
              </View>
            </View>
          ) : (
            <Text style={styles.hintText}>
              {isListening ? '🎙️ 正在聆听...' : '点击下方按钮开始朗读诗词'}
            </Text>
          )}

          <View style={styles.voiceButtons}>
            {!transcribedText ? (
              <TouchableOpacity
                style={[styles.micButton, isListening && styles.micButtonActive]}
                onPress={handleStartListening}>
                <Text style={styles.micIcon}>{isListening ? '🔴' : '🎤'}</Text>
              </TouchableOpacity>
            ) : !voicePassed ? (
              <TouchableOpacity
                style={styles.micButton}
                onPress={handleStopAndCheck}>
                <Text style={styles.micIcon}>🔄</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {transcribedText && !voicePassed && (
            <Text style={styles.failHint}>
              匹配度需达到 90% 以上，请重试
            </Text>
          )}
        </View>
      </ScrollView>

      {showResult && (
        <View style={styles.bottomBar}>
          <View style={styles.resultBanner}>
            <Text style={styles.resultBannerText}>
              🎉 背诵成功！+{calculatePoints(currentPoetry.id).points} 积分
            </Text>
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.confirmButtonText}>完成</Text>
          </TouchableOpacity>
        </View>
      )}

      {!showResult && voicePassed && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmRecite}>
            <Text style={styles.confirmButtonText}>✓ 确认背诵</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F7'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {fontSize: 20, color: '#86868B'},
  headerTitle: {fontSize: 17, fontWeight: '600'},
  content: {flex: 1},
  poetryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 24,
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
    lineHeight: 36,
    marginTop: 20,
  },
  translateToggle: {alignItems: 'center', marginTop: 16},
  translateToggleText: {fontSize: 14, color: '#007AFF'},
  translationBox: {
    marginTop: 16,
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
  },
  translationText: {fontSize: 15, color: '#3C3C43', lineHeight: 24},
  voiceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  voiceTitle: {fontSize: 17, fontWeight: '600', color: '#1D1D1F'},
  hintText: {fontSize: 14, color: '#86868B', marginTop: 12},
  resultBox: {marginTop: 12},
  resultLabel: {fontSize: 13, color: '#86868B'},
  transcribedText: {
    fontSize: 15,
    color: '#1D1D1F',
    marginTop: 4,
    lineHeight: 22,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  scoreLabel: {fontSize: 14, color: '#86868B'},
  scoreValue: {fontSize: 20, fontWeight: 'bold', marginLeft: 4},
  scorePass: {color: '#34C759'},
  scoreFail: {color: '#FF3B30'},
  passBadge: {fontSize: 14, color: '#34C759', marginLeft: 8},
  voiceButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  micButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonActive: {backgroundColor: '#FF3B30'},
  micIcon: {fontSize: 28},
  failHint: {fontSize: 13, color: '#FF3B30', textAlign: 'center', marginTop: 8},
  bottomBar: {
    padding: 16,
    paddingBottom: 34,
    backgroundColor: '#FFFFFF',
  },
  resultBanner: {
    backgroundColor: '#34C75920',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  resultBannerText: {fontSize: 16, color: '#34C759', fontWeight: '600'},
  confirmButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {color: '#FFFFFF', fontSize: 17, fontWeight: '600'},
  startCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  startEmoji: {fontSize: 64, marginBottom: 24},
  startTitle: {fontSize: 24, fontWeight: 'bold', color: '#1D1D1F'},
  startHint: {
    fontSize: 15,
    color: '#86868B',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 32,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  startButtonText: {color: '#FFFFFF', fontSize: 18, fontWeight: '600'},
});