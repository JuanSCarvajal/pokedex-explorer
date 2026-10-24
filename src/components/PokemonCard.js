import React from 'react';
import { Pressable, Text, Image, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/colors';
import { formatId, capitalize } from '../utils/helpers';

export default function PokemonCard({ item, onPress }) {
  // Extraer el ID desde la URL que envía la PokéAPI
  const urlParts = item.url ? item.url.split('/').filter(Boolean) : [];
  const id = item.id || urlParts[urlParts.length - 1];

  // URL directa al sprite oficial del Pokémon
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <Pressable style={styles.card} onPress={() => onPress(id)}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      <Text style={styles.number}>{formatId(id)}</Text>
      <Text style={styles.name}>{capitalize(item.name)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 90,
    height: 90,
  },
  number: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: 'bold',
    marginTop: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
});