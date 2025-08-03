import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../src/components/EmptyState';
import { SnackCard } from '../../src/components/SnackCard';
import { useDebounce } from '../../src/hooks/useDebounce';
import { useSnacks } from '../../src/hooks/useSnacks';

export default function HomeScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useSnacks(debouncedSearchTerm);

  const handleSelectSnack = (id: string) => {
    router.push(`/snack/${id}`);
  };

  if (isLoading && !isRefetching) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search snacks..."
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={setSearchTerm}
          accessibilityLabel="Search snacks input"
        />
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SnackCard snack={item} onPress={handleSelectSnack} />
          )}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={
            <EmptyState
              title="No Snacks Found"
              message="Try adjusting your search or check back later."
            />
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 10,
    color: '#000',
  },
  listContent: {
    flexGrow: 1,
  },
});
