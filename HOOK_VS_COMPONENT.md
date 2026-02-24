# Custom Hook vs. Null-Rendering Component

This document explains why using a custom hook (`useAppSubscriptions`) is generally preferred over a component that returns `null` (`AppSubscriptions`) for managing side effects like WebSocket subscriptions.

## 1. Semantic Clarity
A component in React is typically expected to represent a piece of the User Interface. When a component returns `null`, it’s essentially a "headless" component used only for its lifecycle or hooks.

Using a **custom hook** explicitly signals that the logic is about **behavior and state**, not about rendering. It makes the purpose of the code clearer to other developers.

## 2. Component Tree Bloat
Every component you add to your application adds a node to the React fiber tree. While the performance hit of a single node is negligible, large applications with many "logic-only" components end up with a cluttered component tree in React DevTools, making debugging harder.

## 3. Performance & Reconciliation
When a parent component re-renders, React must reconcile all of its children. Even if `AppSubscriptions` returns `null`, React still has to:
- Call the function `AppSubscriptions`.
- Run the hooks inside it.
- Diff the result (which is always `null`).

While a custom hook also runs its logic on every render of the component that calls it, it avoids the overhead of component instantiation and fiber tree management.

## 4. Best Practices
Since the introduction of Hooks in React 16.8, the community has moved away from "Renderless Components" or "Higher Order Components" for logic sharing in favor of custom hooks.

### Example Comparison

**Null Component (Current approach):**
```tsx
const App = () => {
  return (
    <>
      <AppSubscriptions />
      <MainContent />
    </>
  );
};
```

**Custom Hook (Recommended approach):**
```tsx
const App = () => {
  useAppSubscriptions(); // Direct and clear

  return <MainContent />;
};
```

## Summary
By converting `AppSubscriptions` to `useAppSubscriptions`, we:
- **Clean up the DOM-less component tree.**
- **Follow modern React patterns.**
- **Improve code readability** by keeping side-effect setup distinct from layout structure.
