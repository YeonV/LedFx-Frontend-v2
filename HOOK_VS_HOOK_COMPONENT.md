# Why Custom Hooks are Better than Null-Rendering Components

This document explains why converting "renderless components" (like `AppSubscriptions`) into custom hooks (like `useAppSubscriptions`) is a key architectural improvement.

## 1. Avoiding Unnecessary Component Mounting
Previously, `AppSubscriptions` was a React component that returned `null`. This forced React to:
- **Instantiate a Fiber Node**: Every component instance adds a node to the React fiber tree.
- **Mount/Unmount Lifecycle**: React has to manage the lifecycle of this node, even if it renders nothing.

As a **custom hook**, the logic runs directly within the parent component's execution context. This eliminates the extra Fiber node and the associated management overhead.

## 2. Semantic Correctness
- **Components** are for UI (User Interface). They should represent something visible or structural in the document.
- **Hooks** are for logic, state, and side effects.
`AppSubscriptions` handled WebSocket listeners, which is purely behavioral logic. A hook is the semantically correct way to express this responsibility.

## 3. Improved Debugging (Clean Component Tree)
Large React applications can have very deep component trees. "Logic-only" components clutter the tree in React DevTools, making it harder to find the actual UI components you're trying to debug. Modularizing logic into hooks keeps the DevTools tree focused on the visual structure.

## 4. Better Performance
By reducing the number of component instances, we reduce the work React has to do during the reconciliation phase. In root-level components like `App.tsx`, keeping the tree shallow ensures faster initial renders and updates.

### Comparison

**Old Pattern (Null-Rendering Component):**
```tsx
const App = () => {
  return (
    <>
      <AppSubscriptions />
      <Pages />
    </>
  );
};
```

**New Pattern (Custom Hook):**
```tsx
const App = () => {
  useAppSubscriptions();

  return <Pages />;
};
```

## Conclusion
Migrating to custom hooks makes the codebase more maintainable, aligns with modern React standards, and provides a small but meaningful performance boost by streamlining the component tree.
