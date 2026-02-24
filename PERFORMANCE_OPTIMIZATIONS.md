# Performance Optimizations Audit - LedFx V2

This document lists prioritized performance optimizations to improve the responsiveness and scalability of the LedFx V2 frontend.

## 1. High Impact

### Binary WebSocket Transfers for Pixel Data
*   **Problem**: Pixel data for visualizers is sent as JSON arrays. Large 2D matrix setups can generate massive JSON payloads that require significant CPU time to stringify (backend) and parse (frontend).
*   **Optimization**: Implement a binary protocol (e.g., raw `Uint8Array`) for `visualisation_update` events.
*   **Expected Gain**: ~50-80% reduction in WebSocket processing overhead and significantly lower memory pressure.

### Web Worker for High-Frequency Events
*   **Problem**: High-frequency events (FFT data, visualizer pixels) are parsed on the main thread, which can cause frame drops in the UI during heavy audio activity.
*   **Optimization**: Offload WebSocket parsing and data transformation for `visualisation_update` and `graph_update` to a dedicated Web Worker.
*   **Expected Gain**: Butter-smooth UI interactions even when multiple high-resolution visualizers are active.

---

## 2. Medium Impact

### Zustand Store Decomposition
*   **Problem**: A single monolithic store increases the complexity of state management and can lead to accidental broad re-renders if selectors are not perfectly tuned.
*   **Optimization**: Split the global store into domain-specific stores (e.g., `useVisualizerStore`, `useDeviceStore`, `useUIStore`).
*   **Expected Gain**: Improved developer experience, easier debugging, and more granular control over component re-renders.

### Virtualized Lists for Devices and Scenes
*   **Problem**: Large LedFx installations with dozens of virtual strips or visualizers suffer from slow page loads and janky scrolling as hundreds of DOM nodes are rendered simultaneously.
*   **Optimization**: Use `react-window` or `react-virtuoso` to virtualize the `Devices` and `Scenes` grids.
*   **Expected Gain**: Near-instantaneous page transitions and 60fps scrolling regardless of the number of devices.

### Throttling Visualizer Updates
*   **Problem**: The backend may send updates faster than the display's refresh rate, or the frontend may try to process updates for visualizers that are not currently visible.
*   **Optimization**: Implement client-side throttling and "visibility-aware" updates (stop processing pixels for visualizers that are off-screen or in a background tab).
*   **Expected Gain**: Significant reduction in idle CPU usage.

---

## 3. Low Impact

### Route-Based Code Splitting
*   **Problem**: The initial JavaScript bundle contains all pages, including heavy ones like `Settings` and `Graph` that are not always used.
*   **Optimization**: Use `React.lazy()` and `Suspense` to load page components on demand.
*   **Expected Gain**: ~20-30% faster initial application load time.

### Component Memoization
*   **Problem**: Deeply nested components (like effect parameter controls) may re-render when unrelated parts of the state change.
*   **Optimization**: Audit and apply `React.memo` to expensive sub-components.
*   **Expected Gain**: Slightly snappier UI transitions.

### Asset Optimization
*   **Problem**: Use of unoptimized images or redundant SVG paths.
*   **Optimization**: Convert static images to WebP and ensure all SVG icons are passed through an optimizer like SVGO.
*   **Expected Gain**: Reduced total download size.
