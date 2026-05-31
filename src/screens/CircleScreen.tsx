import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {initialCircles} from '../data/circles';

export function CircleScreen({navigation}: any) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>‹ 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>👥 小圈子</Text>
        <View style={{width: 50}} />
      </View>
      <Text style={styles.headerSubtitle}>加入诗词圈子，与同好一起进步</Text>
      <View style={styles.section}>
        {initialCircles.map(circle => (
          <TouchableOpacity key={circle.id} style={styles.circleCard}>
            <View style={styles.circleIcon}><Text style={styles.circleEmoji}>📚</Text></View>
            <View style={styles.circleInfo}>
              <Text style={styles.circleName}>{circle.name}</Text>
              <Text style={styles.circleDesc}>{circle.description}</Text>
              <Text style={styles.circleMembers}>{circle.memberCount} 成员</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F7'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {fontSize: 17, color: '#007AFF'},
  headerTitle: {fontSize: 17, fontWeight: '600', color: '#1D1D1F'},
  headerSubtitle: {fontSize: 14, color: '#86868B', marginTop: 2, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#FFFFFF'},
  section: {paddingHorizontal: 16, paddingTop: 8},
  circleCard: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12},
  circleIcon: {width: 56, height: 56, borderRadius: 16, backgroundColor: '#F5F5F7', justifyContent: 'center', alignItems: 'center', marginRight: 12},
  circleEmoji: {fontSize: 28},
  circleInfo: {flex: 1},
  circleName: {fontSize: 17, fontWeight: '600', color: '#1D1D1F'},
  circleDesc: {fontSize: 13, color: '#86868B', marginTop: 2},
  circleMembers: {fontSize: 12, color: '#007AFF', marginTop: 4},
});