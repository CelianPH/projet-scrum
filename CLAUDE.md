# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for a retail store inventory management system (Gestion de Stock). The project is currently frontend-only with plans to add a backend later.

**Structure:**
- `front/` - React + Vite frontend application with Tailwind CSS
- `back/` - Backend (not yet implemented)

## Development Commands

### Frontend Development (from `front/` directory)

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Architecture

### Frontend Stack
- **Framework:** React 19 with Vite as build tool
- **Styling:** Tailwind CSS with custom configuration
- **UI Components:** Custom component library using shadcn/ui patterns (class-variance-authority, clsx, tailwind-merge)
- **Icons:** lucide-react

### Project Structure

```
front/src/
├── components/
│   └── ui/          # Reusable UI components (button, card, input)
├── pages/           # Page-level components (Dashboard, etc.)
├── lib/
│   └── utils.js     # Utility functions (cn helper for classnames)
├── App.jsx          # Main application entry with routing logic
└── main.jsx         # React DOM entry point
```

### Key Architectural Patterns

**Path Aliases:** The project uses `@/` as an alias for the `src/` directory, configured in `vite.config.js`. Always import using this alias:
```javascript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

**Component Pattern:** UI components follow the shadcn/ui pattern:
- Use `forwardRef` for proper ref forwarding
- Use `class-variance-authority` (cva) for variant management
- Use the `cn()` utility from `@/lib/utils` to merge Tailwind classes

**Application State:** Currently uses React `useState` for local state management. The main `App.jsx` handles:
- Authentication state (`isLoggedIn`)
- Inventory data (mock data array)
- Search functionality

**Current Features:**
- Login page with email/password inputs
- Main dashboard with inventory statistics
- Product inventory table with SKU, category, size, color, quantity, price, location
- Search functionality for inventory items
- Low stock indicators (color-coded quantities)

## Feature Roadmap

### 1. Authentication & Security (Priority 1)
- **Login Page** - Email/password authentication with error handling
- **Register Page** - New user registration form
- **Forgot Password** - Password reset flow
- **Role Management** (Admin only) - Define permissions (admin, employé)

### 2. Product Management (CRUD)
- **Add Product Page** - Form with: name, category, size, color, quantity, price, location
- **Import Products Page** - CSV/Excel upload with validation and error display
- **Edit Product Page** - Pre-filled form with stock history tracking
- **Delete Product** - Confirmation popup with automatic list update

### 3. Inventory List & Search
- **Product List Page** - Dynamic table with real-time updates and action icons
- **Search & Filter** - Search bar + filters by category, size, color with live updates

### 4. Stock Adjustments
- **Add Stock (Restocking)** - Product selection + quantity input with confirmation
- **Remove Stock** - Product selection + quantity + reason (sale/loss/damage)

### 5. Alerts & Notifications
- **Alert Configuration** - Set thresholds per product or globally, enable/disable emails
- **Notifications Page** - Dashboard widget + alert history with low stock product list

### 6. Categories & Sizes Management
- **Categories Page** - Add, edit, and list all categories
- **Sizes Page** - Add/edit available sizes (S, M, L, XL, etc.)

### 7. Dashboard & Analytics
- **Dashboard Page** - KPIs: total products, stock value, low stock count, recent changes
- **Charts** - Visual representations of inventory data
- **Notifications Widget** - Real-time alerts display
