// From Zod Schema
import type { Snack, CartItem } from '../api/schemas';
export type { Snack, CartItem };

// Domain-specific models
export interface CartItemWithDetails extends CartItem {
  snack: Snack;
  lineTotal: number;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface Settings {
  offlineMode: boolean;
  simulateLatency: boolean;
  simulateErrors: boolean;
}

export interface SettingsState extends Settings {
  toggleOfflineMode: () => void;
  toggleSimulateLatency: () => void;
  toggleSimulateErrors: () => void;
}

