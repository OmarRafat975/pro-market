# ProMarket — NestJS + Next.js E-Commerce

A full-stack e-commerce prototype built with **NestJS (API)** and **Next.js (frontend)**. It supports two roles—**Admin** and **Customer**—with authentication, product management, orders, and a clean inline-edit admin UI. The frontend uses **SWR** for data fetching with **optimistic updates** and **server-driven pagination**.

> Dev defaults: **API** `http://localhost:3000`, **Frontend** `http://localhost:3001`.

---

## Table of Contents

- [ProMarket — NestJS + Next.js E-Commerce](#promarket--nestjs--nextjs-e-commerce)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Install](#install)
- [environment-variables](#environment-variables)
- [Backend — backend/.env](#backend--backendenv)
      - [Database](#database)
      - [JWT](#jwt)
      - [CORS](#cors)
- [Frontend — frontend/.env](#frontend--frontendenv)
      - [Frontend .env](#frontend-env)
- [Run](#run)
- [Backend](#backend)
- [Frontend](#frontend)
- [Seeding Data](#seeding-data)
- [API Overview](#api-overview)
- [Frontend UX Notes](#frontend-ux-notes)
    - [Auth](#auth)
    - [TypeScript niceties](#typescript-niceties)
    - [Images in Next.js](#images-in-nextjs)
- [Scripts](#scripts)
    - [Backend](#backend-1)
    - [Frontend](#frontend-1)
- [Deployment Notes](#deployment-notes)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

- **Auth (JWT)**: signup, login, refresh token.
- **Roles & Guards**: Admin vs Customer protected routes.
- **Products**
  - Admin: CRUD, inline edit (name, category, description, price, stock, image).
  - Customer: list + filter by category, **server-driven pagination**.
- **Orders**: place orders (customer), update status (admin).
- **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **SWR**, **Zustand**.
- **Optimistic UI** for updates & deletes (with rollback on error).
- **Graceful image fallbacks**.

---

## Tech Stack

- **Backend**: NestJS, Mongoose, JWT, Class-Validator, Bcrypt
- **Database**: MongoDB (Atlas or local)
- **Frontend**: Next.js 15 (App Router), TypeScript, SWR, Tailwind CSS, Zustand
- **HTTP**: Axios
- **Tooling**: ESLint, Prettier, (optional) Jest

---

## Project Structure

```
└── 📁backend
    └── 📁api_info
        ├── api.json
        ├── api.md
    └── 📁src
        └── 📁auth
            └── 📁decorators
                ├── user.decorator.ts
            └── 📁dtos
                ├── login.dto.ts
                ├── register.dto.ts
            └── 📁guards
                ├── admin-role.guard.ts
                ├── auth-access.guard.ts
                ├── auth-refresh.guard.ts
            └── 📁schemas
                ├── user.schema.ts
            ├── auth.controller.ts
            ├── auth.module.ts
            ├── auth.service.ts
        └── 📁orders
            └── 📁dto
                ├── create-order.dto.ts
                ├── update-order.dto.ts
            └── 📁schemas
                ├── order.schema.ts
            ├── orders.controller.ts
            ├── orders.module.ts
            ├── orders.service.ts
        └── 📁products
            └── 📁dto
                ├── create-product.dto.ts
                ├── products-query.dto.ts
                ├── update-product.dto.ts
            └── 📁schemas
                ├── product.schema.ts
            ├── products.controller.ts
            ├── products.module.ts
            ├── products.service.ts
        ├── app.controller.ts
        ├── app.module.ts
        ├── main.ts
    ├── .env
    ├── .gitignore
    ├── .prettierrc
    ├── eslint.config.mjs
    ├── nest-cli.json
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── tsconfig.build.json
    ├── tsconfig.json
    └── vercel.json
```

```
└── 📁frontend
    └── 📁apis
        ├── auth.ts
        ├── orders.ts
        ├── products.ts
    └── 📁app
        └── 📁(auth)
            └── 📁login
                ├── page.tsx
            └── 📁register
                ├── page.tsx
        └── 📁admin
            └── 📁list
                ├── page.tsx
            └── 📁orders
                ├── page.tsx
            ├── layout.tsx
            ├── page.tsx
        └── 📁cart
            ├── page.tsx
        └── 📁orders
            ├── page.tsx
        ├── favicon.ico
        ├── globals.css
        ├── layout.tsx
        ├── not-found.tsx
        ├── page.tsx
    └── 📁components
        └── 📁Cart
            ├── ItemCard.tsx
        └── 📁Navbar
            ├── Navbar.tsx
            ├── NavLink.tsx
            ├── UserNav.tsx
        └── 📁Order
            ├── OrderCard.tsx
            ├── OrderList.tsx
            ├── StatusBadge.tsx
        └── 📁Product
            ├── AddCartButton.tsx
            ├── CategorySelect.tsx
            ├── ProductCard.tsx
            ├── SearchBar.tsx
        └── 📁UI
            ├── PaginationButtons.tsx
        ├── CheckAuth.tsx
    └── 📁lib
        ├── axios.ts
        ├── utils.ts
        ├── validation.ts
    └── 📁public
        ├── logo.png
        ├── no-image.png
    └── 📁stores
        ├── authStore.ts
        ├── cartStore.ts
    └── 📁types
        ├── auth.ts
        ├── cart.ts
        ├── order.ts
        ├── product.ts
    ├── .env
    ├── .gitignore
    ├── eslint.config.mjs
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── README.md
    └── tsconfig.json
```

> Adjust names to match your repo if they differ.

---

## Getting Started

# Prerequisites

- Node.js 18+ (Node 22 works)
- MongoDB (local or Atlas)
- npm / pnpm / yarn

# Install

```bash
# Clone
git clone https://github.com/OmarRafat975/pro-market.git promarket
cd promarket

# Backend
cd backend
npm i

# Frontend
cd ../frontend
npm i
```

# environment-variables

# Backend — backend/.env

#### Database

DB_URI=mongodb://127.0.0.1:27017/promarket

#### JWT

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret

#### CORS

FRONTEND_URL=http://localhost:5173

# Frontend — frontend/.env

#### Frontend .env

NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Run

# Backend

```bash
cd backend
npm run start:dev
# or: npm run build && npm run start:prod
```

# Frontend

```bash
cd frontend
npm run dev
```

# Seeding Data

```bash
cd seedData
node index.js --import
```

# API Overview

```bash
cd backend/api_info
```

# Frontend UX Notes

Admin Products Page

Server-driven pagination via getProducts(page, limit, category).

Client-side search on the current page rows.

Inline editing: name, category, description, price, stock, image.

SWR with optimistic updates and rollback on failure.

Image URL change toggle + placeholder fallback.

### Auth

Zustand store (authStore) driving status, error, and login().

Login page guards: if already authenticated, show “You are already logged in”.

### TypeScript niceties

Avoid any (use unknown + narrowing).

Prefer e.currentTarget.value in React handlers to avoid unknown errors.

Inline casting helpers for numeric fields (e.g., price, stock).

### Images in Next.js

The default Next Image optimizer requires allow-listed hosts via images.remotePatterns.

If you want to accept any URL in development:

Use <Image unoptimized {...props} />, or

Set images.unoptimized: true in next.config.ts.

For production, prefer an explicit allow-list (your CDN domains).

# Scripts

### Backend

```bash
npm run start:dev     # nest dev
npm run build
npm run start:prod
npm run lint
```

### Frontend

```bash
npm run dev           # next dev
npm run build
npm run start         # serve build
npm run lint
```

# Deployment Notes

Set the environment variables on your platform (Railway, Render, Vercel, etc.).

For Next.js on Vercel with external images, configure images.remotePatterns or use unoptimized where acceptable.

Ensure CORS on the backend includes your deployed frontend origin.

# Roadmap

Admin dashboard cards (orders pending, revenue, stock alerts).

Cart & checkout UI.

Email notifications for order status.

Docker Compose for one-command dev up.

# License

MIT — no warranty.
© Omar Rafat
