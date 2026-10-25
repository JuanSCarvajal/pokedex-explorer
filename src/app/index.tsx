import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';

export default function App() {
  // Especificamos que puede ser number, string o null
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | string | null>(null);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {selectedPokemonId ? (
          <DetailScreen
            pokemonId={selectedPokemonId}
            onBack={() => setSelectedPokemonId(null)}
          />
        ) : (
          <HomeScreen
            onSelectPokemon={(id: number | string) => setSelectedPokemonId(id)}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});