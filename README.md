# 🛂 PassportAI — Automated Immigration Clearance System

A full-stack **React.js simulation** of an AI-powered airport immigration processing system, built from a UML sequence diagram. Features a passenger flow, real-time AI pipeline, and a dedicated Immigration Officer portal.

---

## 📁 Project Structure

```
passport-app/
│
├── index.html                     # Entry point — loads React CDN + all scripts
├── App.js                         # Root app — page routing & shared state
│
├── pages/
│   ├── HomePage.js                # Landing page with hero, how-it-works, stats
│   ├── ApplicantPage.js           # Passport form + biometric scan + outcome selector
│   ├── ProcessingPage.js          # Animated AI pipeline (sequence diagram)
│   ├── ResultPage.js              # Final verdict with next steps
│   ├── OfficerLoginPage.js        # Immigration officer secure login
│   └── OfficerDashboardPage.js    # Officer case queue, review & action panel
│
├── components/
│   ├── Header.js                  # Sticky nav bar with Officer Portal button
│   ├── ProgressSteps.js           # Wizard step indicator (1 → 2 → 3)
│   ├── StepCard.js                # Reusable pipeline step card
│   ├── OfficerAlert.js            # Officer alert panel inside processing page
│   └── StatsBar.js                # Session statistics counter
│
└── styles/
    ├── global.css                 # CSS variables, reset, shared utilities
    ├── home.css                   # Home page styles
    ├── applicant.css              # Form, scan zone, outcome selector
    ├── processing.css             # Pipeline, actors bar, activity log
    ├── result.css                 # Verdict card, detail grid, next steps
    └── officer.css                # Login page + full dashboard styles
```

---

## 🚀 How to Run

> ⚠️ **Do NOT open `index.html` by double-clicking.** The app loads files via relative paths which browsers block under `file://` due to CORS. Use a local server instead.

### Option 1 — VS Code Live Server *(Recommended)*

1. Open the `passport-app/` folder in **VS Code**
2. Install the **Live Server** extension by Ritwick Dey
3. Right-click `index.html` → **Open with Live Server**
4. Browser opens at `http://127.0.0.1:5500`

### Option 2 — Python

```bash
# Python 3
cd passport-app
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```
Open `http://localhost:3000`

### Option 3 — Node.js serve

```bash
npm install -g serve
cd passport-app
serve .
```

### Requirements
- ✅ Internet connection (React 18, Babel, and Google Fonts load from CDN)
- ✅ Any modern browser (Chrome, Firefox, Edge, Safari)
- ✅ No `npm install`, no build step, no bundler needed

---

## 🎯 Features

### 👤 Passenger Flow (4 Pages)

| Page | Description |
|------|-------------|
| **Home** | Hero section, how-it-works cards, live session statistics |
| **Applicant** | Full passport form (name, nationality, DOB, expiry, gender), animated biometric scan, simulation outcome selector |
| **Processing** | Animated step-by-step AI pipeline matching the UML sequence diagram — actors bar, progress bar, live activity log |
| **Result** | Final verdict card, applicant & document details, next-steps guide |

### 🤖 AI Processing Pipeline (Sequence Diagram)

The processing page simulates all 15 steps from the original sequence diagram:

```
Applicant → System → AI Automation → Immigration Officer

Step 01  Scan Passport at Airport
Step 02  Send Face Data and Documents
Step 03  Validate Documents
Step 04  Verify Face and Document Match
Step 05  Reverification (watchlist, travel history)

── APPROVED path ──────────────────────
Step 09  Allow Boarding
Step 10  View Verification Result
Step 11  Boarding to the Aircraft

── SUSPICIOUS path ────────────────────
Step 06  Auto Alert to Officer
Step 07  Send Face Data to Officer Desk
Step 08  Verification Result Sent (pending decision)

── REJECTED path ──────────────────────
Step 12  Reject or Hold Passenger
Step 13  Allow Boarding — Denied
Step 14  Stop or Secondary Check
Step 15  Boarding to Aircraft — Prevented
```

### 👮 Officer Portal

#### Login Page
- Split-panel design — blue hero on left, secure form on right
- Three credentials required: **Username**, **Password**, **Badge ID**
- One-click demo account buttons for quick testing

#### Officer Dashboard
- **Case Queue** — live list of all AI-flagged / rejected passengers
- **Filter Pills** — All / Pending / Approved / Rejected / On Hold
- **Case Detail Panel** — click any case to view:
  - Full applicant and document information
  - 7-point AI verification breakdown (pass / warn / fail per check)
  - Officer notes field
  - Action buttons: Approve, Hold, Reject
- **Auto-populated** — suspicious/rejected passengers from the main flow appear automatically
- **4 pre-seeded demo cases** available on first login

---

## 🔐 Demo Credentials

### Officer Accounts

| Name | Username | Password | Badge ID | Role |
|------|----------|----------|----------|------|
| Rajesh Kumar | `officer.raj` | `secure123` | `OFF-001` | Senior Immigration Officer |
| Priya Nair | `officer.priya` | `secure456` | `OFF-002` | Immigration Officer |
| Admin User | `admin` | `admin123` | `ADM-001` | Duty Manager |

---

## 🎨 Design

- **Theme:** Peaceful white / light — clean, airy, professional
- **Fonts:** `Lora` (serif display) + `DM Sans` (body) + `DM Mono` (code/labels)
- **Colors:** Soft `#f4f7ff` base, `#2563eb` blue accents, semantic green / yellow / red for outcomes
- **Animations:** Scan line animation, staggered step card reveals, progress bar fill, fade-up page transitions

---

## 🗺️ Page Navigation Map

```
Home ──────────────────────────────────────────────────────────┐
  │                                                             │
  ├── Begin Simulation                                          │
  │         ↓                                                   │
  │    Applicant Page                                           │
  │     (fill form + scan + choose outcome)                     │
  │         ↓                                                   │
  │    Processing Page                                          │
  │     (animated pipeline runs)                                │
  │         ↓                                                   │
  │    Result Page                                              │
  │     (verdict + next steps)                                  │
  │         ↓                                                   │
  │    Process New Passenger ──────────────→ Applicant Page     │
  │                                                             │
  └── Officer Portal button (header)                           │
            ↓                                                   │
       Officer Login Page                                       │
            ↓  (enter credentials)                              │
       Officer Dashboard                                        │
        ├── View case queue                                      │
        ├── Filter by status                                     │
        ├── Select case → view AI checks                        │
        ├── Add notes                                            │
        └── Approve / Hold / Reject ──────────────→ Sign Out ──┘
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 (via CDN — no build tool) |
| JSX Transform | Babel Standalone |
| Styling | Plain CSS with CSS custom properties |
| Fonts | Google Fonts (Lora, DM Sans, DM Mono) |
| State Management | React `useState`, `useMemo`, `useEffect` |
| Routing | Custom in-memory page state (no React Router needed) |
| Data Persistence | In-memory (session only — resets on refresh) |

---

## 📌 Notes

- **No backend** — this is a pure front-end simulation. All "AI checks" and decisions are simulated with `setTimeout` delays and the outcome you select.
- **Session data resets** on page refresh. To persist data across sessions, a backend (Node.js + DB) or `localStorage` would need to be added.
- **Sequence diagram fidelity** — all 15 steps from the original UML sequence diagram are implemented in the Processing page pipeline.

---

## 📄 License

This project is for educational and demonstration purposes.
