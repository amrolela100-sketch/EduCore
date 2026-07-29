<div align="center">
  <img src="public/github/banner.png" alt="EduCore Banner" width="100%" style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />

  <br />
  <br />

  <h1>🚀 EduCore Platform</h1>
  
  <p>
    <b>The Next-Generation AI-Powered Education & Recruitment Ecosystem.</b>
  </p>

  <p>
    <a href="https://github.com/amrolela100-sketch/EduCore/actions/workflows/ci.yml">
      <img src="https://github.com/amrolela100-sketch/EduCore/actions/workflows/ci.yml/badge.svg" alt="CI/CD Status" />
    </a>
    <a href="https://nextjs.org/">
      <img src="https://img.shields.io/badge/Next.js-15+-black?style=flat&logo=next.js" alt="Next.js" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript" alt="TypeScript" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css" alt="Tailwind CSS" />
    </a>
    <a href="https://www.prisma.io/">
      <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma" alt="Prisma" />
    </a>
  </p>
</div>

<hr />

## ✨ About EduCore

**EduCore** is a state-of-the-art platform designed to bridge the gap between education and the professional world. Built with a powerful AI architecture, EduCore provides advanced candidate profiling, automated CV tailoring, smart job matching, and AI-driven technical interviews. 

Whether you're an HR administrator looking for the perfect match, a technical admin wanting deep insights, or a candidate aiming for the best career path, EduCore acts as your intelligent copilot.

---

## 🔥 Key Features

- **🧠 AI-Powered Job Matching**: Uses advanced generative AI to analyze CVs against job requirements and provide a highly accurate gap analysis.
- **📄 Smart CV Tailoring**: Automatically highlights relevant skills and reorganizes candidate resumes based on specific job postings.
- **💻 Interactive AI Interviews**: Conducts real-time coding and behavioral interviews, complete with instant code telemetry and evaluation.
- **📊 Comprehensive Dashboards**: Tailored experiences for Candidates, HR Admins, Tech Admins, and System Admins.
- **🛡️ Enterprise-Grade Security**: Strict Role-Based Access Control (RBAC), API key encryption, and robust server-side validation.
- **⚡ Blazing Fast Performance**: Built on Next.js App Router, React 19, and optimized for serverless deployments on Vercel and Neon Database.

---

## 🏗️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Database**: [PostgreSQL (Neon)](https://neon.tech/) with [Prisma ORM](https://www.prisma.io/)
- **AI Integration**: [Google Gemini](https://ai.google.dev/) via AI SDK
- **Testing**: [Vitest](https://vitest.dev/) (Unit) & [Playwright](https://playwright.dev/) (E2E)
- **CI/CD**: GitHub Actions

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 22.0.0
- pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amrolela100-sketch/EduCore.git
   cd EduCore
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Fill in your database URL and API keys in .env
   ```

4. **Initialize the database:**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Start the development server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 🧪 Testing

The project maintains a high standard of quality through rigorous testing.

```bash
# Run unit tests
pnpm test:unit

# Run end-to-end tests
pnpm test:e2e
```

---

<div align="center">
  <p>Built with ❤️ for the future of education and recruitment.</p>
</div>
