# FinPulse - Premium Finance Dashboard

A clean, responsive, and interactive finance dashboard interface built to demonstrate modern frontend development skills.

## Features

- **Premium Dark Mode UI**: Deep, rich dark aesthetic built purely with vanilla CSS using custom properties (Variables). No external CSS frameworks were used. The design leverages glassmorphism (`backdrop-filter`) and dynamic hover micro-animations.
- **Role-Based Access Control (RBAC)**: A simulated RBAC context structure. Users can toggle freely between `viewer` (read-only) and `admin` roles in the Topbar. Based on role context, certain actions (e.g., Edit Metrics, Add Transaction, Delete Transaction, Admin Settings) dynamically mount or unmount from the UI.
- **Interactive Visualizations**: Implements Recharts to visually graph income versus expenses with custom SVG gradients mirroring the app's aesthetic.
- **Component Scalability**: The application is broken down into structured, isolated components (`Sidebar`, `Topbar`, `StatCard`, `DashboardChart`, `Transactions`), demonstrating scalable architectural practices.
- **Responsive Layout**: Designed to provide an intuitive UX on both desktop and smaller viewports. Sidebar collapses or hides dynamically for space optimization.

## Technology Stack

- **React 19**
- **Vite** (for fast local development and optimized builds)
- **Vanilla CSS** (Component/Global level custom properties)
- **Recharts** (Data Visualization)
- **Lucide React** (Consistent minimal iconography)

## Getting Started

### Prerequisites

- Node.js (v18+)

### Installation

1. Copy the codebase / Change directory (if cloned):
   ```bash
   cd finance-dashboard
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Run the application locally:
   ```bash
   npm run dev
   ```

## Architecture & State Management

### State Management
Due to the scope of this dashboard, State Management was kept intentionally simple, native, and robust:
- **`RoleContext`**: A React Context API implementation handling global state for simulated authentication/authorization context (the Role Toggle). This propagates user roles (`admin` or `viewer`) without prop drilling.
- **Mock Data**: Business metrics are populated from static exported mock objects to signify external data coupling ready for a future Backend-For-Frontend (BFF).

### Styling strategy
- **index.css**: Contains all global resets, typography definition, and theming specific CSS variables (`--accent-primary`, `--bg-card`, etc).
- **App.css**: Contains architectural CSS logic (CSS grid templates, layout flex spacing, and component definitions like `.glass-panel`).

## Evaluation Constraints Handled
1. **Design**: Prioritized visual quality over rapid structure. Integrated gradients and drop shadows for depth and a premium feel.
2. **UX**: Interactions clearly respond to pointer positions. Icons have adequate paddings/hitboxes.
3. **Architecture Check**: Clear, scalable folder structure enabling seamless addition of further views/pages (via 'react-router-dom') when required.
