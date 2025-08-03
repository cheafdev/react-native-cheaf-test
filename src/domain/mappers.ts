import { Snack, CartItem, CartItemWithDetails } from './models';

// This is a stub. Implementation will be added in a future step.
export function mapCartItemsToDetails(
  items: CartItem[],
  snacks: Snack[]
): CartItemWithDetails[] {
  const snackMap = new Map(snacks.map(s => [s.id, s]));
  return items
    .map(item => {
      const snack = snackMap.get(item.snackId);
      if (!snack) return null;
      return {
        ...item,
        snack,
        lineTotal: item.quantity * snack.price,
      };
    })
    .filter((i): i is CartItemWithDetails => i !== null);
}

