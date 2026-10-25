import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, StyleSheet,} from 'react-native';
import { getPokemonList, getPokemonDetail } from '../services/pokemonApi';
import PokemonCard from '../components/PokemonCard';
import { colors, spacing } from '../constants/colors';

export default function HomeScreen({ onSelectPokemon }) {
  const [searchText, setSearchText] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPokemonList(20, 0, controller.signal);
        setPokemonList(data);
        setOffset(20);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('No se pudo conectar con la PokéAPI. Revisa tu conexión a internet.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadInitialData();
    return () => controller.abort();
  }, []);

  const handleLoadMore = async () => {
    if (loadingMore || isSearching) return;
    setLoadingMore(true);
    try {
      const newData = await getPokemonList(20, offset);
      setPokemonList((prev) => [...prev, ...newData]);
      setOffset((prev) => prev + 20);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    const term = searchText.trim().toLowerCase();
    if (!term) {
      setIsSearching(false);
      const data = await getPokemonList(20, 0);
      setPokemonList(data);
      setOffset(20);
      return;
    }

    setLoading(true);
    setError(null);
    setIsSearching(true);

    try {
      const result = await getPokemonDetail(term);
      setPokemonList([result]);
    } catch (err) {
      if (err.message === 'NOT_FOUND') {
        setError(`No se encontraron resultados para "${searchText}" 🔍`);
      } else {
        setError('Error al realizar la búsqueda. Intenta de nuevo.');
      }
      setPokemonList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>PokéDex Explorer</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Busca por nombre o número..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.center} />
      ) : error ? (
        <Text style={[styles.message, { color: colors.danger }]}>{error}</Text>
      ) : (
        <FlatList
          data={pokemonList}
          keyExtractor={(item) => String(item.id || item.name)}
          numColumns={2}
          renderItem={({ item }) => (
            <PokemonCard
              item={item}
              onPress={(id) => onSelectPokemon(id)}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator style={{ marginVertical: spacing.md }} color={colors.primary} />
            ) : null
          }
          contentContainerStyle={{ paddingBottom: spacing.lg }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  center: {
    marginTop: spacing.lg,
  },
  message: {
    textAlign: 'center',
    marginTop: spacing.lg,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
  },
});