# Application Hooks Migration

This document outlines the migration of monolithic logic from root components (`App.tsx` and `Pages.tsx`) into modular custom hooks.

## Overview
As the application grew, the root components became cluttered with diverse responsibilities, including IPC handling, protocol deep-linking, hotkey management, and display mode toggling. This lead to "fat" components that were difficult to maintain and triggered excessive re-renders.

## Refactored Hooks

### 1. `useAppSubscriptions`
- **Location**: `src/hooks/useAppSubscriptions.ts`
- **Purpose**: Replaces the `AppSubscriptions` component. Manages global WebSocket event listeners (messages, scenes, song detection).
- **Benefit**: Removes a redundant node from the React Fiber tree and improves semantic clarity.

### 2. `useIpcHandlers`
- **Location**: `src/hooks/useIpcHandlers.ts`
- **Purpose**: Manages communication with the Electron main process via `window.api.receive`.
- **Benefit**: Decouples the root `App` component from low-level system events.

### 3. `useProtocolHandler`
- **Location**: `src/hooks/useProtocolHandler.ts`
- **Purpose**: Handles `ledfx://` protocol deep-links, including complex parsing for the song detector and integration callbacks.
- **Benefit**: Isolates a large block of conditional logic, making the primary application initialization flow much easier to read.

### 4. `useAppHotkeys`
- **Location**: `src/hooks/useAppHotkeys.ts`
- **Purpose**: Consolidates all global keyboard shortcuts previously managed in `Pages.tsx`.
- **Benefit**: Simplifies the main routing component and avoids re-renders caused by reactive hotkey dependencies.

### 5. `useDisplayMode`
- **Location**: `src/hooks/useDisplayMode.ts`
- **Purpose**: Monitors URL parameters for "display mode" (OBS-friendly UI) and applies relevant CSS classes and client identity updates.
- **Benefit**: Modularizes view-specific state logic.

## Results
The root components are now significantly leaner:
- **`App.tsx`**: Focuses strictly on the high-level application provider tree and layout.
- **`Pages.tsx`**: Focuses strictly on routing and main layout structure.

This modular architecture improves **maintainability**, **testability**, and **performance** by isolating re-render triggers to the specific hooks or sub-components that require them.
