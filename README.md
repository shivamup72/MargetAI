# 🚀 LocalBoost AI – AI-Powered Local Business Marketing SaaS

[![React](https://img.shields.io/badge/React-19.3.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.19-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3.5-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7.18.5-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.10.1-22c55e)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A modern, premium, fully interactive SaaS web application designed to help local businesses grow their footfall, dominate Google Maps Local 3-Pack rankings, manage customer reputation with AI, and automate multi-channel marketing campaigns.

Inspired by industry-leading design systems like **Stripe**, **HubSpot**, and **Linear**, LocalBoost AI features a clean, responsive layout, subtle gradients, soft elevation shadows, and client-side reactivity tailored for Indian local business ecosystems (Pratapgarh, Prayagraj, Lucknow, Varanasi).

---

## 📸 Overview & Design Highlights

- **Aesthetic**: Minimalist enterprise SaaS style with an Indigo/Violet primary theme, white cards with `12px–16px` border radii, and soft shadows (`shadow-soft`).
- **Zero-Latency Client Reactivity**: State persisted in `localStorage` across page refreshes — including added businesses, campaigns, reviews, drafts, and settings.
- **Interactive Live Playground**: A persistent floating widget allowing reviewers to trigger incoming 5-star reviews, simulate search view surges (+85 views), batch-generate AI replies, and switch business profiles in one click.
- **Localized Context**: Pre-configured with realistic Indian businesses, INR currency (`₹`), GSTIN configuration, and local search queries for Uttar Pradesh markets.

---

## 🧩 13 Core Modules

### 1. 📊 Executive Dashboard Overview (`/`)
- **Key Performance Indicators (KPIs)**: 6 metric cards tracking *Total Profile Views (12,450)*, *Customer Actions (1,280)*, *Phone Calls (342)*, *Direction Requests (518)*, *Website Clicks (420)*, and *Average Google Rating (4.6★)* with percentage growth comparison against last month.
- **Interactive Performance Analytics**:
  - Recharts Area Chart displaying monthly Google Search & Maps views vs direct actions.
  - Recharts Bar Chart breakdown of high-intent phone calls and direction requests.
- **Rating Distribution**: 5-star to 1-star visual progress bars.
- **Pending Tasks Checklist**: Actionable tasks with interactive completion toggles.
- **AI Growth Recommendations**: High-impact marketing recommendations with direct module shortcuts.

### 2. 🏪 My Businesses (`/businesses`)
- **Multi-Location Hub**: Manage single outlets or multi-city chains across Pratapgarh, Prayagraj, Lucknow, and Varanasi.
- **Demo Locations**:
  - *Sharma Restaurant* (Civil Lines, Pratapgarh) – Pure Veg Family Dining
  - *City Care Clinic* (Tagore Town, Prayagraj) – Multi-speciality Diagnostics
  - *Bright Future Coaching* (Hazratganj, Lucknow) – IIT-JEE & NEET Institute
  - *Royal Hotel & Banquet* (Cantt, Varanasi) – Luxury Hospitality
  - *Gupta Sweets & Namkeen* (Chowk, Pratapgarh) – Traditional Confectionery
- **Interactive Search & City Filter**: Instant filtering by city or business name.
- **Add Business Modal**: Modal form to register new local business profiles with real-time state updates.
- **Business Details Modal**: Inspect full address, contact details, and weekly operating schedules.

### 3. 🧭 Google Business Profile (`/google-business`)
- **Verified Listing Dashboard**: Live sync status with simulated Google OAuth account connectivity.
- **Simulated OAuth 2.0 Connection Modal**: Demonstrates account selection, permission scopes, and OAuth connection flow.
- **Business Metadata Manager**: Edit official business name, category, phone number, address, and opening hours.
- **AI Description Optimizer**: One-click AI rewrite optimizing profile descriptions with local SEO keywords.
- **Photo Gallery & Upload Simulation**: Upload and monitor engagement views on exterior, interior, and product photos.
- **Google Maps Preview**: Simulated mobile and desktop card preview showing how customers see the listing on Google Maps.

### 4. 📈 Local SEO & Rank Tracking (`/local-seo`)
- **SEO Health Score**: Circular score meter (88/100) benchmarked against local competitors.
- **Profile Completion & NAP Verification**: Audit for Name, Address, and Phone consistency.
- **Tracked Keyword Matrix**:
  | Keyword | Monthly Searches | Google Rank | Competition | Trend | Intent |
  | :--- | :---: | :---: | :---: | :---: | :--- |
  | *Best Restaurant Near Me* | 2,400 | #4 | Medium | +2 | Local Commercial |
  | *Restaurant in Pratapgarh* | 1,800 | #3 | Low | +1 | Local Discovery |
  | *Family Restaurant* | 1,200 | #7 | Medium | -1 | Informational |
  | *Best Pure Veg Thali Pratapgarh* | 950 | #2 | Low | +3 | Transactional |
- **Add Keyword Modal**: Track new keywords with custom search volumes and rankings.
- **AI SEO Suggestions**: Instant recommendations (e.g., adding landmark keywords, menu item optimization) with one-click "Apply to Profile".

### 5. 🎯 Competitor Analysis & Radar (`/competitors`)
- **Catchment Competitor Radar**: Benchmark ratings, review counts, profile completeness, photo volume, and response rates against local competitors.
- **Visual Comparison Bar Chart**: Side-by-side volume and rating charts.
- **AI SWOT Analysis Modal**: Click **SWOT Analysis** on any competitor to generate a strengths, weaknesses, opportunities, and threats breakdown.
- **Add Competitor Modal**: Add custom local competitors to track.

### 6. ⭐ Reviews & AI Reputation Engine (`/reviews`)
- **Reputation Health**: Track total reviews, average star rating, pending replies, and sentiment split (Positive, Neutral, Critical).
- **Search & Sentiment Filter**: Filter by *All*, *Pending Replies*, *Positive*, or *Critical (1-2★)* reviews.
- **Context-Aware AI Reply Generator**: Generates realistic, empathetic responses in English with polite Indian phrasing.
- **Inline Reply Editor**: Edit and refine AI replies before publishing.
- **Publish to Google**: Simulates live posting of owner replies with confirmation toast notifications.

### 7. ✨ AI Content Studio (`/ai-studio`)
- **Multi-Format Content Generator**:
  - Google Business Profile Posts & Updates
  - Instagram Captions & Hashtags
  - Facebook Community Posts
  - Promotional Offers & Discounts
  - Festival Marketing Copy (Diwali, Chhath, Holi, Eid)
- **Tone Tuning**: Toggle between *Warm & Friendly*, *Professional*, *Festive*, *Urgent (FOMO)*, and *Cultural*.
- **Quick Copy & Direct Schedule**: One-click clipboard copy, save to drafts, or schedule directly to the social media calendar.
- **Drafts Vault**: Stored drafts with editing and deletion capabilities.

### 8. 📱 Social Media Management (`/social-media`)
- **Multi-Channel Sync**: Unified management for Google Business, Instagram, Facebook, and WhatsApp.
- **Social Performance Stats**: Scheduled posts count, published counts, monthly reach, and engagement rates.
- **Channel Filter**: Filter feed by individual platform.
- **Create & Schedule Post Modal**: Form with live image selector, multi-platform selection checkboxes, and date/time scheduling.

### 9. 📢 Campaign Manager (`/campaigns`)
- **Local Ads Dashboard**: Manage Google Local Services Ads, Instagram ads, and WhatsApp broadcast campaigns.
- **Budget Tracking in INR (`₹`)**: Monitor allocated budget vs spent amount, click-through rates (CTR), and ROAS multipliers.
- **Interactive Controls**: Pause, resume, and search campaigns by status or name.
- **Create Campaign Modal**: Launch new marketing campaigns with custom target catchments and INR budgets.

### 10. 📉 Analytics & Reports (`/analytics`)
- **Date Range Selectors**: Filter data across *7 Days*, *30 Days*, *90 Days*, or *1 Year*.
- **Discovery & Intent Graphs**:
  - Recharts Area Chart for Google Maps and Search discovery impressions.
  - Recharts Bar Chart for high-intent customer actions (calls, directions).
  - Recharts Line Chart for long-term rating stability and cumulative review growth.
- **Real CSV Export**: Click **Export CSV** to trigger an instant client-side `.csv` download of all analytics data.

### 11. 🔌 Integrations Hub (`/integrations`)
- **Integration Cards**:
  - Google Business Profile (Primary Core)
  - Google Analytics 4 (GA4)
  - WhatsApp Business Cloud API
  - Instagram Professional
  - Facebook Pages
  - OpenAI GPT-4o Engine
- **Interactive Connect/Disconnect**: Toggle connection status with immediate visual feedback and state persistence.

### 12. 💳 Billing & Subscription (`/billing`)
- **Indian Pricing Plans**:
  - **Starter**: `₹999 / month` – 1 Location, 50 AI Replies, Basic SEO, Weekly Sync.
  - **Growth (Popular)**: `₹1,999 / month` – Up to 3 Locations, Unlimited AI Replies, Full SEO, Competitor Radar.
  - **Business Pro**: `₹3,999 / month` – Up to 10 Locations, Multi-user Team Roles, WhatsApp Automation, White-label Reports.
- **Billing Cycle Toggle**: Monthly vs Annual (with 20% discount badge).
- **Interactive Upgrade Modal**: Simulated payment checkout via Razorpay with instant plan activation.
- **Tax Invoices**: Download simulated GST invoices in PDF format.

### 13. ⚙️ Workspace Settings (`/settings`)
- **Business Profile Settings**: Edit business name, category, phone, physical address, and Indian GSTIN number.
- **Admin Account**: Manage admin display name and credentials.
- **Team Management**: Invite new team members with granular roles (*Location Manager*, *Marketing Editor*, *Read-Only Analyst*) and delete members.
- **Notification Preferences**: Toggle switches for negative review alerts, weekly performance digests, WhatsApp lead pings, and rank shift alerts.
- **Security**: Toggle two-factor authentication (2FA) and copy public API keys.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Component architecture, state hooks, and Context API |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) | Utility-first styling, custom keyframe animations, responsive design |
| **Build Tool** | [Vite 8](https://vite.dev/) | Next-generation frontend tooling with instant HMR |
| **Navigation** | [React Router v7](https://reactrouter.com/) | HashRouter for seamless routing without server rewrites |
| **Icons** | [Lucide React](https://lucide.dev/) | Crisp, consistent SVG icons across all modules |
| **Charts** | [Recharts 3](https://recharts.org/) | Responsive SVG charts (Area, Bar, and Line charts) |
| **State & Storage** | React Context + `localStorage` | Client-side persistence for business data, reviews, and settings |

---

## 📂 Project Directory Structure

```
marketmitra/
├── index.html                     # HTML5 entry with Google Fonts (Plus Jakarta Sans, Inter)
├── package.json                   # Project scripts and dependencies
├── postcss.config.js              # PostCSS configuration for Tailwind CSS
├── tailwind.config.js             # Tailwind CSS theme, palette, and keyframe animations
├── vite.config.js                 # Vite bundler configuration with React plugin
├── src/
│   ├── main.jsx                   # React root entry point
│   ├── App.jsx                    # Route mapping and context providers
│   ├── index.css                  # Tailwind directives and custom scrollbars
│   ├── context/
│   │   ├── BusinessContext.jsx    # Global business state, reviews, campaigns & persistence
│   │   └── ToastContext.jsx       # Alert toast notification system
│   ├── data/
│   │   └── mockData.js            # Initial Indian business datasets, reviews, and keywords
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx          # Reusable status badges
│   │   │   ├── DemoNotice.jsx     # Prototype simulation disclosure banner
│   │   │   ├── LiveSimulatorPill.jsx # Floating interactive demo toolbar
│   │   │   ├── MetricCard.jsx     # Reusable KPI card with growth indicator
│   │   │   ├── Modal.jsx          # Accessible dialog with backdrop and escape key support
│   │   │   └── ToastContainer.jsx # Floating toast notification alerts
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx      # Main application shell
│   │   │   ├── Header.jsx         # Sticky header with location selector and notifications
│   │   │   ├── Sidebar.jsx        # Collapsible desktop sidebar navigation
│   │   │   └── MobileNav.jsx       # Responsive mobile slide-out drawer
│   │   └── modals/
│   │       ├── AddBusinessModal.jsx       # Add new location modal
│   │       ├── AddCompetitorModal.jsx     # Track competitor modal
│   │       ├── ConnectGoogleModal.jsx     # Simulated Google OAuth modal
│   │       ├── CreateCampaignModal.jsx    # Create marketing campaign modal
│   │       ├── CreateSocialPostModal.jsx  # Schedule social post modal
│   │       └── UpgradePlanModal.jsx       # Subscription upgrade modal
│   └── pages/
│       ├── Overview.jsx           # Module 1: Dashboard Overview
│       ├── MyBusinesses.jsx       # Module 2: Locations Manager
│       ├── GoogleBusiness.jsx     # Module 3: Google Business Profile
│       ├── LocalSEO.jsx           # Module 4: Local SEO & Rankings
│       ├── CompetitorAnalysis.jsx # Module 5: Competitor Radar
│       ├── ReviewsManagement.jsx  # Module 6: Reviews & Reputation
│       ├── AIContentStudio.jsx    # Module 7: AI Copywriter Studio
│       ├── SocialMedia.jsx        # Module 8: Social Scheduler
│       ├── CampaignManager.jsx    # Module 9: Ads & Campaigns
│       ├── AnalyticsReports.jsx   # Module 10: Analytics & CSV Export
│       ├── Integrations.jsx       # Module 11: Connected Apps
│       ├── BillingSubscription.jsx# Module 12: Pricing & Invoices
│       └── Settings.jsx           # Module 13: Account & Team Settings
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your system.

```bash
node -v
npm -v
```

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd c:\market\marketmitra
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the local development server with Vite:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

Compile and bundle the production-ready static assets:

```bash
npm run build
```

The optimized output will be generated in the `dist/` directory.

### Previewing the Production Build

Test the production bundle locally:

```bash
npm run preview
```

### Code Quality & Linting

Run Oxlint to check code quality:

```bash
npm run lint
```

---

## 💡 Prototype & Demo Disclaimers

- **Simulated Environment**: All metrics, search volumes, review submissions, and Google OAuth connections are executed client-side using realistic mock data for prototype demonstration.
- **No Real Google API Credentials Required**: No live Google Cloud or Google Business Profile API keys are required to explore all features.
- **Data Persistence**: Any added businesses, campaigns, modified review responses, and saved drafts persist across sessions via browser `localStorage`. Click the reset button in the user profile menu to return to default sample data at any time.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
