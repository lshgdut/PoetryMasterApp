import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useAppStore} from '../store/useAppStore';
import {generateLeaderboard} from '../data/circles';
import {LeaderboardEntry} from '../data/types';

export const LeaderboardScreen: React.FC = () => {
  const {userData} = useAppStore();
  const [activeTab, setActiveTab] = useState<'global' | 'circle'>('global');
  
  const globalLeaderboard = generateLeaderboard(userData.totalPoints);

  const renderItem = ({item}: {item: LeaderboardEntry}) => {
    const isCurrentUser = item.userName === '天才';
    
    return (
      <View style={[styles.leaderItem, isCurrentUser && styles.currentUserItem]}>
        <View style={styles.rankBadge}>
          {item.rank <= 3 ? (
            <Text style={styles.topRankText}>{item.rank}</Text>
          ) : (
            <Text style={styles.rankText}>{item.rank}</Text>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, isCurrentUser && styles.currentUserName]}>
            {item.userName}
            {isCurrentUser && ' (你)'}
          </Text>
          <Text style={styles.userPoints}>{item.points} 积分</Text>
        </View>
        {item.rank === 1 && <Text style={styles.trophy}>🏆</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏆 排行榜</Text>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'global' && styles.tabActive]}
          onPress={() => setActiveTab('global')}
        >
          <Text style={[styles.tabText, activeTab === 'global' && styles.tabTextActive]}>
            全站榜
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'circle' && styles.tabActive]}
          onPress={() => setActiveTab('circle')}
        >
          <Text style={[styles.tabText, activeTab === 'circle' && styles.tabTextActive]}>
            圈子榜
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'global' ? globalLeaderboard : globalLeaderboard}
        renderItem={renderItem}
        keyExtractor={item => item.userId}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#E5E5E7',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 15,
    color: '#86868B',
  },
  tabTextActive: {
    color: '#1D1D1F',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  leaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topRankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  rankText: {
    fontSize: 16,
    color: '#86868B',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  currentUserName: {
    color: '#007AFF',
  },
  userPoints: {
    fontSize: 13,
    color: '#86868B',
    marginTop: 2,
  },
  trophy: {
    fontSize: 24,
  },
});