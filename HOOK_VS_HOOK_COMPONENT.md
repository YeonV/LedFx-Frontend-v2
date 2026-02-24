# Why `useAppSubscriptions` is Better as a Custom Hook

Previously, `AppSubscriptions` was implemented as a React component that returned `null`. While this "renderless component" pattern worked, converting it to a custom hook (`useAppSubscriptions`) offers several technical and architectural advantages.

## 1. Avoiding Unnecessary Component Mounting
When `AppSubscriptions` was a component, React had to treat it as a separate node in the Fiber tree. This meant:
- **Mounting/Unmounting Overhead**: Every time the parent `App` component re-rendered (if not properly memoized), React would check if it needs to re-instantiate the `AppSubscriptions` component.
- **Tree Clutter**: It added an extra layer in React DevTools that provided no visual information, making the hierarchy harder to navigate.

As a **custom hook**, the logic is called directly within the `App` component's body. There is no extra component instance or Fiber node, reducing memory usage and reconciliation time.

## 2. Semantic Correctness
In React, **Components** are meant to represent UI. **Hooks** are meant to represent logic and side effects.
`AppSubscriptions` does not render anything; its sole purpose is to manage WebSocket event listeners. Therefore, a hook is the semantically correct choice for this responsibility.

## 3. Improved Reusability and Composition
Hooks are easier to compose. If we needed to move some of the subscription logic elsewhere or combine it with other hooks, a custom hook provides a cleaner interface than a component that requires being "placed" in the JSX tree.

## 4. Performance in Large Trees
In a root component like `App.tsx`, minimizing the number of children helps keep the initial reconciliation fast. By calling `useAppSubscriptions()` directly, we keep the top-level JSX clean and focused strictly on the application's layout and providers.

### Comparison

**Before (Component):**
```tsx
const App = () => {
  return (
    <ThemeProvider>
       <WebSocketProvider>
          <AppSubscriptions /> {/* Extra component instance */}
          <Pages />
       </WebSocketProvider>
    </ThemeProvider>
  )
}
```

**After (Hook):**
```tsx
const App = () => {
  useAppSubscriptions(); // Direct logic call

  return (
    <ThemeProvider>
       <WebSocketProvider>
          <Pages />
       </WebSocketProvider>
    </ThemeProvider>
  )
}
```

## Conclusion
The move to `useAppSubscriptions` aligns the codebase with modern React best practices, improves performance by reducing component lifecycle overhead, and makes the codebase more readable by clearly separating layout from logic.
