# Issue Explained: TypeError: Cannot read properties of undefined (reading 'length')

## The Problem
When reloading the **Devices** page directly (without first navigating from the Visualizer DevWidget), the application crashes with a `TypeError: Cannot read properties of undefined (reading 'length')`. This issue only occurs in the production build.

## Root Cause Analysis
The crash happens because certain visualiser-related data is not yet initialized or is in an unexpected state when the Devices page renders for the first time after a reload.

Several components on the Devices page (via `VisualizerCard` -> `VisualizerConfig`) depend on props and store state that might be missing:
1.  **`selectedClients` prop**: In `VisualizerConfig.tsx`, there are checks like `selectedClients.length === 1`. If `selectedClients` is somehow passed as `undefined` or `null`, this throws.
2.  **`clients` store slice**: If the `clients` map is rehydrated as something other than an object, or if it's missing during the initial render before `getClients()` completes.
3.  **`visualizerIds`**: This is derived from `visualizers` which comes from `useVStore`. While there is a fallback `|| []`, if `useVStore` is called before the dynamic module store is ready, it might return `undefined`.

In the production build, race conditions during module loading and store hydration are more likely to trigger these issues. Navigating from the DevWidget first avoids the crash because that path ensures the visualiser module is loaded and `getClients()` has been called.

## Proposed Fix
The fix involves adding defensive programming patterns to ensure that any variable where `.length` is accessed is guaranteed to be an array or string, or at least checked for existence.

1.  **Safety in `VisualizerConfig.tsx`**:
    - Add a default value `[]` for the `selectedClients` prop.
    - Ensure `visualizerIds` is always an array before use.
    - Add safety checks around `selectedClients.length` and `selectedClients.filter`.
    - Ensure `visualizers` fallback is robust.

2.  **Safety in `VisualizerDevWidget.tsx`**:
    - Add checks to ensure `clientIdentity` and `clientIdentity.clientId` are available.
    - Defensive checks for `clients` and `Object.keys(clients)`.

By ensuring these basic data structures are always present (even if empty), we prevent the "reading 'length' of undefined" crash during the initial loading phase.
