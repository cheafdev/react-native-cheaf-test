import { create } from 'zustand';
import { SettingsState } from '../domain/models';

interface SettingsStore extends SettingsState {
  // All methods are already defined in SettingsState
}

export const useSettingsStore = create<SettingsStore>()((set) => ({
  offlineMode: false,
  simulateLatency: false,
  simulateErrors: false,
  toggleOfflineMode: () =>
    set((state) => ({ offlineMode: !state.offlineMode })),
  toggleSimulateLatency: () =>
    set((state) => ({ simulateLatency: !state.simulateLatency })),
  toggleSimulateErrors: () =>
    set((state) => ({ simulateErrors: !state.simulateErrors })),
}));
