# LedFx Performance Optimizations

This document lists potential performance optimizations for the LedFx codebase, sorted by their estimated impact.

## High Impact

### 1. Optimize High-Frequency Visualizer Updates
- **Issue:** In `src/components/AudioVisualiser/AudioVisualiser.tsx`, the `graph_update` subscription updates the local `audioData` state via `setAudioData([...messageData.melbank])`. This happens many times per second (at the audio sampling/FFT rate), triggering a full re-render of the `Visualiser` component and the dynamic `AudioVisualiser` module every frame.
- **Action:**
    - Use a `ref` to store audio data and access it directly in the animation loop of the visualizer if possible.
    - Alternatively, throttle the state updates to match the screen refresh rate (e.g., using `requestAnimationFrame`).
    - Move audio data handling into a WebWorker or a dedicated store with specialized subscription logic.

### 2. Debounce WebSocket State Broadcasts
- **Issue:** `src/components/AudioVisualiser/VisualiserWsControl.tsx` sends a `state-update` broadcast via WebSocket whenever `visualType`, `butterchurnConfig`, or `visualizerConfigs` change. During slider drags or rapid configuration changes, this spams the WebSocket and the network.
- **Action:** Wrap the broadcast logic in a `useDebounce` hook or a similar mechanism to ensure updates are only sent after a short period of inactivity (e.g., 100-250ms).

### 3. Decompose the Massive Zustand Store
- **Issue:** The global store in `src/store/useStore.ts` combines dozens of sub-stores. While Zustand is efficient, such a large combined state makes it easier for developers to accidentally trigger wide-reaching re-renders by selecting too much state or not using granular selectors.
- **Action:**
    - Split the store into smaller, independent stores (e.g., `useUIStore`, `useDeviceStore`, `useVisualizerStore`).
    - Enforce the use of granular selectors in all components.

### 4. Optimize Root Component Re-renders
- **Issue:** `App.tsx` and `Pages.tsx` select many top-level state slices. Changes in UI state (like `keybinding`, `mp`, `fpsViewer`) trigger re-renders of these large components, which then cascade down the entire tree.
- **Action:**
    - Extract sub-components that depend on specific state slices so that only those sub-components re-render.
    - Use `React.memo` for heavy child components to prevent unnecessary re-renders when the parent re-renders.

---

## Medium Impact

### 5. Replace Immer for High-Frequency Store Updates
- **Issue:** Actions like `setMgX`, `setMgY`, `setSdX`, etc., in `src/store/ui/storeUI.tsx` use `produce` (Immer). While convenient, Immer has a performance overhead that becomes noticeable during high-frequency updates like dragging widgets.
- **Action:** Use standard shallow object spreads for these specific high-frequency setters instead of `produce`.

### 6. Asset Optimization (WebP & Compression)
- **Issue:** Background assets like `src/assets/xmas.png` (644K) and `src/assets/fireworks.jpg` (415K) are relatively large and in unoptimized formats.
- **Action:**
    - Convert all static images to WebP format.
    - Use image compression tools to reduce the file size without significant quality loss.

### 7. Consolidate Routing
- **Issue:** `src/pages/Pages.tsx` appears to instantiate both a `HashRouter` and a `BrowserRouter`. This is redundant and adds unnecessary overhead to the React tree.
- **Action:** Determine if `BrowserRouter` is actually needed (likely for a specific callback) and consolidate or isolate it to prevent multiple router contexts from coexisting.

### 8. Fix Component-in-Component Definitions
- **Issue:** `AppSubscriptions` is defined inside the `App` component function in `src/App.tsx`. This causes the component to be re-created on every render of `App`.
- **Action:** Move `AppSubscriptions` outside of the `App` component or convert it to a custom hook (`useAppSubscriptions`).

---

## Low Impact

### 9. Lazy Loading of Pages
- **Issue:** Most pages are imported directly in `Pages.tsx`, meaning they are all bundled and loaded upfront.
- **Action:** Use `React.lazy` and `Suspense` to load pages like `Settings`, `Integrations`, or `User` only when the user navigates to them.

### 10. Simplify WaveLines Animation
- **Issue:** `WaveLines` uses complex SVG `<animate>` tags with many path values. While usually hardware-accelerated, it can be heavy on CPU-only or low-end environments.
- **Action:** Consider using CSS animations for the paths or simplifying the number of animation frames in the `values` attribute.
