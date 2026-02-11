# Aires Financial Model

A comprehensive spa financial simulation tool built with Next.js 14, featuring a modern corporate blue theme, sidebar navigation, tabbed interfaces, and real-time financial calculations.

## Overview

Aires Financial Model is a complete UI/UX redesign of the original spa-financial-model. It preserves **identical business logic and calculations** while providing a vastly improved user experience with:

- **Modern corporate design** with blue theme (#1E40AF primary)
- **Multi-page layout** with collapsible sidebar navigation
- **Tabbed interfaces** for organized data input
- **Enhanced dashboards** with interactive charts
- **Scenario management** for comparing financial models
- **Excel export** for professional reporting
- **Print-optimized** report views

## Pages

| Page | Description |
|------|-------------|
| **Landing** (`/`) | Hero section with feature showcase and call-to-action |
| **Dashboard** (`/dashboard`) | KPI cards, revenue/cost charts, profit trends, financial summary table |
| **Revenue** (`/revenue`) | Tabbed configuration for Treatment, Thermal, and Retail revenue streams |
| **Costs** (`/costs`) | Tabbed management of Fixed costs, Variable costs, and Labor scheduling |
| **Scenarios** (`/scenarios`) | Save, load, compare, export/import financial model snapshots |
| **Reports** (`/reports`) | Expandable report sections with Excel export and print functionality |
| **Settings** (`/settings`) | Data management (export/import JSON), reset to defaults, clear data |
| **Help** (`/help`) | User guide, calculation formulas, FAQ, and tips |

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom blue theme
- **Charts:** Recharts
- **Icons:** Lucide React
- **Excel Export:** xlsx (SheetJS)
- **State Management:** React Context API
- **Data Persistence:** Browser localStorage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd aires-financial-model
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
```

### Static Export

The project is configured for static export (`output: 'export'` in `next.config.js`). After building, the static files are in the `out/` directory and can be deployed to any static hosting.

## Project Structure

```
aires-financial-model/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── layout.tsx                  # Root layout (Inter font)
│   │   ├── globals.css                 # Global styles + Tailwind components
│   │   └── (app)/                      # Route group (sidebar layout)
│   │       ├── layout.tsx              # AppShell wrapper
│   │       ├── dashboard/page.tsx      # Dashboard with charts
│   │       ├── revenue/page.tsx        # Revenue configuration
│   │       ├── costs/page.tsx          # Cost management
│   │       ├── scenarios/page.tsx      # Scenario manager
│   │       ├── reports/page.tsx        # Reports & export
│   │       ├── settings/page.tsx       # Settings & data mgmt
│   │       └── help/page.tsx           # Help & documentation
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx             # Collapsible blue sidebar
│   │   │   ├── Header.tsx              # Page header with breadcrumb
│   │   │   └── AppShell.tsx            # Layout orchestrator
│   │   └── ui/
│   │       └── NumberInput.tsx         # Reusable number input
│   ├── context/
│   │   └── FinancialContext.tsx         # Centralized state management
│   └── utils/
│       ├── types.ts                    # TypeScript interfaces
│       ├── calculations.ts             # Core financial calculations
│       ├── localStorage.ts             # Persistence & defaults
│       ├── useFinancialCalculations.ts # Calculation hooks
│       └── excelExport.ts             # Excel report generation
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.js
```

## Financial Model

### Revenue Streams

1. **Treatment Revenue** — Based on bed capacity, utilization rates, and hotel/non-hotel pricing
2. **Thermal Revenue** — Based on concurrent capacity, session turnover, combo discounts
3. **Retail Revenue** — Percentage attachment rate of treatment + thermal revenue

### Cost Categories

1. **Fixed Costs** — Tiered progressive rent, management salary, overhead
2. **Variable Costs** — Back bar per treatment, amenities per guest, retail COGS, treatment labor
3. **Labor Costs** — Attendants, receptionists, supervisors with day-by-day scheduling

### Key Formulas

| Calculation | Formula |
|-------------|---------|
| Treatment Capacity | `beds × floor(operatingMinutes / (duration + cleaning))` |
| Thermal Capacity | `floor(maxCapacity × (operatingHours / sessionDuration))` |
| Tiered Rent | Progressive brackets (like income tax) |
| Profit Margin | `(revenue - costs) / revenue × 100` |

## Data Persistence

All data is stored in browser `localStorage` with keys:
- `aires-financial-model-inputs` — Current model inputs
- `aires-financial-model-scenarios` — Saved scenarios

Data can be exported/imported as JSON files via the Settings page.

## Relationship to Original

This project is a **UI/UX redesign** of `spa-financial-model`. The business logic in `src/utils/calculations.ts` is **identical** to the original — every formula, every calculation step, every edge case is preserved exactly. The differences are:

- Multi-page architecture (vs single-page)
- Sidebar navigation (vs scrolling)
- React Context state management (vs prop drilling)
- Tabbed input interfaces (vs stacked sections)
- Enhanced dashboard visualizations
- Scenario management on dedicated page
- Separate reports page with expandable sections
- Modern corporate blue theme

## License

Private — Internal use only.
