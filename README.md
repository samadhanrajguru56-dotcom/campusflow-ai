# CAMPUSFLOW AI
### AI-Powered Smart Campus Operations Automation Platform

> **Hackathon Theme:** Smart Automation  
> **Core Principle:** *"Smart automation is not just automating a single task. It is automating the entire decision and workflow chain."*

---

## 1. Project Name
**CampusFlow AI** — Autonomous Smart Campus Operations & Preventive Facilities Platform.

---

## 2. Problem Statement
Every day, university and college campuses receive dozens of operational complaints:
- Wi-Fi, switches, routers & lab network outages
- Computer laboratory and audio-visual equipment breakdowns
- Projector lamp blowouts in active lecture halls
- HVAC, fan, lighting and electrical panel failures
- Water pipeline ruptures, leaking taps, and plumbing blocks
- Classroom and hostel maintenance issues
- Security gate biometrics and custodial sanitization requests

Currently, these issues are communicated through informal channels: **WhatsApp groups, phone calls, paper registers, emails, and spreadsheets**. This legacy approach leads to:
1. Heavy manual data entry
2. Wrong department routing
3. Delayed responses and missed deadlines
4. Duplicate complaints triggering multiple redundant technician dispatches
5. Zero centralized tracking and constant manual follow-ups
6. Lack of visibility into recurring failures and chronic equipment degradation
7. Purely reactive firefighting rather than preventive maintenance

The core problem is **NOT** simply collecting complaints.  
The real problem is:  
> *"How can a campus automatically understand operational problems, decide what should happen next, coordinate the responsible team, monitor the workflow, escalate delays, and identify recurring issues without requiring manual coordination at every step?"*

---

## 3. Why This Problem Matters
- **Academic Continuity:** A network failure or broken projector in a laboratory 30 minutes before a practical exam directly impacts student grades and faculty schedules.
- **Operational Cost & Waste:** Multiple students reporting the same outage causes duplicate work orders, confusing maintenance teams and tripling labor costs.
- **Safety Hazards:** Sparks, leaking water in server archives, or blocked emergency exits require instant sub-2-hour SLA response, which email and paper logs fail to guarantee.

---

## 4. The Solution: CampusFlow AI
**Do not just create a complaint. Automate what happens after the complaint.**

CampusFlow AI converts informal, unstructured voice or text reports into automated end-to-end operational workflows:
```
USER REPORT (Voice/Text)
       ↓
 AI UNDERSTANDS (Entity & Semantics)
       ↓
 AI CLASSIFIES (13 Campus Categories)
       ↓
 AI DETECTS DUPLICATE (Semantic Clustering into Master Incident)
       ↓
 AI ANALYZES IMPACT (Academic & Operational Disruption)
       ↓
 AI DETERMINES PRIORITY (CRITICAL / HIGH / MEDIUM / LOW)
       ↓
 AI SELECTS DEPARTMENT & RECOMMENDS ASSIGNEE
       ↓
 AUTOMATIC TASK CREATION & DYNAMIC SLA
       ↓
 STAKEHOLDER NOTIFICATION
       ↓
 BACKGROUND 60s MONITORING & 80% SLA REMINDER
       ↓
 AUTONOMOUS BREACH ESCALATION TO ADMIN
       ↓
 VERIFIED RESOLUTION & TIME AUDIT
       ↓
 RECURRING ISSUE DETECTION & PREVENTIVE ROADMAP
```

---

## 5. How AI is Used
CampusFlow AI leverages **Google Gemini (Gemini 1.5 Flash)** with an intelligent, deterministic heuristic fallback engine:
1. **Request Understanding:** Extracts entity, location, technical failure, and operational impact from unstructured natural language or voice transcripts.
2. **Intelligent Classification:** Assigns requests to one of 13 campus domains: `IT`, `NETWORK`, `ELECTRICAL`, `MAINTENANCE`, `CLEANING`, `WATER`, `HOSTEL`, `CLASSROOM`, `LAB`, `SECURITY`, `ADMINISTRATION`, `EQUIPMENT`, `OTHER`.
3. **Priority & Urgency Scoring:** Weighs factors such as upcoming exam deadlines, safety hazards, and number of affected students to calculate priority with clear reasoning.
4. **Duplicate Incident Grouping:** Compares incoming reports against active open tickets in the vicinity. Automatically links duplicates to a single Master Incident (e.g., `INC-1042`), preventing redundant staff dispatches.
5. **Smart Technician Matching:** Matches technician skill domain, current open queue, and availability status.
6. **Predictive Recurring Issue Detection:** Aggregates 30-day ticket history to pinpoint failure clusters (e.g., *Lab 3 network down 7 times*) and formulates root-cause engineering fixes before exams fail.
7. **Executive Report Generation:** Synthesizes live database metrics into a high-level briefing with KPI highlights, bottleneck departments, and roadmap recommendations.

