The `feature/react-flow-integration` branch introduces a new experimental way of controlling LedFx using a node-based interface built with React Flow.

### Summary of Changes

*   **New Core Feature: React Flow UI**
    *   A new page has been added under the route `/reactflow`.
    *   This page allows users to visualize and control their lighting setup in two distinct modes:
        1.  **Virtuals View**: Shows the relationships and layout of the user's virtual devices.
        2.  **LedFx Control View**: Provides a node graph for sending effects and global (Omni) settings to virtuals.

*   **Key Components Added:**
    *   **`LedFxFlow.tsx`**: The main component for the LedFx Control graph. It allows users to dynamically add "Sender" nodes (for both effects and global settings) and connect them to "Virtual" nodes.
    *   **`VirtualsFlow.tsx`**: A component designed to visualize the connections and hierarchy of virtual devices.
    *   **Node Types**:
        *   `SenderNodeOmni.tsx`: A node that embeds the "Omni FX" (global color and brightness) widget, allowing global control over connected virtuals.
        *   `SenderNodeEffect.tsx`: A node for configuring and sending a specific effect to connected virtuals.
        *   `VirtualNode.tsx`: Represents a virtual device in the graph, showing its preview card.

*   **State Management (Zustand):**
    *   Significant changes were made to the Zustand store to support the new UI and its features.
    *   Type definitions for core concepts like `Device`, `Virtual`, and `Effect` have been centralized into `src/api/ledfx.types.ts` for better consistency.
    *   New state has been introduced to manage the state of the React Flow nodes, edges, and other related UI interactions.

*   **Dependencies:**
    *   The main new dependency is `@xyflow/react`, the library that powers the new node-based UI.

*   **Other Changes:**
    *   The "Omni FX" widget was updated to be more modular, which allows it to be embedded within the new Sender Node in the graph.
    *   New utility scripts and markdown files (like `changelog.bat` and `links.md`) have been added to the repository.
