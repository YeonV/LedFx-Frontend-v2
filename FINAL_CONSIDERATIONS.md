# Final Architectural Considerations & Roadmap

## 1. The `HookLoader` Pattern
In `App.tsx`, we introduced a `HookLoader` component to manage hooks that require context from providers defined in the same file (like `WebSocketProvider`). This pattern ensures a clean separation of concerns while satisfying React's context requirements.

## 2. Optimizing High-Frequency Updates (Roadmap)
The performance audit identified high-frequency WebSocket events (visualizer pixels and FFT data) as the primary bottleneck for scalability.

### Proposed Roadmap:
1.  **Binary Protocol Implementation**: Transition `visualisation_update` payloads from JSON to a binary format (MessagePack or raw `ArrayBuffer`).
2.  **Web Worker Integration**: Offload the parsing and data transformation of these binary payloads to a background thread to prevent UI jank.
3.  **Store Decomposition**: Refactor the monolithic Zustand store into specialized slices (e.g., `useDeviceStore`, `useVisualizerStore`) to reduce the overhead of broad state updates.

## 3. `isDisplayMode` Management
The current implementation of `isDisplayMode` via the `useDisplayMode` hook effectively modularizes cleaner UI logic.

**Future Improvement**: Consider a dedicated Layout component pattern for display-specific routes to further decouple conditional logic from the main `Routings` component.

## 4. List Virtualization
As user setups grow, the grid rendering in `/devices` and `/scenes` will eventually require virtualization (e.g., `react-window`) to maintain 60fps performance during scrolling and transitions.
