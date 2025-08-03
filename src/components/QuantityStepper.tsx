import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
}: QuantityStepperProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onDecrement}
        style={styles.button}
        accessibilityLabel="Decrease quantity"
        accessibilityRole="button">
        <MaterialIcons name="remove" size={20} color="#333" />
      </Pressable>
      <Text style={styles.quantityText}>{quantity}</Text>
      <Pressable
        onPress={onIncrement}
        style={styles.button}
        accessibilityLabel="Increase quantity"
        accessibilityRole="button">
        <MaterialIcons name="add" size={20} color="#333" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  button: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
});