*Note: The AI API key is strictly stored on the backend and is never exposed in client code.*

---

## 6. Smart Automation Workflow Engine
A trigger-condition-action automation engine operates continuously in the backend:
- **Trigger `TICKET_CREATED`:**
  - Evaluates priority: If `CRITICAL`, enforces a 2-hour hard SLA and issues emergency in-app notifications.
  - Checks duplicate similarity: If `confidence >= 0.80`, attaches ticket to Master Incident and increments affected user tally.
- **Trigger `SLA_80_PERCENT`:**
  - When elapsed time reaches 80% of window, dispatches an automated reminder to the technician.
- **Trigger `SLA_BREACHED`:**
  - At 100% threshold, status automatically transitions to `ESCALATED`, triggering management alerts.

---

## 7. Key Features
- 🎙 **Voice-First Problem Reporting:** Built-in Web Speech API integration allowing hands-free voice problem submission.
- ⚡ **Master Incident Duplicate Merging:** Consolidates multiple student reports into a single actionable ticket.
- ⏱ **Dynamic Real-Time SLA Countdowns:** Live visual timers with `ON TRACK`, `AT RISK` (80%), and `OVERDUE` states.
- 📊 **Executive Analytics & Trends:** Interactive charts for category distribution, priority ratios, department SLA adherence, and 4-week resolution trends.
- 🔍 **Predictive Recurring Failure Alerts:** Proactive hotspot detection with preventive maintenance prescriptions.
- 👥 **Role-Tailored Dashboards:** Dedicated hubs for Students, Faculty, Technicians, and Campus Administrators.
- ⚡ **1-Click Demo Account Switcher:** Seamlessly switch between Admin, Faculty, Technician, and Student personas.

---

## 8. Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                 React + Vite + Tailwind UI                  │
│       (Role Hubs, Voice Input, Pipeline Visualizer)         │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / Axios
┌──────────────────────────────▼──────────────────────────────┐
│                    Express.js Backend                       │
│    ├── JWT & Role-Based Access Control                      │
│    ├── Zod Schema Request Validation                        │
│    ├── Gemini Generative AI Service                         │
│    └── Autonomous Background SLA Scheduler (60s loop)       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  Database Storage Layer                     │
│    ├── Production Target: PostgreSQL (Supabase / Neon)       │
│    ├── Prisma ORM Models & Migrations                       │
│    └── Zero-Config Local Persistent Fallback Store          │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Tech Stack
- **Frontend:** React 18, Vite, React Router v6, Tailwind CSS, Lucide Icons, Recharts, Canvas-Confetti, Axios.
- **Backend:** Node.js, Express.js, Google Gemini SDK (`@google/generative-ai`), JWT, bcryptjs, Zod, Helmet, CORS, Express-Rate-Limit.
- **Database & ORM:** PostgreSQL / Prisma ORM (`prisma/schema.prisma`), dual-mode persistence.

---

