# Final Architectural Considerations

## 1. The `HookLoader` Pattern
In `App.tsx`, we introduced a `HookLoader` component:

```tsx
const HookLoader = () => {
  useAppSubscriptions();
  return null;
};
```

**Why is this necessary?**
The `useAppSubscriptions` hook depends on the `WebSocketProvider` context (specifically via the `useSubscription` hook). In React, a hook cannot consume context from a provider that is defined in the same component's render method.

By wrapping the hook call in `HookLoader` and placing it *inside* the `<WebSocketProvider>` tree in `App.tsx`, we ensure that the hook has access to the required WebSocket context while keeping the root `App` component's logical footprint small.

---

## 2. Feature Toggles: Conditional Rendering vs. Wrapper Components

Currently, we use inline conditional rendering for feature-dependent components:
`{features.firetv && <FireTvBar />}`

### Using a Wrapper Component (e.g., `FireTvBarWrapper`)
**Pros:**
- **Encapsulation**: The root component (`App.tsx`) doesn't need to know about the `features.firetv` state. It just renders the component, and the component decides whether to show itself.
- **Cleaner JSX**: Reduces the amount of logical noise in the main layout.

**Cons:**
- **Implicit Logic**: It becomes less obvious to a developer reading `App.tsx` that the component might render nothing.
- **Bundle Size**: Even if the feature is disabled, the component code is imported (unless using lazy loading).

**Recommendation:** For truly global UI elements, a wrapper component is preferred for long-term maintainability. For small, temporary, or highly critical features, inline conditions are acceptable but should be minimized.

---

## 3. `isDisplayMode` Management in `Pages.tsx`

`isDisplayMode` is currently resolved via the `useDisplayMode` hook within the `Routings` component.

### Potential Improvements
- **Route-level Display Mode**: Instead of checking query parameters everywhere, we could define a dedicated route group for display modes (e.g., `/display/visualiser`). This would allow using different Layout components at the router level without manual conditional logic in the `Routings` body.
- **Contextual UI state**: Move `isDisplayMode` into a global UI store or a dedicated Context. This would allow any component in the tree to react to the "clean UI" requirement without having to re-parse URL parameters or receive it via props.
