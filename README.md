# TaskHive — Micro Task & Earning Platform

A full-stack micro-tasking platform where Workers complete small tasks to earn coins and Buyers post tasks to get work done. Built with React, Vite, Node.js, Express, and MongoDB.

---

## Admin Credentials

| Field          | Value                        |
|----------------|------------------------------|
| Admin Email    | admin@taskhive.com           |
| Admin Password | Admin@TaskHive123            |
| Live Site URL  | (deploy URL — update after deployment) |

---

## Features

- **Three-role system** — Worker, Buyer, and Admin each have a dedicated dashboard with role-specific navigation and access control
- **Coin economy** — Buyers purchase coins (10 coins = $1) to fund tasks; Workers earn coins by completing tasks and withdraw at 20 coins = $1, ensuring platform revenue
- **Task marketplace** — Buyers create tasks with required worker count and payable amount; Workers browse and submit work via a detail page
- **Stripe payment integration** — Buyers top up coin balance using real Stripe payment flow with four pricing tiers ($1, $10, $20, $35)
- **Submission review workflow** — Buyers approve or reject Worker submissions; approved submissions credit coins to the Worker instantly
- **Real-time notification system** — In-app floating notifications alert Workers on approval/rejection and Buyers on new submissions
- **Role-based route protection** — Private routes persist auth state across page reloads; server middleware enforces Worker/Buyer/Admin access per endpoint
- **Image upload via imgBB** — Profile pictures and task images are uploaded through the imgBB API and stored as URLs
- **Responsive design** — Fully responsive across mobile, tablet, and desktop including the dashboard layout
- **Top Workers leaderboard** — Homepage dynamically displays the 6 workers with the highest coin balances fetched from the database
- **Paginated submissions** — Worker's My Submissions page loads data per page for efficient navigation of large submission histories
- **Withdrawal system** — Workers request payouts (minimum 200 coins) via Bkash, Rocket, Nagad, Stripe, or other payment systems; Admin approves from the dashboard

---

## Tech Stack

**Client:** React, Vite, TypeScript, TailwindCSS, React Router v6, Firebase Auth, Axios, Swiper, Stripe.js

**Server:** Node.js, Express.js, MongoDB (native driver), Firebase Admin SDK, Stripe SDK, JWT, dotenv
