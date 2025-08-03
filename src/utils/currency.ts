/**
 * A fixed tax rate of 16%.
 */
export const TAX_RATE = 0.16;

/**
 * Correctly rounds a number to two decimal places for currency calculations.
 * @param amount - The number to round.
 * @returns The rounded number.
 */
export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Formats a raw number into a US dollar currency string.
 * @param amount - The number to format.
 * @returns A formatted currency string (e.g., "$12.34").
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

