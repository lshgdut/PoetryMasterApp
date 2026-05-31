import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {poems} from '../data/poems';

export function LibraryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 诗词库</Text>
        <Text style={styles.headerSubtitle}>共 {poems.length} 首诗词</Text>
      </View>
      <ScrollView style={styles.list}>
        {poems.map(poem => (
          <View key={poem.id} style={styles.poemCard}>
            <View style={styles.poemHeader}>
              <Text style={styles.poemTitle}>{poem.title}</Text>
              <Text style={styles.poemTag}>{poem.category}</Text>
            </View>
            <Text style={styles.poemAuthor}>{poem.dynasty} · {poem.author}</Text>
            <Text style={styles.poemContent} numberOfLines={2}>{poem.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F7'},
  header: {paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20},
  headerTitle: {fontSize: 28, fontWeight: 'bold', color: '#1D1D1F'},
  headerSubtitle: {fontSize: 15, color: '#86868B', marginTop: 4},
  list: {flex: 1, paddingHorizontal: 16},
  poemCard: {backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12},
  poemHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  poemTitle: {fontSize: 18, fontWeight: '600', color: '#1D1D1F'},
  poemTag: {fontSize: 12, color: '#007AFF', backgroundColor: '#007AFF20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8},
  poemAuthor: {fontSize: 14, color: '#86868B', marginTop: 4},
  poemContent: {fontSize: 15, color: '#1D1D1F', marginTop: 8, lineHeight: 22},
});