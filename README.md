# Sree Hari Realty Promoters – Real Estate Platform

A modern, high-performance, mobile-first full-stack real-estate web application developed for **Sree Hari Realty Promoters**, specializing in selling **Land / Plots** through DTCP & RERA approved gated-community developments in prime growth corridors.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: Next.js 14 (App Router) + React + TypeScript + Tailwind CSS + Lucide Icons
- **Backend**: Node.js + Express.js + TypeScript + Zod validation + Multer + Helmet
- **Database**: PostgreSQL (UUID Primary Keys, normalized schema, indexes, migrations & seeds)
- **Authentication**: JWT-based stateless authentication with secure bcrypt password hashing
- **Communication**: RESTful JSON API (`{ success, message, data }` format)

---

## 🌟 Key Features

### 1. Public Website
- **Hero & Value Proposition**: Land & plot offerings, USP metrics (100% clear titles, DTCP & RERA approved, 80% bank loans).
- **Featured Projects & Plots**: Rich cards with location, size, pricing, dimensions, and status badges.
- **Dynamic SEO Project Details (`/projects/[slug]`)**: Overview, highlights, individual plot inventory, master amenities grid, location connectivity matrix, image showcase.
- **About Us (`/about`)**: Company background, mission, vision, and legal title verification pedigree.
- **Contact Us (`/contact`)**: Interactive enquiry submission, direct office address, business hours, and click-to-call.
- **High-Conversion Lead Capture**: Project/Plot-level enquiry modals, general enquiry forms, pre-filled WhatsApp link generation (`https://wa.me/...?text=...`), and `tel:` mobile dialing.

### 2. Admin Management Panel (`/admin`)
- **Protected Access**: JWT token authentication with auto-redirects and secure credential hashing.
- **Interactive Dashboard (`/admin/dashboard`)**: Key summary counters (Total Projects, Active Projects, Total Plots, Available Plots, Total Leads, New Leads) + Recent incoming leads table with inline status toggling.
- **Projects Management (`/admin/projects`)**: Create, edit, toggle visibility, and delete gated community plot projects.
- **Plots Inventory (`/admin/properties`)**: Manage individual plots with plot numbers, dimensions (e.g. 30x40 ft), facing (East, North, Corner), area in sq.ft, and status (Available, Booked, Sold).
- **Lead Pipeline (`/admin/leads`)**: View all buyer enquiries, filter by status (`NEW`, `CONTACTED`, `FOLLOW_UP`, `CONVERTED`, `ARCHIVED`), search by buyer details, add internal notes, and click-to-call buyers directly.

### 3. SEO & Performance
- Dynamic XML sitemap (`/sitemap.xml`)
- Search engine robots configuration (`/robots.txt`)
- Open Graph social share metadata
- Semantic HTML5 headings (`h1`, `h2`, `h3`) with mobile-first viewport optimization

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- NPM

### 1. Backend Setup

```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Run database migrations
npm run migrate

# (Optional) Seed initial demo projects and admin account
npm run seed

# Start development server
npm run dev
```
Backend will start on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install

# Copy environment variables
cp .env.example .env.local

# Start Next.js development server
npm run dev
```
Frontend will be available on `http://localhost:3000`.

---

## 🔐 Default Admin Credentials

- **Email**: `admin@sreeharirealty.com`
- **Password**: `AdminPassword@2026`
- **Portal URL**: `http://localhost:3000/admin/login`

---

## 📁 Repository Structure

```
real-estate/
├── frontend/                     # Next.js App Router Application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── app/                  # Public & Admin Pages
│   │   ├── components/           # UI, Forms, Layout, Admin Controls
│   │   ├── lib/                  # Centralized API client & utility functions
│   │   └── types/                # TypeScript Interfaces
│   └── package.json
│
├── backend/                      # Express REST API Backend
│   ├── src/
│   │   ├── config/               # Database pool & environment variables
│   │   ├── controllers/          # API Controllers (auth, projects, properties, leads, contact)
│   │   ├── middleware/           # JWT auth, validation, error handler, multer upload
│   │   ├── routes/               # Express REST Routes
│   │   ├── database/             # Migration & seed runner scripts
│   │   └── server.ts             # Express Server entrypoint
│   └── package.json
│
├── database/                     # PostgreSQL DDL Migrations
│   └── schema.sql                # Complete SQL Schema
│
└── docs/                         # Detailed Documentation
    ├── API_DOCUMENTATION.md
    ├── DATABASE_SCHEMA.md
    └── SETUP_GUIDE.md
```

---

## 🧪 Verification & Acceptance Testing

Verify the application:
1. **Frontend build test**: `cd frontend && npm run build`
2. **Backend type check**: `cd backend && npx tsc --noEmit`
3. **Health Check API**: `GET http://localhost:5000/api/health`
4. **Public Routes**: Test `/`, `/about`, `/projects`, `/projects/sri-hari-green-enclave`, `/contact`
5. **Admin Flow**: Test `/admin/login` -> `/admin/dashboard` -> `/admin/projects` -> `/admin/properties` -> `/admin/leads`
