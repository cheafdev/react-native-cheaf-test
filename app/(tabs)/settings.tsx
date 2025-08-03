import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { View, Text, StyleSheet, Switch, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCartStore } from '../../src/store/cart.store';
import { useSettingsStore } from '../../src/store/settings.store';

export default function SettingsScreen() {
  const {
    offlineMode,
    simulateLatency,
    simulateErrors,
    toggleOfflineMode,
    toggleSimulateLatency,
    toggleSimulateErrors,
  } = useSettingsStore();

  const { clearCart } = useCartStore();
  const queryClient = useQueryClient();

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'Are you sure you want to clear all cart items and cached data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCart();
            queryClient.invalidateQueries();
            Alert.alert('Data Cleared');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>API Simulation</Text>
      <View style={styles.settingRow}>
        <Text>Simulate Latency (350-800ms)</Text>
        <Switch
          value={simulateLatency}
          onValueChange={toggleSimulateLatency}
          accessibilityLabel="Toggle latency simulation"
        />
      </View>
      <View style={styles.settingRow}>
        <Text>Simulate Random Errors (20% chance)</Text>
        <Switch
          value={simulateErrors}
          onValueChange={toggleSimulateErrors}
          accessibilityLabel="Toggle random error simulation"
        />
      </View>
      <View style={styles.settingRow}>
        <Text>Force Offline Mode</Text>
        <Switch
          value={offlineMode}
          onValueChange={toggleOfflineMode}
          accessibilityLabel="Toggle offline mode"
        />
      </View>

      <Text style={styles.header}>Data Management</Text>
      <Button
        title="Clear Local Data"
        onPress={handleClearData}
        color="red"
        accessibilityLabel="Clear all local data"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
});

