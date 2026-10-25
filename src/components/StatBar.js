import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { capitalize } from '../utils/helpers';
import { colors } from '../constants/colors';

export default function StatBar({ statName, value }) {
  const MAX_STAT = 255;
  const percentage = Math.min((value / MAX_STAT) * 100, 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{capitalize(statName)}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {
    width: 100,
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textMuted,
  },
  value: {
    width: 35,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: 8,
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
});