import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useAppStore} from '../store/useAppStore';
import {levels} from '../data/circles';

interface Props {
  navigation: any;
}

export const HomeScreen: React.FC<Props> = ({navigation}) => {
  const {userData} = useAppStore();
  
  const currentLevel = levels.find((l, i) => 
    userData.totalPoints >= l.minPoints && 
    (i === levels.length - 1 || userData.totalPoints < levels[i + 1].minPoints)
  ) || levels[0];
  
  const nextLevel = levels.find(l => l.minPoints > userData.totalPoints);
  
  const progress = nextLevel 
    ? ((userData.totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;
  
  const todayRecites = userData.reciteRecords.filter(r => {
    const today = new Date().toDateString();
    return new Date(r.reciteDate).toDateString() === today;
  }).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>你好，天才 👋</Text>
        <Text style={styles.subtitle}>今天也要继续背诵诗词哦~</Text>
      </View>
      
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userData.totalPoints}</Text>
          <Text style={styles.statLabel}>总积分</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userData.streakDays}</Text>
          <Text style={styles.statLabel}>连续天数</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{todayRecites}</Text>
          <Text style={styles.statLabel}>今日背诵</Text>
        </View>
      </View>
      
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelEmoji}>{currentLevel.emoji}</Text>
          <View>
            <Text style={styles.levelName}>{currentLevel.name}</Text>
            <Text style={styles.levelInfo}>等级 {currentLevel.level}/10</Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {width: `${progress}%`}]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
        {nextLevel && (
          <Text style={styles.nextLevelText}>
            再获取 {nextLevel.minPoints - userData.totalPoints} 积分可升级为 {nextLevel.name}
          </Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.reciteButton}
        onPress={() => navigation.navigate('Recite')}
      >
        <Text style={styles.reciteButtonText}>🎤 开始背诵</Text>
      </TouchableOpacity>
      
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Library')}
        >
          <Text style={styles.actionEmoji}>📚</Text>
          <Text style={styles.actionTitle}>诗词库</Text>
          <Text style={styles.actionSubtitle}>查看全部诗词</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Circle')}
        >
          <Text style={styles.actionEmoji}>👥</Text>
          <Text style={styles.actionTitle}>小圈子</Text>
          <Text style={styles.actionSubtitle}>加入讨论</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.leaderboardButton}
        onPress={() => navigation.navigate('Leaderboard')}
      >
        <Text style={styles.leaderboardText}>🏆 查看排行榜</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
  },
  subtitle: {
    fontSize: 16,
    color: '#86868B',
    marginTop: 4,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 13,
    color: '#86868B',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E7',
    marginVertical: 8,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  levelName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  levelInfo: {
    fontSize: 14,
    color: '#86868B',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5E7',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  nextLevelText: {
    fontSize: 13,
    color: '#86868B',
    marginTop: 8,
  },
  reciteButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reciteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#86868B',
    marginTop: 2,
  },
  leaderboardButton: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  leaderboardText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});