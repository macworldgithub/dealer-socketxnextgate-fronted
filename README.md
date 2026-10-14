# Dealer Socket Automation

Enterprise dealership lead automation and Nextgate webhook ingestion portal built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**, designed with an ultra-sleek high-contrast **Black & Whitish (Obsidian UI UX Pro Max)** theme.

---

## 🚀 Features

- **Enterprise Authentication**:
  - Secure email & password auth with password visibility toggle.
  - **Auto-fill Devs**: 1-click test credentials (`devs@neximet.com` / `devs@123`).
  - Session persistence via token storage & `AuthContext`.
- **Showroom Leads Pipeline**:
  - Real-time pipeline metrics (Total Ingested Leads, New Uncontacted, Active In Pipeline, Test Drives Booked, Conversion Rate).
  - Search across customer names, emails, phone numbers, vehicle models, and VINs.
  - Filter tabs by status (`New`, `Contacted`, `Test Drive`, `Negotiation`, `Won`, `Lost`).
  - Dropdown filters for Source (DealerSocket, Nextgate Ingestion, Autotrader, Cars.com, etc.) and Priority (`Urgent`, `High`, `Medium`, `Low`).
  - Inline status update selector with instant UI feedback.
  - Deep inspection modal (`LeadDetailModal`) with customer contact, vehicle specs, trade-in valuation, and dealership notes.
  - "Simulate Nextgate Lead" button to demonstrate real-time webhook ingestion.
  - Manual lead entry form (`NewLeadModal`).
- **Professional Dealership Aesthetic**:
  - Tailored dark mode color palette (Slate `#020617` / `#0f172a`, cobalt accents, emerald, amber, and cyan status badges).
  - Glassmorphic panels, responsive layout, micro-interactions.

---

## 📂 Project Architecture

```
dealer-socketxnextgate-fronted/
├── .env.example                # Example environment template (committed)
├── .env.local                  # Local environment file (git-ignored)
├── .gitignore                  # Properly ignores .env / .env*.local while tracking .env.example
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx    # Dealership login page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Authenticated layout (Sidebar + Header)
│   │   │   └── page.tsx        # Leads pipeline & management dashboard
│   │   ├── globals.css         # Base styles, scrollbars, and design tokens
│   │   ├── layout.tsx          # Root layout wrapped with AuthProvider
│   │   └── page.tsx            # Root redirect (/dashboard or /login)
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginForm.tsx   # Modular login card with validation & demo autofill
│   │   ├── dashboard/
│   │   │   ├── DashboardHeader.tsx   # Dealership title, user profile, sync badge
│   │   │   ├── DashboardSidebar.tsx  # CRM navigation and backend mapping info
│   │   │   ├── LeadsStats.tsx        # KPI metrics cards
│   │   │   ├── LeadsFilterBar.tsx    # Search, filter chips, and action buttons
│   │   │   ├── LeadsTable.tsx        # Interactive leads table with inline status dropdown
│   │   │   ├── LeadDetailModal.tsx   # Deep lead telemetry inspection modal
│   │   │   └── NewLeadModal.tsx      # New lead creation form modal
│   │   └── ui/
│   │       ├── Badge.tsx       # Automotive status and priority badges
│   │       ├── Button.tsx      # Button with variants and loading state
│   │       ├── Card.tsx        # Glassmorphic container cards
│   │       ├── Input.tsx       # Input with icons and validation
│   │       └── Modal.tsx       # Accessible modal dialog
│   ├── context/
│   │   └── AuthContext.tsx     # Global auth state and route protection
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts       # Modular HTTP client with Mock/Live switch
│   │   │   ├── auth.service.ts # Login, logout, getMe API service
│   │   │   └── leads.service.ts# Lead retrieval, creation, and status updates
│   │   └── mock/
│   │       └── mockData.ts     # Realistic DealerSocket / Nextgate lead dataset
│   ├── types/
│   │   ├── auth.ts             # Auth & user types
│   │   └── lead.ts             # Lead, status, priority, vehicle interest types
│   └── config/
│       └── site.ts             # Site configuration and API endpoint mappings
```

---

## 🛠️ Environment Configuration & Backend Mapping

### 1. Environment Files
- `.env.example`: Safe template committed to git.
- `.env.local`: Local runtime environment (ignored by git).

```env
# Backend API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1

# Enable/disable mock API mode:
# Set to 'true' for local frontend development with simulated mock CRM data
# Set to 'false' to route all calls to your backend API
NEXT_PUBLIC_USE_MOCK_API=true

# Branding
NEXT_PUBLIC_APP_NAME="DealerSocket x Nextgate"
NEXT_PUBLIC_DEALERSHIP_NAME="Apex Premier Motors"
```

### 2. Ready-to-Connect Backend Endpoints

When your backend is ready, just set `NEXT_PUBLIC_USE_MOCK_API=false`. The frontend is already wired to call:

| Method | Endpoint | Description | Payload / Query |
|---|---|---|---|
| `POST` | `/auth/login` | Dealership staff sign in | `{ email, password }` |
| `POST` | `/auth/logout` | Invalidate token session | Headers: `Authorization: Bearer <token>` |
| `GET` | `/auth/me` | Fetch active user profile | Headers: `Authorization: Bearer <token>` |
| `GET` | `/leads` | List leads with filters | `?search=...&status=...&priority=...&source=...` |
| `GET` | `/leads/:id` | Get single lead details | — |
| `POST` | `/leads` | Create lead / Nextgate ingest | `{ customerName, customerEmail, customerPhone, vehicle, ... }` |
| `PATCH` | `/leads/:id/status` | Update pipeline stage | `{ status: "contacted" \| "test_drive" \| "won" ... }` |
| `GET` | `/leads/stats` | Pipeline KPI metrics | Returns `{ total, newLeads, inProgress, testDrives, closedWon, conversionRate }` |

---

## 🏃 Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build
npm run build
```

Visit [http://localhost:3000](http://localhost:3000).

- **Demo Credentials**:
  - Email: `admin@dealersocket.com`
  - Password: Any password (or click **"Auto-fill Demo User"**)
