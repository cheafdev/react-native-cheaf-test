import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../src/components/EmptyState';
import { QuantityStepper } from '../../src/components/QuantityStepper';
import { useSnacks } from '../../src/hooks/useSnacks';
import { useCartStore } from '../../src/store/cart.store';
import { formatCurrency } from '../../src/utils/currency';
import type { CartItem, Snack } from '../../src/domain/models';

export default function CartScreen() {
  const {
    items,
    updateQuantity,
    getSummary,
    clearCart,
    _hasHydrated,
  } = useCartStore();
  const { data: snacks = [] } = useSnacks(); // Get all snacks for details

  if (!_hasHydrated) {
    return null; // Render nothing until Zustand store is rehydrated
  }

  const summary = getSummary(snacks);
  const cartWithDetails = items
    .map((item: CartItem) => {
      const snack = snacks.find((s: Snack) => s.id === item.snackId);
      return snack ? { ...item, snack } : null;
    })
    .filter(Boolean);

  const handleCheckout = () => {
    Alert.alert(
      'Checkout Mock',
      'This is a mock checkout. In a real app, this would trigger a payment flow.',
      [{ text: 'OK', onPress: () => clearCart() }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={cartWithDetails}
        keyExtractor={item => item!.snackId}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item!.snack.name}</Text>
            <QuantityStepper
              quantity={item!.quantity}
              onIncrement={() => updateQuantity(item!.snackId, item!.quantity + 1)}
              onDecrement={() => updateQuantity(item!.snackId, item!.quantity - 1)}
            />
            <Text style={styles.itemPrice}>
              {formatCurrency(item!.snack.price * item!.quantity)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            title="Your Cart is Empty"
            message="Add some snacks to get started!"
          />
        }
        contentContainerStyle={styles.list}
      />
      {items.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Subtotal: {formatCurrency(summary.subtotal)}
          </Text>
          <Text style={styles.summaryText}>
            Tax (16%): {formatCurrency(summary.tax)}
          </Text>
          <Text style={styles.totalText}>
            Total: {formatCurrency(summary.total)}
          </Text>
          <Button
            title="Checkout"
            onPress={handleCheckout}
            accessibilityLabel="Proceed to checkout"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  list: { flexGrow: 1, paddingTop: 10 },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: { flex: 1, fontSize: 16 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', width: 80, textAlign: 'right' },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  summaryText: { fontSize: 16, marginBottom: 5 },
  totalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
});

