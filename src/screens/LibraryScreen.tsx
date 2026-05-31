import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import {poems} from '../data/poems';

export function LibraryScreen({navigation}: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');

  const categories = ['全部', '唐诗', '宋词', '元曲', '其他'];

  const filteredPoems = poems.filter(p => {
    const matchCategory = activeCategory === '全部' || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) || p.content.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>‹ 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📚 诗词库</Text>
        <View style={{width: 50}} />
      </View>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索诗词、作者…"
            placeholderTextColor="#86868B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <View style={styles.categoriesRow}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
            onPress={() => setActiveCategory(cat)}>
            <Text style={[styles.catChipText, activeCategory === cat && styles.catChipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.resultCount}>共 {filteredPoems.length} 首</Text>
      <ScrollView style={styles.list}>
        {filteredPoems.map(poem => (
          <TouchableOpacity key={poem.id} style={styles.poemCard}>
            <View style={styles.poemHeader}>
              <Text style={styles.poemTitle}>{poem.title}</Text>
              <Text style={styles.poemTag}>{poem.category}</Text>
            </View>
            <Text style={styles.poemAuthor}>{poem.dynasty} · {poem.author}</Text>
            <Text style={styles.poemContent} numberOfLines={2}>{poem.content}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {fontSize: 17, color: '#007AFF'},
  headerTitle: {fontSize: 17, fontWeight: '600', color: '#1D1D1F'},
  searchRow: {paddingHorizontal: 16, paddingTop: 12},
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {fontSize: 15, marginRight: 6},
  searchInput: {flex: 1, fontSize: 15, color: '#1D1D1F', padding: 0},
  searchPlaceholder: {fontSize: 15, color: '#86868B'},
  categoriesRow: {flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, gap: 8},
  catChip: {paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#E5E5E7'},
  catChipActive: {backgroundColor: '#007AFF'},
  catChipText: {fontSize: 13, color: '#86868B'},
  catChipTextActive: {color: '#FFFFFF', fontWeight: '600'},
  resultCount: {fontSize: 13, color: '#86868B', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4},
  list: {flex: 1, paddingHorizontal: 16, paddingTop: 8},
  poemCard: {backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12},
  poemHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  poemTitle: {fontSize: 18, fontWeight: '600', color: '#1D1D1F'},
  poemTag: {fontSize: 12, color: '#007AFF', backgroundColor: '#007AFF20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8},
  poemAuthor: {fontSize: 14, color: '#86868B', marginTop: 4},
  poemContent: {fontSize: 15, color: '#1D1D1F', marginTop: 8, lineHeight: 22},
});