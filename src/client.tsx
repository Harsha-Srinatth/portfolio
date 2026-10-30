import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>,
    );
  });
}

// The first paint comes first: the copy and the loading animation are already
// in the HTML, so they should not wait for the scripts to start up. (A tab in
// the background draws no frames, so it does not wait.)
if (document.visibilityState === "visible") requestAnimationFrame(() => setTimeout(hydrate));
else hydrate();
