/**
 * =====================================================
 * EXPERIMENT 7: Advanced Lists
 * File: screens/ExploreScreen.js
 * Purpose: Advanced list with search and filters
 * Concepts: FlatList, Pagination, Debounce
 * Depends on: Exp6_ApiNetworking, Exp2_FlexboxLayouts
 * =====================================================
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { AppText } from '../Exp1_BasicUI/AppText';
import { AppInput } from '../Exp1_BasicUI/AppInput';
import { GigCard } from '../Exp2_FlexboxLayouts/GigCard';
import { apiClient } from '../Exp6_ApiNetworking/apiClient';
import { theme } from '../shared/theme';

export const ExploreScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [hasMore, setHasMore] = useState(true);

  // Debounce search manually for simplicity
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = async (pageNum = 1, isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await apiClient.get(\`/api/gigs?page=\${pageNum}&limit=10&q=\${debouncedSearch}\`);
      if (res.success) {
        if (res.data.length < 10) setHasMore(false);
        else setHasMore(true);

        if (isRefresh) setData(res.data);
        else setData(prev => [...prev, ...res.data]);
        
        setPage(pageNum);
      }
    } catch (e) {
      console.warn('Explore fetch error', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setHasMore(true);
    fetchData(1, true);
  }, [debouncedSearch]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchData(page + 1);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <AppInput 
        placeholder="Search gigs..." 
        value={search} 
        onChangeText={setSearch} 
      />
      {Platform.OS === 'web' && (
        <TouchableOpacity style={styles.webRefresh} onPress={handleRefresh}>
          <AppText style={{color: '#fff'}}>Refresh (Web)</AppText>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <GigCard gig={item} onPress={() => navigation.navigate('GigDetail', { id: item._id })} />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading && <AppText style={styles.empty}>No results found.</AppText>}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={loading && <ActivityIndicator style={{ margin: 20 }} color={theme.colors.primary} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: theme.spacing.m },
  header: { marginBottom: theme.spacing.m },
  empty: { textAlign: 'center', marginTop: 50 },
  webRefresh: { backgroundColor: theme.colors.primary, padding: 8, borderRadius: 4, alignItems: 'center', marginTop: 8 }
});
