# Product Requirement Document (PRD)
**Project Name:** Verdant Oasis Plant Nursery
**Target Platform:** Web (React Frontend + Supabase Backend)

## 1. Product Scope
Verdant Oasis is a modern, premium e-commerce platform for purchasing botanical products. The application is divided into two primary workspaces:
- **User Storefront:** A public-facing shop designed for a serene shopping experience. Allows users to browse plants, read care guides, add items to a cart (with specific attributes like pot size), and check out.
- **Admin Work Area:** A protected internal dashboard for staff to manage inventory, track orders, and fulfill customer requests seamlessly.

## 2. User Stories
### Storefront (Customers)
- **As a customer**, I want to browse the plant catalog so I can find new plants for my home.
- **As a customer**, I want to view detailed product information (including care guides for light, water, and toxicity) to make an informed purchase.
- **As a customer**, I want to select specific pot sizes and add plants to my shopping cart.
- **As a customer**, I want to easily connect with support via WhatsApp if I have questions about plant care or orders.
- **As a customer**, I want to see a promotional popup upon my first visit but dismiss it permanently so it doesn't interrupt future visits.

### Admin Work Area (Staff)
- **As an admin**, I want to securely log in to the backend portal to access management tools.
- **As an admin**, I want to view a real-time list of all inventory items, including their current stock and status.
- **As an admin**, I want to add new plants (with images, prices, and care details), edit existing ones, and remove discontinued items.
- **As an admin**, I want to view a queue of customer orders and update their fulfillment status (Pending -> Packed -> Shipped).

## 3. Tech Stack Specifications
- **Frontend Framework:** React (using Vite as the build tool).
- **Routing:** React Router v6 for declarative, component-based routing.
- **Styling:** Tailwind CSS, utilizing custom design tokens (fonts, colors, border radii) extracted from the Stitch visual layout.
- **Backend/Database:** Supabase (PostgreSQL) for persistent data storage.
- **Authentication:** Supabase Auth for protected admin routes.
- **Client Integration:** `@supabase/supabase-js` for querying and real-time updates.

## 4. Core Features Breakdown
### 4.1 Launch Promo Popup Cache
- **Logic:** A React `useEffect` hook that checks `localStorage` for a `verdant_popup_dismissed` token.
- **Behavior:** If the token does not exist, a promotional layer is rendered. When the user dismisses or interacts with the popup, the token is written to `localStorage`, preventing it from showing on subsequent visits.

### 4.2 Dynamic WhatsApp Routing
- **Logic:** A floating action button configured to open a WhatsApp chat.
- **Behavior:** Transforms the intended support phone number and a default message into a secure `https://wa.me/` link, dynamically routing the user to the mobile app or web client.

### 4.3 Product Care Summaries
- **Logic:** Standardized data fields mapped from the Supabase `plants_inventory` table (`care_light`, `care_water`, `care_toxicity`).
- **Behavior:** Dynamically renders aesthetic, icon-driven care instruction cards on the Product Detail page.

### 4.4 Global Shopping Cart Logic
- **Logic:** A React Context (or Zustand store) providing global state management for the cart.
- **Behavior:** Tracks items (product ID, pot size, quantity) and calculates aggregated subtotals. Controls the visibility state (`isOpen`) of the slide-out Checkout Drawer.

### 4.5 Admin Dashboards
- **Logic:** Protected routes locked behind Supabase session verification.
- **Behavior:** Features a sidebar navigation and a main data table workspace. Implements full CRUD capabilities via the Supabase client for inventory manipulation and a state machine for order tracking.
