
import * as db from '../data/seed.json';
import { CartItem, Snack } from '../domain/models';
import { useSettingsStore } from '../store/settings.store';
import { sleep } from '../utils/sleep';
import {
  CheckoutRequestSchema,
  CheckoutResponseSchema,
  SnackSchema,
  SnacksResponseSchema,
} from './schemas';
import { TheMealDBService } from './foodishApi';

/**
 * Simulates network latency and potential random errors based on settings.
 * @throws {Error} Throws a generic error if random errors are enabled and the odds are met.
 */
async function simulateNetworkBehavior() {
  const { simulateLatency, simulateErrors } = useSettingsStore.getState();

  if (simulateLatency) {
    const latency = 350 + Math.random() * 450; // 350ms to 800ms
    await sleep(latency);
  }

  if (simulateErrors && Math.random() < 0.2) {
    // 20% chance of error
    throw new Error('Fake API Error: The server is taking a coffee break.');
  }
}

export const fakeApi = {
  /**
   * Fetches a list of snacks, optionally filtered by a search term.
   * @param params - Optional parameters for the query.
   * @param params.search - A search term to filter snacks by name or description.
   * @returns A promise that resolves to an array of snacks.
   * @throws {ZodError} If the fetched data does not match the schema.
   */
  async listSnacks(params?: { search?: string }): Promise<Snack[]> {
    await simulateNetworkBehavior();

    let snacks = db.snacks;

    if (params?.search) {
      const query = params.search.toLowerCase();
      snacks = snacks.filter(
        s =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      );
    }

    // Fetch real food images from Foodish API
    try {
      const imageMap = await TheMealDBService.preloadImagesForSnacks(
        snacks.map(s => ({ id: s.id, category: s.category }))
      );

      // Update snacks with real images
      const snacksWithImages = snacks.map(snack => ({
        ...snack,
        imageUrl: imageMap[snack.id] || snack.imageUrl // fallback to original if failed
      }));

      return SnacksResponseSchema.parse(snacksWithImages);
    } catch (error) {
      console.warn('Failed to fetch images from Foodish API, using placeholders:', error);
      return SnacksResponseSchema.parse(snacks);
    }
  },

  /**
   * Fetches a single snack by its ID.
   * @param id - The ID of the snack to fetch.
   * @returns A promise that resolves to the snack, or null if not found.
   * @throws {ZodError} If the fetched data does not match the schema.
   */
  async getSnackById(id: string): Promise<Snack | null> {
    await simulateNetworkBehavior();

    const snack = db.snacks.find(s => s.id === id);
    if (!snack) {
      return null;
    }

    // Fetch a real food image for this snack
    try {
      const realImage = await TheMealDBService.getImageForSnackCategory(snack.category);
      const snackWithImage = {
        ...snack,
        imageUrl: realImage
      };
      return SnackSchema.parse(snackWithImage);
    } catch (error) {
      console.warn('Failed to fetch image for snack:', id, error);
      return SnackSchema.parse(snack);
    }
  },

  /**
   * Processes a checkout request.
   * @param cart - An array of cart items to be processed.
   * @returns A promise that resolves to a checkout confirmation.
   * @throws {Error} If the cart is empty.
   * @throws {ZodError} If the cart data or response is invalid.
   */
  async checkout(cart: CartItem[]): Promise<{
    success: boolean;
    transactionId: string;
  }> {
    await simulateNetworkBehavior();

    const validatedCart = CheckoutRequestSchema.parse(cart);

    if (validatedCart.length === 0) {
      throw new Error('Cannot process checkout for an empty cart.');
    }

    // In a real API, this would involve more complex logic like checking stock,
    // processing payment, etc.
    const response = {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };

    return CheckoutResponseSchema.parse(response);
  },
};
