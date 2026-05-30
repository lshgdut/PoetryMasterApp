import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {poems} from '../data/poems';
import {Poetry} from '../data/types';

export const LibraryScreen: React.FC = () => {
  const renderPoemItem = ({item}: {item: Poetry}) => (
    <View style={styles.poemCard}>
      <View style={styles.poemHeader}>
        <Text style={styles.poemTitle}>{item.title}</Text>
        <Text style={styles.poemTag}>{item.category}</Text>
      </View>
      <Text style={styles.poemAuthor}>{item.dynasty} · {item.author}</Text>
      <Text style={styles.poemContent} numberOfLines={2}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 诗词库</Text>
        <Text style={styles.headerSubtitle}>共 {poems.length} 首诗词</Text>
      </View>
      <FlatList
        data={poems}
        renderItem={renderPoemItem}
        keyExtractor={item => item.id}
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
  headerSubtitle: {
    fontSize: 15,
    color: '#86868B',
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  poemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  poemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  poemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  poemTag: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#007AFF20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  poemAuthor: {
    fontSize: 14,
    color: '#86868B',
    marginTop: 4,
  },
  poemContent: {
    fontSize: 15,
    color: '#1D1D1F',
    marginTop: 8,
    lineHeight: 22,
  },
});