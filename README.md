## FUNDLY 
A student expense tracker

## 🚀 Current Project Status (Working Features)

The following core modules and systems have been fully implemented, integrated with the backend, and verified through dummy testing:

### 1. Authentication & Security
* **User Registration (`/signup`):** Fully functional signup flow that captures First Name, Last Name, and school email addresses (`@pau.edu.ng`) or normal email addresses. It successfully provisions new user records inside Supabase Auth.
* **In-App Notifications:** Replaced default browser alerts during signup with smooth, modern, brand-colored Material UI (`Snackbar`/`Alert`) toast notifications.
* **Secure Route Guards:** The dashboard layout (`app/dashboard/layout.tsx`) actively checks for a live session token via Supabase. If an unauthenticated user manually types `/dashboard` into the browser search bar, the system catches it instantly and kicks them back to the login page.
* **Dynamic User Greeting:** The dashboard home screen successfully fetches the logged-in user's metadata to display their actual first name dynamically ("Welcome back, Clinton").

### 2. Transaction Architecture (API Subsystem)
* **Two-Tier Expense Endpoints:** Consolidated the backend transaction system into just two clean, highly efficient endpoint files to minimize repository clutter:
  * `GET /api/expenses` – Chronologically fetches all logged transaction history.
  * `POST /api/expenses` – Handles saving new transactions to the database.

### 3. Responsive Layout & UI Micro-Interactions
* **Adaptive Desktop/Mobile Sidebar:** * On **Desktop**, the sidebar is stationary and fully expanded.
  * On **Mobile/Tablet**, the sidebar automatically tucks away into a clean top bar and expands via a clickable hamburger menu icon, featuring a modern blurred background mask (`backdrop-blur-sm`).
* **Hover Micro-Interactions:** Navigation links and the Log Out button feature unified scale transitions (`hover:scale-[1.02]`) and parent-child color matching (`group-hover`), making the interface feel highly responsive and premium.
* **Session Destruction (Log Out):** The Log Out button successfully clears browser session data via Supabase and smoothly routes the user back to the landing page.