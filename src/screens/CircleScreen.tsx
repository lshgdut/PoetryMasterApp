import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {initialCircles} from '../data/circles';

export function CircleScreen({navigation}: any) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👥 小圈子</Text>
        <Text style={styles.headerSubtitle}>加入诗词圈子，与同好一起进步</Text>
      </View>
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
  header: {paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20},
  headerTitle: {fontSize: 28, fontWeight: 'bold', color: '#1D1D1F'},
  headerSubtitle: {fontSize: 15, color: '#86868B', marginTop: 4},
  section: {paddingHorizontal: 16},
  circleCard: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12},
  circleIcon: {width: 56, height: 56, borderRadius: 16, backgroundColor: '#F5F5F7', justifyContent: 'center', alignItems: 'center', marginRight: 12},
  circleEmoji: {fontSize: 28},
  circleInfo: {flex: 1},
  circleName: {fontSize: 17, fontWeight: '600', color: '#1D1D1F'},
  circleDesc: {fontSize: 13, color: '#86868B', marginTop: 2},
  circleMembers: {fontSize: 12, color: '#007AFF', marginTop: 4},
});