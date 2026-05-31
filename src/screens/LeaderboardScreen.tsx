import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {generateLeaderboard} from '../data/circles';
import {useAppStore} from '../store/useAppStore';

export function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<'global' | 'circle'>('global');
  const {userData} = useAppStore();
  const leaderboard = useMemo(
    () => generateLeaderboard(userData.totalPoints),
    [userData.totalPoints],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏆 排行榜</Text>
      </View>
      <View style={styles.tabs}>
        <View style={[styles.tab, activeTab === 'global' && styles.tabActive]}>
          <Text style={[styles.tabText, activeTab === 'global' && styles.tabTextActive]} onPress={() => setActiveTab('global')}>全站榜</Text>
        </View>
        <View style={[styles.tab, activeTab === 'circle' && styles.tabActive]}>
          <Text style={[styles.tabText, activeTab === 'circle' && styles.tabTextActive]} onPress={() => setActiveTab('circle')}>圈子榜</Text>
        </View>
      </View>
      <FlatList
        data={leaderboard}
        keyExtractor={item => item.userId}
        renderItem={({item}) => (
          <View style={[styles.leaderItem, item.userName === '天才' && styles.currentUserItem]}>
            <View style={styles.rankBadge}>
              <Text style={item.rank <= 3 ? styles.topRankText : styles.rankText}>{item.rank}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.userName}{item.userName === '天才' ? ' (你)' : ''}</Text>
              <Text style={styles.userPoints}>{item.points} 积分</Text>
            </View>
            {item.rank === 1 && <Text style={styles.trophy}>🏆</Text>}
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F7'},
  header: {paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20},
  headerTitle: {fontSize: 28, fontWeight: 'bold', color: '#1D1D1F'},
  tabs: {flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#E5E5E7', borderRadius: 10, padding: 4},
  tab: {flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8},
  tabActive: {backgroundColor: '#FFFFFF'},
  tabText: {fontSize: 15, color: '#86868B'},
  tabTextActive: {color: '#1D1D1F', fontWeight: '600'},
  list: {paddingHorizontal: 16, paddingTop: 16},
  leaderItem: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12},
  currentUserItem: {borderWidth: 2, borderColor: '#007AFF'},
  rankBadge: {width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F7', justifyContent: 'center', alignItems: 'center', marginRight: 12},
  topRankText: {fontSize: 18, fontWeight: 'bold', color: '#FF9500'},
  rankText: {fontSize: 16, color: '#86868B'},
  userInfo: {flex: 1},
  userName: {fontSize: 16, fontWeight: '600', color: '#1D1D1F'},
  userPoints: {fontSize: 13, color: '#86868B', marginTop: 2},
  trophy: {fontSize: 24},
});