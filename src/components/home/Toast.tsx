import { useSyncExternalStore } from "react";

import { currentToast, subscribeToast } from "./toastStore";

/** Mount once. Announced politely to screen readers. */
export function Toaster() {
  const message = useSyncExternalStore(subscribeToast, currentToast, () => null);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
      {message && (
        <p key={message.id} className="toast rounded-full bg-foreground px-5 py-3 text-[0.92rem] text-background shadow-[0_14px_34px_-14px_rgb(0_0_0/0.55)]">
          {message.text}
        </p>
      )}
    </div>
  );
}
