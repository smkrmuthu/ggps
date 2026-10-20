# GGPS Statistics & Production System

Standalone dashboard and management application for tracking Ground Granulated Blast-furnace Slag (GGBS) quantities, financial income/expenses, customer distribution (OEM, AVS, Others), and profit/loss metrics.

## Tech Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailored brutalist design system with Tailwind CSS & custom variables
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
