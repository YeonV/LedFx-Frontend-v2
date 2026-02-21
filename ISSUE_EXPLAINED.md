# Issue Explained: TypeError & Snapback in Visualizer

## The Problem
There are four distinct issues related to the audio visualiser:
1.  **Crash on Reload**: When reloading the **Devices** page directly, the application crashes with a `TypeError: Cannot read properties of undefined (reading 'length')`.
2.  **SchemaForm Snapback**: In the Visualizer DevWidget or individual visualizer cards, changing a configuration setting via the SchemaForm causes the UI to "snap back" to the previous value, even though the command is correctly sent to the visualiser.
3.  **Redux State Pollution**: The optimistic store for visualiser clients was being populated with redundant and potentially incorrect data for all visualizer types, even those not currently active.
4.  **Identical Configs**: In some cases, all visualizer configurations in the Redux store would end up with identical data, often cloned from the Butterchurn settings.

## Root Cause Analysis

### 1. Crash on Reload
The crash happens because certain visualiser-related data (like `selectedClients` prop or `visualizers` from `useVStore`) is not yet initialized when the Devices page renders for the first time after a reload. Defensive programming with safety checks for `.length` and `Array.isArray()` is required.

### 2. SchemaForm Snapback
The snapback issue has multiple root causes in the state synchronization logic:

-   **Incorrect Client Identification**: In `VisualiserWsControl.tsx`, the subscription used `d.sender_id` instead of `d.sender_uuid` to avoid self-updates. This likely caused instances to process their own state-update broadcasts.
-   **Missing Optimistic Updates in DevWidget**: The DevWidget (where `single` is false) was not updating the local optimistic store when changing configurations, causing it to fall back to potentially stale global state or initial values.

### 3. Redux State Pollution & Identical Configs
-   **Greedy Merging**: Previously, `VisualizerConfig.tsx` and `VisualiserWsControl.tsx` were merging every new configuration update into a persistent `configs` map. While this was intended to preserve settings across visualizer switches, it led to a bloated Redux state.
-   **Logic Error in Receiver**: In `VisualiserWsControl.tsx`, the logic for applying incoming state updates was incorrectly applying `butterchurnConfig` to *any* active visualizer if it was present in the payload. Since `butterchurnConfig` was always sent in the original broadcast logic, every visualizer switch eventually resulted in all visualizers inheriting the Butterchurn settings.

## Final Fix Implementation

### Fix for Crash
-   Added default values for props (e.g., `selectedClients = []`).
-   Used `Array.isArray()` checks before accessing `.length` or map/filter.

### Fix for Snapback & Pollution
-   **Consistently use `sender_uuid`** in `VisualiserWsControl.tsx` to correctly filter out self-broadcasts.
-   **Clean State Model**: Refactored both the sender and receiver to only store and transmit the configuration for the *active* visualizer. This satisfies the requirement that "butterchurn config should only be sent if type is butterchurn" and ensures the Redux state remains lean.
-   **Fixed Receiver Logic**: Removed the ambiguous `butterchurnConfig` field from the broadcast payload in favor of a scoped `configs` map. Receivers now apply this map directly to the optimistic store without merging with stale data, effectively clearing any previous pollution.
-   **Unified Configuration Logic**: In `VisualizerConfig.tsx`, `handleConfigChange` now replaces the `configs` map instead of merging, ensuring that the optimistic state only reflects the current reality of the visualiser.
