// shared/store/auth.ts
import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'peerly_auth';

type AuthState = {
  loggedInUserId: string | null;
  hydrated: boolean; // true after we loaded from storage
};

let state: AuthState = {
  loggedInUserId: null,
  hydrated: false,
};

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useAuth() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// persistence
async function persist() {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ loggedInUserId: state.loggedInUserId })
  );
}

export async function loadAuth() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw) {
    const parsed = JSON.parse(raw) as { loggedInUserId?: string | null };
    state = {
      loggedInUserId: parsed.loggedInUserId ?? null,
      hydrated: true,
    };
  } else {
    state = { ...state, hydrated: true };
  }
  emit();
}

//selectors
export const isLoggedIn = () => state.loggedInUserId !== null;
export const getLoggedInUserId = () => state.loggedInUserId;

// actions
export async function login(userId: string) {
  state = { ...state, loggedInUserId: userId };
  emit();
  await persist();
}

export async function logout() {
  state = { ...state, loggedInUserId: null };
  emit();
  await persist();
}