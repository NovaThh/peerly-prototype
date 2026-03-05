import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Request, RequestStatus, RequestType } from '../data/types';

const STORAGE_KEY = 'peerly_requests';

let requests: Request[] = [];

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
  return requests;
}

export function useRequests(): Request[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

//STORAGE
export async function loadRequests() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (raw) {
    requests = JSON.parse(raw);
  }

  emit();
}

async function persist() {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

//ACTIONS
export async function addRequest(request: Request) {
  requests = [...requests, request];
  await persist();
  emit();
}

export async function setRequestStatus(id: string, status: RequestStatus) {
  requests = requests.map((r) =>
    r.id === id ? { ...r, status } : r
  );

  await persist();
  emit();
}

export async function deleteRequest(id: string) {
  requests = requests.filter((r) => r.id !== id);

  await persist();
  emit();
}

export function findRequest(id: string) {
  return requests.find((r) => r.id === id);
}

export function hasPendingBetween(a: string, b: string, type?: RequestType) {
  return requests.some((r) => {
    const samePair =
      (r.requester_id === a && r.receiver_id === b) ||
      (r.requester_id === b && r.receiver_id === a);

    const pending = r.status === 'PENDING';

    const typeOk = type ? r.type === type : true;

    return samePair && pending && typeOk;
  });
}