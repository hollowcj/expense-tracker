Fundly: Smart Student Expense Tracker
Fundly is a high-performance, real-time financial diagnostic tool built specifically for students. It enables users to track liquidity, monitor structural spending behavior, and manage monthly budgets with precision.

🚀 Final Project Status (Production Ready)
The following core modules and systems have been fully implemented, integrated with the backend, and verified.

1. Financial Diagnostic Engine
Liquidity & Burn Tracking: Real-time calculation of "Savings Velocity" and "Liquidity Burn Rate," providing users with an immediate snapshot of their financial health.

Structural Analytics: Automated distribution of expenses across categories (e.g., Food, Transport, Utilities) to identify top cost centers.

2. Authentication & Security
Session Management: Secure registration and authentication using Supabase. Implements rigid route guards to prevent unauthorized access to private dashboard views.

Modern Notifications: Replaced standard system alerts with high-fidelity, brand-aligned Material UI snackbars for a professional user experience.

3. Transactional & Wallet Architecture
Dual-Action Ledger: Integrated both "Point-of-Sale" expense logging and "Payout Mutation" (manual liquidity management) to maintain precise ledger integrity.

Optimized Endpoints: Highly efficient API subsystem handling transaction history and database mutations with minimal latency.

4. Responsive UI/UX
Adaptive Navigation: Features a seamless, mobile-first design. The system automatically switches between a permanent desktop sidebar and a responsive, hamburger-menu mobile navigation with a blurred background backdrop.

Micro-interactions: Integrated unified hover-scaling and parent-child transition effects to ensure a fluid, premium feel across all screen sizes.

Global Layout Resolution: Solved mobile-view clipping via dynamic, breakpoint-aware padding, ensuring a consistent and clean interface across all devices.

5. Settings & Data Portability
Customization: Users can fully configure their workspace, including display names, currency preferences (₦, $, £, €), and custom spending categories.

Data Sovereignty: Built-in tools for transparent financial management, including the ability to export full ledger history as a JSON backup or perform a secure, permanent workspace reset