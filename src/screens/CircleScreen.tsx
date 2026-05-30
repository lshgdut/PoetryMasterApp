import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {initialCircles} from '../data/circles';

export const CircleScreen: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👥 小圈子</Text>
        <Text style={styles.headerSubtitle}>加入诗词圈子，与同好一起进步</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>推荐圈子</Text>
        {initialCircles.map(circle => (
          <TouchableOpacity
            key={circle.id}
            style={styles.circleCard}
            onPress={() => navigation.navigate('CircleDetail', {circle})}
          >
            <View style={styles.circleIcon}>
              <Text style={styles.circleEmoji}>📚</Text>
            </View>
            <View style={styles.circleInfo}>
              <Text style={styles.circleName}>{circle.name}</Text>
              <Text style={styles.circleDesc}>{circle.description}</Text>
              <Text style={styles.circleMembers}>{circle.memberCount} 成员</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity
        style={styles.myCircleButton}
        onPress={() => navigation.navigate('CircleDetail', {circle: initialCircles[0]})}
      >
        <Text style={styles.myCircleText}>进入我的圈子</Text>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#86868B',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  circleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  circleIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  circleEmoji: {
    fontSize: 28,
  },
  circleInfo: {
    flex: 1,
  },
  circleName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  circleDesc: {
    fontSize: 13,
    color: '#86868B',
    marginTop: 2,
  },
  circleMembers: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  arrow: {
    fontSize: 24,
    color: '#C7C7CC',
  },
  myCircleButton: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  myCircleText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});