# Issue Explained: TypeError & Snapback in Visualizer

## The Problem
There are two distinct issues related to the audio visualiser:
1.  **Crash on Reload**: When reloading the **Devices** page directly, the application crashes with a `TypeError: Cannot read properties of undefined (reading 'length')`.
2.  **SchemaForm Snapback**: In the Visualizer DevWidget or individual visualizer cards, changing a configuration setting via the SchemaForm causes the UI to "snap back" to the previous value, even though the command is correctly sent to the visualiser.

## Root Cause Analysis

### 1. Crash on Reload
The crash happens because certain visualiser-related data (like `selectedClients` prop or `visualizers` from `useVStore`) is not yet initialized when the Devices page renders for the first time after a reload. Defensive programming with safety checks for `.length` and `Array.isArray()` is required.

### 2. SchemaForm Snapback
The snapback issue has multiple root causes in the state synchronization logic:

-   **Incorrect Client Identification**: In `VisualiserWsControl.tsx`, the subscription for `state-update` used `d.sender_id` instead of `d.sender_uuid` to avoid self-updates. This likely caused instances to process their own state-update broadcasts.
-   **State Overwriting**: When a `state-update` was received, it overwrote the entire `configs` map in the optimistic store with only the single visualizer config contained in the broadcast. This caused all other visualizer configurations for that client to be lost locally.
-   **Stale Optimistic Updates**: In `VisualizerConfig.tsx`, the optimistic store was being updated using `localState` from the current render, which could be stale if multiple updates happened rapidly. Using `useStore.getState()` ensures the latest state is used for merging.
-   **Missing Optimistic Updates in DevWidget**: The DevWidget (where `single` is false) was not updating the local optimistic store when changing configurations, causing it to fall back to potentially stale global state or initial values.

## Proposed Fix

### Fix for Crash
-   Add default values for props (e.g., `selectedClients = []`).
-   Use `Array.isArray()` checks before accessing `.length` or map/filter.

### Fix for Snapback
-   **Consistently use `sender_uuid`** in `VisualiserWsControl.tsx` to correctly filter out self-broadcasts.
-   **Properly merge configs**: When receiving a `state-update`, merge the incoming configuration into the existing `configs` map for that client in the optimistic store.
-   **Unified Optimistic Update**: In `VisualizerConfig.tsx`, ensure `handleConfigChange` always updates the optimistic store for the relevant `instanceKey`, using the most recent state from `useStore.getState()` to avoid stale data overwrites.
-   **Simplify `onModelChange`**: Use the improved `handleConfigChange` for all model changes to ensure consistent logic for both local and remote clients.