## 10. Database Design & Models
Models defined in [schema.prisma](file:///c:/Users/SAMADHAN/OneDrive/Desktop/All%20coding%20quasetion/Smart%20Response/server/prisma/schema.prisma):
- `User`: Campus identity, email, passwordHash, role (`STUDENT`, `FACULTY`, `STAFF`, `ADMIN`), departmentId, isAvailable.
- `Department`: Name, description, technicians list, ticket references.
- `Ticket`: Ticket number, title, description, category, priority, urgency, location, impact, status, SLA timestamps.
- `Incident`: Master incidents grouping duplicate reports with affected user counts.
- `AIAnalysis`: Normalized AI metadata, confidence, suggested technician, and priority rationale.
- `TicketHistory`: Immutable audit ledger recording every automated and manual change.
- `Comment`: Work notes and communication threads between technicians and requesters.
- `Notification`: In-app alerts, SLA breach warnings, and resolution notices.
- `SLARule`: Configurable priority countdown hours (`CRITICAL=2`, `HIGH=6`, `MEDIUM=24`, `LOW=72`).
- `WorkflowRule`: Trigger-condition-action automated workflow specifications.
- `AutomationLog`: Execution log of automated decisions.
- `AIInsight`: Identified failure hotspots, severity levels, and preventive actions.

---

## 11. API Documentation

### Authentication
- `POST /api/auth/register` — Create user account with role selection.
- `POST /api/auth/login` — Sign in and receive JWT token.
- `GET /api/auth/me` — Retrieve current authenticated profile.
- `GET /api/auth/users` — List staff and users by department.

### Tickets
- `POST /api/tickets` — Submit problem report; triggers AI analysis, duplicate check, SLA calculation, and dispatch.
- `GET /api/tickets` — List tickets with search, category, priority, status, and location filters.
- `GET /api/tickets/:id` — Full ticket record including comments, history, and AI analysis.
- `PATCH /api/tickets/:id` — Update status, priority, or technician assignment.
- `DELETE /api/tickets/:id` — Delete ticket.
- `POST /api/tickets/:id/comments` — Post work note or update.
- `GET /api/tickets/:id/comments` — Retrieve ticket comments.
- `GET /api/tickets/:id/history` — Audit trail for ticket lifecycle.

### Incidents
- `GET /api/incidents` — List master grouped incidents.
- `GET /api/incidents/:id` — Get master incident with grouped tickets.
- `POST /api/incidents/:id/merge` — Merge tickets into master incident.
- `PATCH /api/incidents/:id` — Update master incident status.

### AI Engine
- `POST /api/ai/analyze` — NLP extraction of category, priority, impact, and SLA.
- `POST /api/ai/detect-duplicate` — Semantic similarity check against active tickets.
- `POST /api/ai/priority` — Priority assessment and justification.
- `POST /api/ai/assignment` — Recommend technician based on workload and skills.
- `POST /api/ai/generate-report` — Generate executive management report.
- `GET /api/ai/insights` — Retrieve recurring issue patterns and preventive recommendations.

### Automation Engine
- `GET /api/automation/rules` — View active workflow and SLA rules.
- `POST /api/automation/rules` — Create custom workflow rule.
- `PATCH /api/automation/rules/:id` — Toggle or update rule.
- `POST /api/automation/run` — Manually trigger SLA monitoring cycle.
- `GET /api/automation/logs` — List recent automation audit logs.

### Analytics & Notifications
- `GET /api/analytics/overview` — Operational KPIs and manual steps avoided.
- `GET /api/analytics/categories` — Category breakdown.
- `GET /api/analytics/departments` — Department workloads and SLA adherence.
- `GET /api/analytics/priorities` — Priority breakdown.
- `GET /api/analytics/sla` — SLA breakdown (`ON_TRACK`, `AT_RISK`, `OVERDUE`).
- `GET /api/analytics/trends` — 4-week resolution velocity.
- `GET /api/notifications` — User notifications and unread counter.
- `PATCH /api/notifications/:id/read` — Mark notification read.
- `PATCH /api/notifications/read-all` — Mark all notifications read.

---

## 12. Installation
Ensure Node.js (v18+) is installed.

```bash
# Clone the repository
git clone https://github.com/your-username/campusflow-ai.git
cd campusflow-ai

# Install root, backend and frontend dependencies
npm run install:all
```

---

## 13. Environment Variables
Create a `.env` file in `server/` (see `server/.env.example`):
```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/campusflow_db?schema=public"
JWT_SECRET="campusflow_super_secret_jwt_key_hackathon_2025"
GEMINI_API_KEY="" # Add your Google Gemini API key (optional; intelligent fallback active)
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```

In `client/.env` (optional, defaults to port 5000):
```env
VITE_API_URL="http://localhost:5000/api"
```

---

## 14. Local Development
Run both servers concurrently or in separate terminals:

```bash
# Start backend server (Port 5000)
npm run dev:server

# Start frontend Vite server (Port 5173)
npm run dev:client
```
Open **`http://localhost:5173`** in your browser.

---

## 15. Database Migration (PostgreSQL / Supabase / Neon)
When connecting to a remote PostgreSQL database:
```bash
cd server
npx prisma db push
```

---

## 16. Seed Command
To populate over 30 realistic campus tickets, 11 users, master incidents, SLA rules, and AI insights:
```bash
cd server
npm run prisma:seed
```

---

## 17. Demo Credentials (Password for all accounts: `password123`)

| Role | Name | Email | Password |
|---|---|---|---|
| **Admin** | Dr. Sarah Mitchell | `admin@campusflow.edu` | `password123` |
| **Faculty** | Prof. David Chen | `david.chen@campusflow.edu` | `password123` |
| **Staff / Tech** | Rajesh Kumar (IT Lead) | `rajesh.it@campusflow.edu` | `password123` |
| **Staff / Tech** | Carlos Mendez (Electrical) | `carlos.elec@campusflow.edu` | `password123` |
| **Student** | Aarav Patel | `aarav.student@campusflow.edu` | `password123` |

*Tip: Use the 1-click Quick Demo login buttons on the Login page for instant persona switching.*

---

## 18. AI API Setup (Google Gemini)
1. Get a free API key at [Google AI Studio](https://aistudio.google.com/).
2. Add your key to `server/.env`:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   ```
3. Restart the backend server.
*If no key is configured, CampusFlow AI's built-in intelligent heuristic engine handles all requests with zero downtime.*

---

## 19. Deployment

### Frontend (Vercel)
1. Push repository to GitHub.
2. Import `client/` directory into Vercel.
3. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`.
4. Deploy.

### Backend (Render / Railway)
1. Import `server/` directory into Render or Railway as a Web Service.
2. Set Build Command: `npm install`
3. Set Start Command: `npm start`
4. Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `FRONTEND_URL`.

---

## 20. Screenshots & UI Walkthrough
- **Landing Page:** Interactive workflow pipeline animation and Before-vs-After comparison.
- **Interactive Live Demo Hub (`/demo`):** Step-by-step visual demonstration of all 3 WOW scenarios.
- **Voice Report Problem:** Live speech-to-text with structured Gemini triage blueprint.
- **Admin Command Center:** Real-time KPI cards, SLA compliance gauge, and 4-week area charts.
- **AI Insights & Recurring Detection:** Failure hotspot map and 1-click executive PDF report generation.
- **Automation Center:** Active trigger-condition-action workflow rules and live execution logs.

---

## 21. 3–5 Minute Demo Flow & Video Script

```
0:00 - 0:30  PROBLEM
"Every campus receives dozens of maintenance complaints daily via fragmented WhatsApp groups 
 and paper registers, leading to delayed responses, duplicate dispatches, and zero preventive tracking."

0:30 - 1:00  INTRODUCE CAMPUSFLOW AI
"CampusFlow AI is not just a ticketing portal. It automates what happens AFTER the complaint: 
 understanding the problem, detecting duplicates, assigning staff, enforcing SLAs, and preventing recurring failures."

1:00 - 2:00  WOW DEMO 1: END-TO-END AUTOMATION
"Watch this live scenario: A student says 'Internet is not working in Lab 3 and tomorrow we have practical exams.'
 Within 2 seconds, AI identifies it as CRITICAL priority due to the upcoming exam, sets a 2-hour SLA, 
 and dispatches the task directly to Senior Network Engineer Rajesh Kumar."

2:00 - 2:40  WOW DEMO 2: DUPLICATE DETECTION
"When two other students report 'Lab 3 Wi-Fi is down' with different wording, CampusFlow AI recognizes 
 they describe the same outage, merges them into Master Incident INC-1042, and avoids sending multiple technicians."

2:40 - 3:20  AUTOMATION & SLA ESCALATION
"In the Automation Center, view the background engine monitoring active tickets. 
 At 80% SLA, it alerts the technician; if breached, it auto-escalates to the Campus Operations Director."

3:20 - 4:00  ADMIN ANALYTICS
"The Admin Dashboard provides real-time visibility into department turnaround times, 
 overall SLA adherence (92.4%), and over 200 manual coordination steps saved."

4:00 - 4:40  WOW DEMO 3: PREDICTIVE INSIGHTS
"Rather than just reacting to issues, CampusFlow AI analyzes historical data: 
 'Lab 3 network problems detected 7 times in 30 days.' It prescribes root-cause preventive maintenance: 
 replacing the aging edge switch in Rack 2 before practical exams are disrupted."

4:40 - 5:00  CONCLUSION
"Smart automation is not just automating a single task — it is automating the entire decision 
 and workflow chain. CampusFlow AI turns campus problems into automated solutions."
```

---

## 22. Future Scope
- **IoT Sensor Integration:** Direct telemetry from smart meters and environmental sensors to trigger automated tickets before humans report issues.
- **WhatsApp & Telegram Conversational Bot:** Omnichannel problem submission via webhook integrations.
- **Indoor Campus Maps & Augmented Reality Navigation:** Turn-by-turn guidance for technicians to locate faulty valves and breaker boxes.
- **Predictive Inventory Restocking:** Automatically generate supply purchase orders when recurring plumbing or electrical repairs deplete spare parts.

---

*Built with ❤️ for the Smart Automation Hackathon.*
