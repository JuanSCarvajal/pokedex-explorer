import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { getPokemonDetail } from '../services/pokemonApi';
import { colors, spacing, TYPE_COLORS } from '../constants/colors';
import { formatId, capitalize } from '../utils/helpers';
import StatBar from '../components/StatBar';

export default function DetailScreen({ pokemonId, onBack }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        const data = await getPokemonDetail(pokemonId, controller.signal);
        setPokemon(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          Alert.alert('Error', 'No se pudo cargar la información del Pokémon.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, [pokemonId]);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />;
  }

  if (!pokemon) {
    return <Text style={styles.empty}>Pokémon no encontrado.</Text>;
  }

  const heightM = (pokemon.height / 10).toFixed(1);
  const weightKg = (pokemon.weight / 10).toFixed(1);
  const imageUri = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.navRow}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Volver a la lista</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        <Text style={styles.number}>{formatId(pokemon.id)}</Text>
        <Text style={styles.title}>{capitalize(pokemon.name)}</Text>

        <View style={styles.typesRow}>
          {pokemon.types.map((t) => {
            const typeName = t.type.name;
            const bg = TYPE_COLORS[typeName] || TYPE_COLORS.default;
            return (
              <View key={typeName} style={[styles.badge, { backgroundColor: bg }]}>
                <Text style={styles.badgeText}>{capitalize(typeName)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.measuresRow}>
          <View style={styles.measureBox}>
            <Text style={styles.measureVal}>{heightM} m</Text>
            <Text style={styles.measureLabel}>Altura</Text>
          </View>
          <View style={styles.measureBox}>
            <Text style={styles.measureVal}>{weightKg} kg</Text>
            <Text style={styles.measureLabel}>Peso</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Estadísticas Base</Text>
        <View style={styles.statsBox}>
          {pokemon.stats.map((s) => (
            <StatBar key={s.stat.name} statName={s.stat.name} value={s.base_stat} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navRow: {
    padding: spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colors.card,
    margin: spacing.md,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 180,
  },
  number: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 4,
  },
  typesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  measuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  measureBox: {
    alignItems: 'center',
  },
  measureVal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  measureLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    color: colors.primaryDark,
  },
  statsBox: {
    width: '100%',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textMuted,
  },
});