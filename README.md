# MediConnect — Smart Hospital Resource & Blood Bank Availability System
> **National-Level Hackathon Healthcare Prototype | Production-Ready Architecture**

MediConnect connects patients, families, caregivers, and medical responders with transparent, verifiable information on **ICU beds, ventilators, diagnostic facilities (X-Ray, ECG, CT), and ABO/Rh blood bank inventory**.

---

## 🌟 Core Product Capabilities

1. **Hospital Resource Directory (`/hospitals`)**
   - Area, city, and service-based queries.
   - Filter by ICU, ventilators, oxygen beds, and emergency diagnostics.
   - Real-time status indicators: `AVAILABLE`, `LIMITED`, `UNAVAILABLE`, `UNKNOWN`.
   - Data provenance labels and exact minute freshness timestamps.
   - One-touch emergency triage and helpline calling.

2. **Blood Bank Directory (`/blood-banks`)**
   - Filter across all 8 ABO/Rh blood groups: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`.
   - Certified component inventory reserves and operating hours.
   - Direct laboratory phone contact action.

3. **Multilingual Text & Voice Search Assistant**
   - Natural language parsing for spoken and typed queries (e.g., *"Find ICU beds in Lucknow"*, *"O-Negative blood banks"*).
   - Voice assistant with English and Hindi (`hi-IN` / `en-IN`) speech-to-text recognition via the browser Web Speech API.
   - Graceful fallback for unsupported browsers or denied microphone permissions.

4. **Authorized Staff Portal (`/staff/dashboard`)**
   - Secure server-backed authentication with bcrypt password hashing and HTTP-only JWT sessions.
   - Role-Based Access Control (`ADMIN`, `FACILITY_STAFF`).
   - Resource status modification dialogs with immediate DB persistence.
   - Immutable audit trail ledger registering actor identity, old state, new state, and exact timestamp.

5. **Live Notification Center**
   - Interactive notification bell in navigation with unread count badges.
   - Mark individual or all notifications as read with database state persistence.

6. **Bilingual Experience & Theme System**
   - Full English and Hindi (`hi`) locale dictionaries covering navigation, badges, status labels, and disclaimers.
   - Dark mode & Light mode with zero flash and persistence.

---

## 🛡️ Trust & Safety Transparency

> [!IMPORTANT]
> **DEMO DATA NOTICE:** All sample hospital names, inventory quantities, and simulated availability are strictly tagged **DEMO DATA** in the UI and documentation. MediConnect provides informational discovery and never represents mock data as verified emergency facts. In life-threatening emergencies, dial **112** or **108** immediately.

---

## 🏗️ Architecture & Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling & Design Tokens:** Tailwind CSS with custom healthcare palette (Midnight Navy, Medical Blue, Muted Teal, Crimson Urgency)
- **Icons:** Lucide React
- **Persistence:** JSON-backed application state; Render mounts a persistent disk at `/var/data` so requests, registrations, and staff updates survive service restarts
- **Security & Validation:** `jose` (JWT), `bcryptjs` (password hashing), `zod` (runtime schema validation)
- **Testing:** Node.js native test runner with `tsx` (`tests/suite.test.ts`)
- **Deployment:** Render Web Service Blueprint (`render.yaml`)

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Node.js `v18+` or `v20+` (Tested on Node.js v24)
- npm `v9+`

### 2. Installation
```bash
git clone <repository-url>
cd MediConnect
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Production Build & Start
```bash
npm run build
npm run start
```

---

## 🧪 Automated Testing

Execute the test suite to verify database queries, audit trail logging, password hashing, JWT sessions, reset token consumption, and bilingual dictionaries:
```bash
npm test
```

Test Results Summary:
```
✔ Database: Retrieves initial facilities seeded with DEMO DATA tag
✔ Database: Retrieves blood banks and filters by blood group
✔ Database & Audit: Resource update persists and logs immutable audit entry
✔ Auth: Password hashing and verification
✔ Auth: JWT Session creation and verification
✔ Auth: Password Reset Token single-use consumption
✔ Translations: English and Hindi completeness check
All 7 tests passed (0 failures).
```

---

## 🔑 Demo Staff Credentials (Local Development)

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@mediconnect.local` | `Admin@123` | Global updates across all hospitals and blood banks |
| **Hospital Staff** | `staff.apollo@mediconnect.local` | `Staff@123` | Apollo Medics Hospital resources & triage updates |
| **Hospital Staff** | `staff.max@mediconnect.local` | `Staff@123` | Max Super Speciality Hospital Delhi updates |

---

## 🌐 Render Deployment Guide

MediConnect is configured for deployment on Render with persistent application storage:

1. Push your repository to GitHub or GitLab.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** and select **Blueprint**.
3. Connect your repository containing `render.yaml`.
4. Review the Blueprint resources and create them. Render will configure:
   - **Web Service:** `mediconnect-app`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Health Check Path:** `/api/health`
   - **Environment Variables:** `NODE_ENV=production`, `PORT=10000`, generated `JWT_SECRET`, and `MEDICONNECT_DATA_FILE=/var/data/database.json`
   - **Persistent Disk:** a 1 GB disk mounted at `/var/data` for the JSON database
5. Once deployed, verify `https://<your-service>.onrender.com/api/health` returns `HTTP 200 OK`.

The persistent disk keeps the JSON store across restarts, but it is intended for a single web-service instance and does not provide multi-instance database coordination.

---

## 📄 License & Attribution
Designed and built for national healthcare hackathon demonstrations. Developed with public safety, transparency, and accessible design principles.
