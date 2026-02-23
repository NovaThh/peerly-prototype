import { useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FilterToggle, { FilterType } from '../components/FilterToggle';
import UserCard from '../components/UserCard';
import { COLORS } from '@/constants/theme';
import { MOCK_USERS } from '../data/mockUsers';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return MOCK_USERS.filter((user) => {
      if (!query) return true;

      const goodAtMatch = user.strengths.some((s) =>
        s.toLowerCase().includes(query)
      );

      const needHelpMatch = user.needs_help_with.some((s) =>
        s.toLowerCase().includes(query)
      );

      if (!filter) return goodAtMatch || needHelpMatch;
      if (filter === 'GOOD_AT') return goodAtMatch;
      if (filter === 'NEED_HELP') return needHelpMatch;

      return true;
    });
  }, [search, filter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />

      <View style={styles.content}>
        <SearchBar value={search} onChangeText={setSearch} />
        <View style={{ height: 15 }} />
        <FilterToggle value={filter} onChange={setFilter} />
        <View style={{ height: 15 }} />

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator>
          {filteredUsers.length === 0 ? (
            <Text style={styles.noResults}>No results found.</Text>
          ) : (
            filteredUsers.map((u) => (
              <View key={u.id} style={{ marginBottom: 10 }}>
                <UserCard user={u} />
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  noResults: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: 20,
  },
});