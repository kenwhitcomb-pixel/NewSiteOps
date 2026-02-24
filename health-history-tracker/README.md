# Health History Tracker (Product Blueprint + Front-End Starter)

This folder introduces a production-oriented starter implementation for the **Health History Tracker** requested in this repository.

## What is included

- `data-model-and-security.md`
  - Canonical entity list in required creation order.
  - Tenant ownership and `allowed_user_ids` propagation rules.
  - RLS policy templates for each entity category.
  - Required backend functions and behavior contracts.
- `app.html`
  - Responsive web app shell for desktop and mobile.
  - Main navigation and account switcher.
  - Account + Members management page and core page placeholders.
  - Keyboard and voice input controls in the header.
- `app.css`
  - Mobile-first responsive layout.
  - Accessibility-focused focus states and contrast-friendly styling.
- `app.js`
  - Client-side state model and account context (`active_account_id`) behavior.
  - List-page account guard filtering by active account.
  - Role-aware visibility for account/member management.
  - MVP voice flow scaffolding for Medication / Appointment / Condition.

## Important note

This is a **frontend and architecture starter**, not a full production backend. To make this fully private, multi-user, and multi-tenant with hard security:

1. Implement entities and RLS in your data platform.
2. Implement backend functions from `data-model-and-security.md`.
3. Connect this UI to authenticated APIs and disable any public routes.
