# Procurement Management System: Functionality Mapping & Recommendations

This document maps the functionalities from a reference procurement system to your current system and provides recommendations on what to add and where to integrate them.

---

## 1. 🔐 Authentication & Security

**What to Add:**
- **Role-based login:** Ensure your login system checks user roles and redirects accordingly.
- **Forgot password with OTP email verification:** Add a “Forgot Password” page/component with OTP email logic.
- **Account lockout after 3 invalid attempts:** Add logic in your login handler to track attempts and lock accounts.
- **Email alert on suspicious login attempts:** Integrate email notifications for failed/suspicious logins.
- **Manual account unlocking by admin:** Add an admin panel feature to unlock accounts.

**Where to Add:**
- `User_Login.vue` (login logic, lockout, OTP)
- `AdminManagement.vue` (unlock accounts, manage users)
- Backend (Firebase functions or serverless for email/OTP logic)

---

## 2. 👥 User Roles & Permissions

**What to Add:**
- **End User:** Prepare PPMP, PR, APP; view/track requests; notifications; print reports.
- **Administrator:** All End User functions + manage users/products, analytics, system data.
- **Director:** Approve PPMP/PR, view analytics, obligate requests.
- **Budget Officer:** Prepare PPMP, manage budgets, forward for approval.

**Where to Add:**
- Role checks in `router.js` (route guards)
- Conditional rendering in navigation (`AdminNavigationBar.vue`)
- New components/pages for Director and Budget Officer dashboards

---

## 3. 📋 PPMP Module

**What to Add:**
- **Create/Manage PPMP:** New component for PPMP creation and management.
- **Assign signatories, forward, export, view status:** Add these features to the PPMP component.

**Where to Add:**
- New `PPMP.vue` component (in `src/components`)
- Add navigation link in `AdminNavigationBar.vue`

---

## 4. 🧾 Purchase Request (PR) Module

**What to Add:**
- **Create/Manage PR:** Link PRs to approved PPMPs, allow editing, forwarding, deleting, printing, and tracking.

**Where to Add:**
- Enhance `PurchaseRequest.vue` for full PR lifecycle
- Add print/export logic

---

## 5. 📈 Analytics & Data Visualization

**What to Add:**
- **Analytics dashboard:** Show request counters, summaries, performance, and charts.

**Where to Add:**
- New `Analytics.vue` component (for Admin/Director)
- Add to sidebar in `AdminNavigationBar.vue`
- Use Google Charts/Highcharts libraries

---

## 6. 📦 Product Management (Admin Only)

**What to Add:**
- **Product list, add/update products, manage categories:** CRUD operations for products/categories.

**Where to Add:**
- New `ProductManagement.vue` component
- Admin-only sidebar link

---

## 7. 👤 User Management (Admin Only)

**What to Add:**
- **User list, add/edit users, change status:** Full user management interface.

**Where to Add:**
- Enhance `AdminManagement.vue` for all user management features

---

## 8. 🔔 Notification System

**What to Add:**
- **Bell icon, notification list, real-time updates, email alerts:** Notification UI and backend logic.

**Where to Add:**
- Notification bell in `AdminNavigationBar.vue`
- New `Notifications.vue` component/page
- Integrate with Firebase/Firestore for real-time updates

---

## 9. 🖨 Reports and Printables

**What to Add:**
- **Export/print PPMP, APP, PR:** Export to Excel/print-friendly formats.

**Where to Add:**
- Add export/print buttons in `PPMP.vue`, `PurchaseRequest.vue`, `APP.vue`
- Use libraries like `xlsx` and print styles

---

## 10. 🧭 Navigation Highlights

**What to Add:**
- **Sidebar links for all modules:** Ensure all new modules/pages are accessible from the sidebar.

**Where to Add:**
- Update `AdminNavigationBar.vue` to include all relevant links, conditionally rendered by role

---

## Summary Table

| Functionality                | Component(s) to Add/Update                | Notes                                 |
|------------------------------|-------------------------------------------|---------------------------------------|
| Auth & Security              | User_Login.vue, AdminManagement.vue       | OTP, lockout, unlock, email alerts    |
| User Roles                   | router.js, AdminNavigationBar.vue         | Route guards, conditional nav         |
| PPMP Module                  | PPMP.vue                                  | New component                         |
| PR Module                    | PurchaseRequest.vue                       | Enhance existing                      |
| Analytics                    | Analytics.vue                             | New component, charts                 |
| Product Management           | ProductManagement.vue                     | New component, admin only             |
| User Management              | AdminManagement.vue                       | Enhance existing                      |
| Notifications                | Notifications.vue, AdminNavigationBar.vue | New component, real-time/email        |
| Reports/Printables           | PPMP.vue, PurchaseRequest.vue, APP.vue    | Add export/print features             |
| Navigation                   | AdminNavigationBar.vue                    | Add all links, role-based             |

---

**Recommendation:**
Start with authentication/security, user roles, and navigation, then add modules (PPMP, PR, Analytics, Product/User Management), and finally notifications and reporting.

Let me know if you want a step-by-step plan or code samples for any specific feature!
