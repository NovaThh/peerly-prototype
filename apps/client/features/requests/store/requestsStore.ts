import { useSyncExternalStore } from 'react';
import {
  MOCK_REQUESTS,
  type Request,
  type RequestStatus,
} from '../data/mockRequests';

// internal state
let requests: Request[] = [...MOCK_REQUESTS];

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return requests;
}

// public hook 
export function useRequests(): Request[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// actions used by both list + profile
export function setRequestStatus(id: string, status: RequestStatus) {
  requests = requests.map((r) => (r.id === id ? { ...r, status } : r));
  emit();
}

export function deleteRequest(id: string) {
  requests = requests.filter((r) => r.id !== id);
  emit();
}