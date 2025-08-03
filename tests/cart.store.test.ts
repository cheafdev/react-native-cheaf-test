import { act, renderHook } from '@testing-library/react-native';

import { useCartStore } from '../src/store/cart.store';

describe('B2: Cart Store Race Condition', () => {
  beforeEach(() => {
    // Reset the store before each test
    act(() => {
      useCartStore.getState().clearCart();
    });
  });

  it('should create duplicate items when addItem is called rapidly', () => {
    const { result } = renderHook(() => useCartStore());

    // Simulate rapid calls to addItem
    act(() => {
      result.current.addItem('1');
      result.current.addItem('1');
    });

    // Due to the race condition bug, the items array will contain two separate
    // entries for snack '1' instead of one entry with quantity 2.
    const cartItems = result.current.items;
    expect(cartItems.length).toBe(2); // Fails, should be 1
    expect(cartItems[0]?.quantity).toBe(1); // Fails, should be 2
  });
});

