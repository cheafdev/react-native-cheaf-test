import { act, renderHook } from '@testing-library/react-native';
// Mock dependencies
import { useCartStore } from '../src/store/cart.store';
import { formatCurrency } from '../src/utils/currency';
import { MOCK_SNACKS } from './_mocks';

describe('B1: Currency and Totals', () => {
  it('should calculate cart totals with precision errors due to lack of rounding', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      // Add items that will cause floating point issues
      result.current.addItem('1'); // $3.49
      result.current.addItem('2'); // $2.99
    });

    const summary = result.current.getSummary(MOCK_SNACKS);

    // This is the buggy result without rounding
    const expectedSubtotal = 6.48;
    const expectedTax = 1.0368; // 6.48 * 0.16
    const expectedTotal = 7.5168; // 6.48 + 1.0368

    expect(summary.subtotal).toBe(expectedSubtotal);
    expect(summary.tax).toBe(expectedTax);
    expect(summary.total).toBe(expectedTotal);

    // This is what the test SHOULD assert after the bug is fixed.
    // The candidate needs to apply rounding to make this pass.
    // expect(summary.tax).toBe(roundMoney(expectedTax));
    // expect(summary.total).toBe(roundMoney(expectedTotal));
  });
});

