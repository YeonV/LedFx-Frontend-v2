# Performance Optimization Details

This document provides detailed analysis and refactoring examples for key performance points identified in the audit.

---

## 4. Optimize Root Component Re-renders

### Analysis
The `App` component (`src/App.tsx`) and `Pages` component (`src/pages/Pages.tsx`) currently act as "fat" entry points that select many unrelated pieces of state. In React, whenever any selected slice of state changes, the entire component re-renders.

For example, in `App.tsx`:
```tsx
const virtuals = useStore((state) => state.virtuals)
const features = useStore((state) => state.features)
const protoCall = useStore((state) => state.protoCall)
const fpsViewer = useStore((state) => state.ui.fpsViewer)
// ... dozens of other selectors
```
If `fpsViewer` is toggled, the entire `App` component re-renders, including the routing logic and the background visualizer.

### Refactor Example
Move state-dependent logic into smaller, dedicated components.

**Current:**
```tsx
// App.tsx
export default function App() {
  const fpsViewer = useStore((state) => state.ui.fpsViewer)
  // ... rest of App logic
  return (
    <>
      <FpsViewer open={fpsViewer} ... />
      <Pages />
    </>
  )
}
```

**Proposed:**
```tsx
// Create a wrapper component
const FpsViewerWrapper = () => {
  const fpsViewer = useStore((state) => state.ui.fpsViewer)
  const theme = useTheme()
  const fireTvBarHeight = useFireTvStore((state) => state.barHeight)

  return (
    <FpsViewer
      open={fpsViewer}
      bottom={60 + fireTvBarHeight}
      left={5}
      color={theme.palette.primary.main}
    />
  )
}

// In App.tsx
export default function App() {
  // App no longer selects fpsViewer
  return (
    <>
      <FpsViewerWrapper />
      <Pages />
    </>
  )
}
```

### Potential Benefit
- **Reduced Rendering Depth:** Toggling a small UI element (like the FPS viewer) will only trigger a re-render of its small wrapper, instead of the entire application tree.
- **Improved Interaction Latency:** The main thread stays free for user interactions because React doesn't have to diff the large `App` and `Pages` trees for trivial state changes.

---

## 5. Replace Immer for High-Frequency Store Updates

### Analysis
In `src/store/ui/storeUI.tsx`, high-frequency actions (like updating coordinates during a drag) use Immer's `produce`. While Immer makes code readable, it creates a draft object and tracks changes, which is significantly slower than a plain object spread for simple updates.

### Refactor Example

**Current (Immer):**
```tsx
setMgX: (x: number): void =>
  set(
    produce((state: IStore) => {
      state.ui.mgX = x
    }),
    false,
    'ui/mgX'
  ),
```

**Proposed (Object Spread):**
```tsx
setMgX: (x: number): void =>
  set(
    (state: IStore) => ({
      ui: { ...state.ui, mgX: x }
    }),
    false,
    'ui/mgX'
  ),
```

### Potential Benefit
- **Lower CPU Usage during Drag/Slide:** Removing the Immer overhead during mouse movements can save milliseconds of script execution time per frame.
- **Smoother Animations:** Reduces the risk of "jank" (dropped frames) when moving UI widgets or adjusting sliders rapidly.

---

## 8. Fix Component-in-Component Definitions

### Analysis
In `src/App.tsx`, the `AppSubscriptions` component is defined *inside* the `App` component.

```tsx
export default function App() {
  // ... selectors

  const AppSubscriptions = () => {
    // ... hook usage
    return null
  }

  return (
    <ThemeProvider>
       <AppSubscriptions />
       {/* ... */}
    </ThemeProvider>
  )
}
```
React treats `AppSubscriptions` as a *new component type* on every render of `App`. This causes React to completely unmount and remount the entire `AppSubscriptions` tree (and lose its internal state) every time `App` re-renders.

### Refactor Example

**Proposed:**
Move the logic into a custom hook.

```tsx
// Extract to a hook outside the component
const useAppSubscriptions = () => {
  const showSnackbar = useStore((state) => state.ui.showSnackbar)
  // ... other hooks

  useSubscription('show_message', (e: any) => {
    showSnackbar(e.type, e.message)
  })
  // ... rest of subscription logic
}

export default function App() {
  useAppSubscriptions() // Call the hook directly

  return (
    <ThemeProvider>
       {/* No need for <AppSubscriptions /> */}
       {/* ... */}
    </ThemeProvider>
  )
}
```

### Potential Benefit
- **Avoid Resource Leakage:** Prevents redundant setup/teardown of WebSocket subscriptions and event listeners.
- **Stable Component Tree:** Ensures that components remain mounted, preserving their performance and avoiding the "flicker" of repeated mount cycles.
