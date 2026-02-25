# LedFx V2 Performance Optimization Audit

This document outlines prioritized performance optimizations to improve the responsiveness, scalability, and efficiency of the LedFx V2 frontend.

## 1. High Impact

### Debounce Visualizer State Broadcasts
*   **Location**: `src/components/AudioVisualiser/VisualiserWsControl.tsx`
*   **Problem**: The `useEffect` hook broadcasts the entire visualizer state whenever a dependency (like `butterchurnConfig`) changes. During slider drags, this can trigger dozens of WebSocket messages per second, flooding the network and lagging other clients.
*   **Optimization**: Implement a debounce (e.g., 100ms) on the broadcast call. Only send the "final" state after the user stops interacting with the UI.
*   **Expected Gain**: Significant reduction in WebSocket traffic and improved network stability for multi-client setups.

### Binary Protocol for High-Resolution Visualizers
*   **Problem**: `visualisation_update` events (pixel data) are currently sent as JSON. For large 2D matrices (e.g., 64x64), the JSON payload is huge and requires expensive parsing on the main thread.
*   **Optimization**: Transition to a binary format (e.g., `Uint8Array` or MessagePack) for pixel data.
*   **Expected Gain**: ~70% reduction in data size and significantly lower CPU usage during visualizer rendering.

### Offload FFT/Pixel Parsing to Web Workers
*   **Problem**: High-frequency WebSocket data (FFT from `graph_update` and pixels from `visualisation_update`) is parsed and transformed on the main thread, causing frame drops.
*   **Optimization**: Use a Web Worker to handle incoming WebSocket messages, parse the data, and only post the final transformed result to the main thread for rendering.
*   **Expected Gain**: Locked 60fps UI even with complex visualizations active.

---

## 2. Medium Impact

### List Virtualization for Devices and Scenes
*   **Location**: `src/pages/Devices/Devices.tsx`
*   **Problem**: The application renders the entire list of devices and visualizers into the DOM. For users with 50+ devices, this results in slow initial renders and janky scrolling.
*   **Optimization**: Implement `react-window` or `react-virtuoso` to only render the cards visible in the viewport.
*   **Expected Gain**: Near-instant page loads and butter-smooth scrolling for large setups.

### Efficient Store Updates for High-Frequency Actions
*   **Location**: `src/store/ui/storeUI.tsx`
*   **Problem**: Using Immer's `produce` for every small state change (like slider positions or window coordinates) adds measurable overhead during high-frequency interactions.
*   **Optimization**: Continue the migration to shallow object spreads (`...state`) for coordinate/slider setters to bypass Immer's proxy creation.
*   **Expected Gain**: Snappier, more responsive UI interactions during drags.

### Refactor Inefficient Helper Functions
*   **Location**: `src/utils/helpers.ts`
*   **Problem**: Functions like `filterKeys` use `JSON.parse(JSON.stringify(obj))` for cloning, which is notoriously slow. `deepEqual` is a custom recursive implementation that could be replaced by more optimized alternatives.
*   **Optimization**: Use modern destructuring for filtering (`const { keyToDrop, ...rest } = obj`) and consider specialized libraries or native `structuredClone` for deep copying.
*   **Expected Gain**: Faster data processing across the entire app.

---

## 3. Low Impact

### Asset Optimization & Removal
*   **Action**: Completely removed `WaveLines` feature which carried heavy SVG/JS overhead.
*   **Optimization**: Audit other non-critical seasonal features and ensure they are only loaded when active. Optimize static assets (WebP/SVGO).
*   **Expected Gain**: Reduced initial bundle size and lower memory baseline.

### Route-Based Code Splitting
*   **Problem**: The main bundle includes code for all pages (Settings, Graph, User, etc.).
*   **Optimization**: Use `React.lazy` for top-level page components in `Pages.tsx`.
*   **Expected Gain**: 20% faster "Time to Interactive" on the first load.
