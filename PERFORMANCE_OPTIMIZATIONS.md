# LedFx Performance Optimizations & Architectural Journey

This document tracks the performance optimizations and structural improvements made to the LedFx application.

## Current State of the Journey

### 1. Root Component De-bloating
- **Pages.tsx**: Extracted high-frequency UI state (widgets, hotkeys, protocols) into modular hooks and a dedicated `FloatingWidgets` component. This prevents the heavy routing logic from re-rendering during simple UI interactions.
- **App.tsx**: Isolated `fpsViewer` and system handlers. The root component is now a pure layout and provider shell.

### 2. High-Frequency State Optimization
- **storeUI.tsx**: Coordinate and slider setters (e.g., `mgX`, `mgY`) now bypass the Immer `produce` cycle, using standard object spreads for immediate performance gains during UI drags.

### 3. IPC & Protocol Modularization
- **useIpcHandlers**: Centralized Electron IPC communication with proper `useEffect` lifecycle management and listener cleanup.
- **useProtocolHandler**: Modularized complex `ledfx://` deep-linking logic, separating it from the application bootstrap flow.

### 4. Hook-based Architecture
- Converted null-rendering components (like `AppSubscriptions`) into semantically correct custom hooks. This streamlines the React Fiber tree and improves debugging clarity.

---

## Prioritized Optimizations List

### High Impact

#### 1. Optimize High-Frequency Visualizer Updates
- **Issue:** `graph_update` events trigger full React re-renders for every FFT frame.
- **Action:** Move FFT handling to a `ref` or WebWorker to bypass the React render cycle for drawing logic.

#### 2. Debounce WebSocket State Broadcasts
- **Issue:** Rapid config changes (sliders) flood the network with WebSocket broadcasts.
- **Action:** Implement debounce on outgoing custom broadcasts.

#### 3. Root Component Re-renders (IMPLEMENTED)
- **Outcome:** Decoupled `App.tsx` and `Pages.tsx` from frequent state updates.

---

## Technical Debt Addressed
- Fixed action label typos in `storeUI.tsx`.
- Resolved potential memory leaks from cumulative IPC listeners.
- Fixed stale closures in global hotkey handlers.

## Documentation
- `ARCHITECTURE_DECISIONS.md`: Rationale for hook placement and logic extraction.
- `HOOK_VS_HOOK_COMPONENT.md`: Deep-dive into hook-based architecture benefits.
- `DETAILS.md`: Refactoring examples for developers.
