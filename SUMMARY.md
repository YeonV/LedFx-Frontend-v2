# LedFx V2 Performance & Architecture Optimization Summary

This document recaps the optimizations and architectural improvements implemented in this cycle.

## Accomplishments

### 1. Performance Audit & Optimization
*   **Audit**: Conducted a deep-dive scan of the application performance, identifying 8 prioritized areas for improvement.
*   **Store Optimization**: Optimized high-frequency store updates (e.g., coordinate/slider setters) in `storeUI.tsx` by replacing Immer `produce` with shallow object spreads, reducing CPU overhead during UI interactions.
*   **Redundancy Removal**: Eliminated the performance-heavy `WaveLines` feature and its associated assets to lean out the bundle and runtime memory footprint.

### 2. Architectural Refactoring
*   **Modular Hooks**: Debloated monolithic root components (`App.tsx`, `Pages.tsx`) by migrating complex logic into custom hooks:
    *   `useAppSubscriptions`: WebSocket event management.
    *   `useIpcHandlers`: Electron IPC communication.
    *   `useProtocolHandler`: Deep-link processing.
    *   `useAppHotkeys`: Keyboard shortcut consolidation.
    *   `useDisplayMode`: OBS-friendly UI logic.
*   **Component Extraction**: Isolated UI elements into specialized wrappers and sub-pages:
    *   `FloatingWidgets.tsx`
    *   `MainContentWrapper.tsx`
    *   `AppStyles.tsx`
    *   `SpecialEvents.tsx`
*   **HookLoader Pattern**: Resolved React context violations by introducing a `HookLoader` component, ensuring hooks consuming WebSocket context are called within the provider tree.

### 3. Documentation & Roadmap
*   **Performance Report**: Created `PERFORMANCE_OPTIMIZATIONS.md` with a detailed roadmap for future high-impact gains (Binary transfers, Web Workers).
*   **Developer Documentation**: Integrated documentation into the `src/hooks` directory and updated `FINAL_CONSIDERATIONS.md` to guide future development.

## Impact
The application is now more modular, easier to maintain, and has lower CPU overhead during UI interactions. The foundation has been laid for scaling to larger device matrices via the proposed roadmap items.
# Architectural Decisions Summary

This document explains the technical reasons behind using specific patterns for integrating the dynamic Audio Visualiser module into the LedFx Frontend.

## 1. Using `getVStore()` instead of `useVStore()`

### Why `getVStore()`?
The application uses **Zustand** for state management. While `useVStore()` is a React hook used for *reactive* state access within components, `getVStore()` provides *imperative* access to the store's underlying API via `getVStore().getState()`.

*   **Context Independence**: `getVStore()` can be called outside of React components or hooks where the React Context or lifecycle is unavailable (e.g., inside WebSocket event listeners, utility functions, or `setTimeout` callbacks).
*   **Race Condition Prevention**: In event-driven logic (like Spotify track changes), relying on the reactive state of a hook inside an asynchronous callback can lead to "stale closures." `getVStore().getState()` always returns the most current value at the exact moment of execution. This was crucial for fixing the "fire after stop" bug in the Song Detector.
*   **Performance**: It avoids triggering re-renders in the parent component when the logic only needs to read a value or dispatch an action without needing to update the UI immediately.

### Alternative Approaches
*   **Passing State as Arguments**: Passing the current state value into the asynchronous function.
    *   *Drawback*: If the state changes while the async function is waiting (e.g., during a `setTimeout`), the function will operate on outdated data.
*   **Refs (`useRef`)**: Storing the state in a ref that is updated on every render.
    *   *Drawback*: Requires manual synchronization and bloats component logic. `getVStore()` is cleaner and directly accesses the source of truth.

---

## 2. Using `(window as any).visualiserApi`

### Why `window.visualiserApi`?
The Audio Visualiser is a **dynamic module** loaded at runtime. It is not part of the main application bundle to keep the initial load size small and allow for independent updates.

*   **Runtime Discovery**: Since the module is loaded via a dynamic script tag, its internal functions and registry are exposed to the main application through a global object on the `window`.
*   **Decoupling**: The main Frontend does not need to know the internal implementation details of the Visualiser at build time. It only needs to know the contract (API) provided by `visualiserApi`.
*   **Polymorphic Property Discovery**: It allows the Frontend to query the `getVisualizerRegistry()` or fetch `getUISchema()` for effects. This enables the "active" visualizer sync logic to filter properties dynamically based on what the current effect actually supports.

### Alternative Approaches
*   **Dynamic Imports (`import()`)**: Using ES Modules to load the code dynamically.
    *   *Drawback*: Requires the module to be compatible with the build system's code-splitting (Vite/Webpack) and can be difficult to manage when the module is served from a different origin or path at runtime.
*   **Custom Event API**: Communicating with the module via `window.dispatchEvent`.
    *   *Drawback*: One-way communication makes it difficult to retrieve return values (like the Registry) synchronously.
*   **Module Federation**: Using advanced build tools to share code between applications.
    *   *Drawback*: High configuration overhead and requires both repositories to use perfectly compatible build tool versions.

---

## Conclusion
The combination of `getVStore` and `window.visualiserApi` provides a flexible, performant, and decoupled way to manage a complex, multi-repo architecture where components and logic must interact across dynamic boundaries.
