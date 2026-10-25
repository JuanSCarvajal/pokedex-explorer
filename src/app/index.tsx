import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { registerRootComponent } from 'expo';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';

export default function App() {
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);

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
            onSelectPokemon={(id) => setSelectedPokemonId(id)}
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