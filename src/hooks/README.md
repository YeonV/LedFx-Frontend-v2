# Application Hooks

This directory contains custom React hooks that modularize application logic, decoupling it from the root components (`App.tsx` and `Pages.tsx`).

## Core Application Hooks

### 1. `useAppSubscriptions`
- **Purpose**: Manages global WebSocket event listeners (messages, scenes, song detection).
- **Usage**: Called within the `HookLoader` in `App.tsx` to ensure it has access to the `WebSocketProvider` context.

### 2. `useIpcHandlers`
- **Purpose**: Manages communication with the Electron main process via `window.api.receive`.
- **Benefit**: Decouples the root `App` component from low-level system events.

### 3. `useProtocolHandler`
- **Purpose**: Handles `ledfx://` protocol deep-links, including parsing for the song detector and integration callbacks.

### 4. `useAppHotkeys`
- **Purpose**: Consolidates all global keyboard shortcuts.
- **Implementation**: Uses `useStore.getState()` for hotkey handlers to prevent stale closures and unnecessary re-renders in the main `Pages.tsx` component.

### 5. `useDisplayMode`
- **Purpose**: Monitors URL parameters for "display mode" (OBS-friendly UI) and applies relevant CSS classes and client identity updates.

### 6. `useElectronProtocol`
- **Purpose**: Specific handling for Electron-related protocol events.

## Why Hooks?
Moving logic into hooks improves **maintainability**, **testability**, and **performance** by:
- Isolating re-render triggers to specific hooks.
- Keeping root components lean and focused on layout/providers.
- Making side-effects easier to track and clean up.
