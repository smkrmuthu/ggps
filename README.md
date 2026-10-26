# GGPS Statistics & Production System

Standalone dashboard and management application for tracking Ground Granulated Blast-furnace Slag (GGBS) quantities, financial income/expenses, customer distribution (OEM, AVS, Others), and profit/loss metrics.

## Tech Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS 3 (compiled at build time)
- **Backend / DB**: Supabase (Authentication, PostgreSQL Database, Realtime Subscriptions)

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Backend setup
1. Create a Supabase project and run [supabase/schema.sql](supabase/schema.sql) in the SQL editor (tables, RLS, realtime).
2. Create users under Auth > Users; promote one to `master` using the snippet at the bottom of the schema file.
   Master Admins can add/edit/delete entries; Admins get a read-only dashboard. This is enforced by RLS, not just the UI.

## Deploying to ggps.oneuptech.co
It is a static site: `npm run build` outputs `dist/`. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the host's build environment (they are baked in at build time), publish `dist/`, and point a CNAME for `ggps` at the host.
In Supabase, set Auth > URL Configuration > Site URL to `https://ggps.oneuptech.co`.

## Configuration

Environment variables can be customized in `.env`:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anon/public API key

## Project Structure
```
GGPS/
├── index.html                   # HTML entry point
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite configuration
├── .env                         # Supabase credentials
├── .env.example                 # Example env template
├── ggbs-statistics (1).html     # Original standalone prototype backup
└── src/
    ├── main.jsx                 # React root mount
    ├── App.jsx                  # Main application state & Supabase data sync
    ├── index.css                # Global layout & safe-area styles
    ├── lib/
    │   └── supabase.js          # Supabase client initialization
    ├── utils/
    │   ├── formatters.js        # Currency, numbers & totals helpers
    │   └── dateUtils.js         # FY calculations, months & range helpers
    └── components/
        ├── Common.jsx           # Cards, Panels, Arrows, Legends, PL badges
        ├── Chart.jsx            # Dynamic SVG bar charts
        ├── MonthSel.jsx         # Month & Year selector
        ├── FormFields.jsx       # Quantity & finance inputs + validation
        ├── Dashboard.jsx        # Analytics, KPI cards & charts
        ├── QtyTab.jsx           # Data entry & management tab (Master Admin)
        └── Login.jsx            # Supabase authentication screen
```
