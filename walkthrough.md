# Walkthrough — Complete Autonomous Recruitment Hub

We have successfully completed all phases of the **Autonomous Recruitment Hub**! The application features a fully auditable backend pipeline, AI-driven candidate matching and coding test evaluation, next-auth role-based access controls, and a high-fidelity visual design system built with Space Grotesk and IBM Plex Sans.

---

## Technical Architecture Overview

Here is the complete data flow of the recruitment hub:

```mermaid
graph TD
  User[User / Candidate] -->|Sign Up / Login| Auth[NextAuth.js RBAC]
  User -->|Uploads Resume| ResumeAPI[/api/upload-resume]
  ResumeAPI -->|Extracts Text| Parser[Resume Parser Service]
  Parser -->|Gemini Structuring| DB[(Neon PostgreSQL)]
  
  User -->|Apply to Job| ApplyAPI[/api/apply]
  ApplyAPI -->|Embeddings + Rules| Matcher[Match Calculator]
  Matcher -->|Match Score + Reason| DB
  
  User -->|Coding Test| InterviewUI[Interview Interface]
  InterviewUI -->|Submit Code| EvalAPI[/api/evaluate-interview]
  EvalAPI -->|Gemini Evaluation| Assessment[AI Evaluator Trace]
  Assessment -->|Overall Score + Audit Trace| DB
  
  HR[HR Admin] -->|View Pipeline| HRDash[/admin/hr]
  HRDash -->|Human Override Decision| Action[Override Server Action]
  Action -->|Log to Compliance Ledger| DB
  
  Tech[Tech Admin] -->|Code Review| TechDash[/admin/tech]
  TechDash -->|Inspect Sandbox Output| Logs[Sandbox Logs]
```

---

## Detailed Implementation Breakdown

### 1. Database & Seeding (Neon Serverless & Raw SQL)
- **Shared Connection Adapter:** Configured [db.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/lib/db.ts) to utilize the WebSocket-based `@neondatabase/serverless` connection pool.
- **Robust Database Seed:** Overwrote [run-seed.js](file:///c:/Users/ASUS/Desktop/EduCore/run-seed.js) using raw SQL queries to bypass Prisma transaction wrapping and populate the database with mock roles, users, companies, active jobs, applications, and technical evaluations.

### 2. Candidate Workspace & Application Pipeline
- **Landing Page ([page.tsx](file:///c:/Users/ASUS/Desktop/EduCore/src/app/page.tsx)):** Dynamically displays open positions queried from the Neon Database.
- **Login Portal ([login/page.tsx](file:///c:/Users/ASUS/Desktop/EduCore/src/app/login/page.tsx)):** Provides credentials authentication, role verification, and registration.
- **Candidate Dashboard ([candidate/page.tsx](file:///c:/Users/ASUS/Desktop/EduCore/src/app/candidate/page.tsx)):** Highlights core skills, work history, active job match scores, and has a file input wrapper for resume uploads.
- **Resume Upload Endpoints ([api/upload-resume/route.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/app/api/upload-resume/route.ts)):** Extracts raw text from uploads and uses Gemini (`gemini-1.5-flash`) via the Vercel AI SDK to structure skills, experience, and projects.
- **Apply & Match Endpoint ([api/apply/route.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/app/api/apply/route.ts)):** Connects candidate skills to jobs, computes match percentages, and provisions coding interview sessions.

### 3. Sandboxed Coding Interviews & AI Evaluation
- **Interview Session Screen ([interview/[id]/page.tsx](file:///c:/Users/ASUS/Desktop/EduCore/src/app/candidate/interview/%5Bid%5D/page.tsx)):** Renders a split-pane layout containing code input terminals and written questions.
- **AI Evaluation Endpoints ([api/evaluate-interview/route.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/app/api/evaluate-interview/route.ts)):** Invokes Gemini to score dimensions (code quality, problem solving, communication), formats compliance justifications, and updates match scores in a database transaction.

### 4. Admin Portals & Human Override Gates
- **HR Dashboard ([admin/hr/page.tsx](file:///c:/Users/ASUS/Desktop/EduCore/src/app/admin/hr/page.tsx)):** Displays all applicant pipelines in a data table showing AI matching reasons.
- **Compliance Override Modal ([hr-override-form.tsx](file:///c:/Users/ASUS/Desktop/EduCore/src/components/hr-override-form.tsx)):** Allows HR administrators to override AI recommendations, changing the status (e.g. `ACCEPTED` / `REJECTED`) and saving natural language justifications in the audit ledger.
- **Tech Admin Portal ([admin/tech/page.tsx](file:///c:/Users/ASUS/Desktop/EduCore/src/app/admin/tech/page.tsx)):** Evaluates submissions side-by-side, displaying standard outputs, cyclomatic complexity scores, and executing sandbox logs.

---

## Verification & Build Results

- **TypeScript Typecheck:** ran `pnpm tsc --noEmit` which completed successfully with zero compilation or syntax errors.
- **Production Bundle:** successfully ran `pnpm run build` using Next.js Turbopack compiler, generating optimized production routes for all dynamic dashboards and static landing pages.
