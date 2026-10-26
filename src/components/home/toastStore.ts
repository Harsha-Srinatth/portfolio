/**
 * A tiny toast store: call `toast("message")` from anywhere; <Toaster />
 * (Toast.tsx) shows it. One message at a time, gone after a couple of seconds.
 */

export type ToastMessage = { id: number; text: string };

let current: ToastMessage | null = null;
let timer: number | undefined;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(text: string, ms = 2400) {
  window.clearTimeout(timer);
  current = { id: (current?.id ?? 0) + 1, text };
  emit();
  timer = window.setTimeout(() => {
    current = null;
    emit();
  }, ms);
}

export const subscribeToast = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const currentToast = () => current;
