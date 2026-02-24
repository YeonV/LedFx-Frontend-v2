# Architecture Decisions: Hook Placement & Logic Extraction

This document discusses the rationale behind the placement of global custom hooks and the extraction of system-level logic.

## 1. Hook Placement: `App.tsx` vs. `Pages.tsx`

We recently refactored several logical blocks from `Pages.tsx` into custom hooks (`useElectronProtocol`, `useAppHotkeys`, `useDisplayMode`). There was a consideration to move these even higher up into `App.tsx`.

### Moving to `App.tsx`
**Pros:**
- **Truly Global**: Logic is initialized at the very root, ensuring it's active even if routing fails or different top-level page components are used in the future.
- **Centralized Bootstrap**: Keeps all "application-start" logic in one place.

**Cons:**
- **Router Dependency**: Both `useAppHotkeys` and `useElectronProtocol` depend on the `useNavigate` hook from `react-router-dom`. Currently, the `Router` context is provided within the `Pages` component tree. Moving these hooks to `App.tsx` would require moving the `Router` provider to `App.tsx` or higher (e.g., `index.tsx`), which may affect how Electron's `HashRouter` is configured.
- **Re-render Scope**: Placing reactive hooks in `App.tsx` means any state change handled by those hooks (like a hotkey toggle) might trigger a re-render of the entire provider tree, although `App.tsx` is mostly layout-stable.

**Decision:**
Currently, these hooks remain in the `Routings` component (within `Pages.tsx`) to satisfy the **Router context dependency**. If a global Router is moved to `index.tsx`, moving these hooks to `App.tsx` would be the preferred next step for better separation of layout and logic.

---

## 2. Extraction of IPC Bootstrap Logic

We moved the initial Electron IPC `send` calls (bootstrap calls) from `App.tsx` into the `useIpcHandlers` hook.

```typescript
// Initial bootstrap calls moved to useIpcHandlers.ts
if (isElectron()) {
  window.api?.send('toMain', { command: 'get-platform' })
  window.api?.send('toMain', { command: 'get-core-params' })
  window.api?.send('toMain', { command: 'close-others' })
}
```

### Rationale
- **Separation of Concerns**: `App.tsx` should define the visual and provider structure of the application. Low-level IPC communication is a behavioral detail that belongs in a specialized hook.
- **Maintainability**: When developers need to add or modify system-level initialization, they only need to look in `useIpcHandlers.ts` rather than digging through the root layout component.
- **DRY (Don't Repeat Yourself)**: If multiple components ever needed to trigger these bootstrap sequences, the logic is already modularized.

## 3. IPC Listener Cleanup

In `useIpcHandlers.ts`, we register a listener via `window.api.receive`.

**Technical Note:**
Due to the current typing of the Electron preload bridge in this project, the `receive` method is typed as returning `void` or `never`. While standard React practice is to return a cleanup function from `useEffect` to remove listeners, we have omitted the call to `removeListener()` to resolve a TypeScript "Type 'never' has no call signatures" error.

We rely on the `useEffect` dependency array and the stable nature of the root component to ensure listeners are not redundantly registered, though a future improvement to the preload bridge types to support cleanup is recommended.
