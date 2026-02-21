# Visualiser Context

## Overview
The audio visualiser in this project is a dynamic module (`yz-audio-visualiser.js`) loaded at runtime. It provides complex audio visualisations that are highly configurable and reactive to audio data from the backend.

## Loading Mechanism
The visualiser is loaded using the `useDynamicModule` hook in `src/components/AudioVisualiser/AudioVisualiser.tsx`.
- **Source**: `/modules/yz-audio-visualiser.js`
- **Export Name**: `YzAudioVisualiser`
- **Component**: The default export from the module is the `AudioVisualiser` component itself.

When the module status becomes `'available'`, `visualizerInitialized` is set to `true` in the global `useStore`. This flag is used by other components (like `VisualizerCard` and `VisualizerDevWidgetYZ`) to decide when to render visualiser-related UI.

## Store Architecture: `useStore` vs `useVStore`
The application uses two distinct state management systems:

1.  **`useStore` (Global Store)**:
    - This is the main Zustand store for the entire application (`src/store/useStore.ts`).
    - It manages core application state: devices, virtuals, clients, UI settings, and features.
    - **Optimistic State**: `storeVisualizerConfigOptimistic.ts` tracks the predicted state of multiple visualiser instances. To prevent pollution, it only maintains the configuration for the *currently active* visualizer type for each client.

2.  **`useVStore` (Visualiser Store)**:
    - This hook (`src/hooks/vStore.ts`) provides access to the internal state of the dynamically loaded `YzAudioVisualiser` module.
    - It works by accessing `(window as any).YzAudioVisualiser.useStore`.
    - It manages visualiser-specific state: current visual type, playback status, effects enabled, and configurations for individual visualizers.
    - If the module is not yet loaded, `useVStore` returns `undefined`.

## Communication and Control
- **Dynamic Module Interface**: The `AudioVisualiser` component receives props like `theme`, `effects` (schemas), and `backendAudioData`.
- **Window API**: The module exposes an imperative API via `window.visualiserApi` for functions like `toggleFullscreen`, `getVisualizerRegistry`, etc.
- **WebSocket Synchronization**: `VisualiserWsControl.tsx` handles synchronizing the visualiser state across different clients. It uses a scoped `configs` map in its broadcast payload to ensure that only relevant configuration data is transmitted and stored on remote clients.
- **Optimistic UI**: Individual cards and the developer widget use the optimistic store to provide immediate feedback, ensuring that changes are reflected locally before the round-trip through the visualiser's WebSocket state update loop.
