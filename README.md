# Formation IA

A full-stack AI learning platform designed to teach modern software development and applied artificial intelligence through structured lessons, hands-on projects, and production-style reference applications.

The platform combines a complete learning experience with real-world web applications built using modern technologies such as Next.js, TypeScript, Supabase, OpenAI and Stripe.

---

## Overview

Formation IA is an educational web platform built to provide a progressive learning path from software development fundamentals to complete AI-powered applications.

The project includes:

- Structured learning modules and lessons
- User authentication and protected content
- Subscription-based access
- User dashboards and learning progression
- Certificate generation
- AI-powered features
- Full-stack reference applications
- Database migrations and Row Level Security
- Production-oriented application architecture

The goal of this project is not only to teach concepts, but also to provide complete applications that demonstrate how modern web and AI systems are designed and implemented.

---

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- App Router

### Backend & Database

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security
- Server Actions

### AI

- OpenAI API

### Payments

- Stripe

### Other

- PDF generation with `pdf-lib`
- ESLint
- Git / GitHub

---

## Main Features

### Authentication

The platform includes a complete authentication flow:

- Account registration
- Login
- Password reset
- Protected routes
- User session management

Authentication is powered by Supabase.

### Learning Platform

Users can access structured educational content through dedicated training modules.

The application provides:

- Multiple learning modules
- Progressive lessons
- Practical exercises
- Complete projects
- Restricted access based on subscription level

### User Dashboard

Authenticated users have access to a dedicated dashboard where they can manage and access their learning content.

### Subscription System

The platform includes a subscription architecture with Stripe.

Features include:

- Multiple subscription plans
- Stripe Checkout
- Subscription status synchronization
- Webhook processing
- Access control based on active subscriptions

### Certificates

Students can receive certificates after completing eligible training paths.

Certificates are generated programmatically and remain associated with the user's account.

---

## Reference Applications

One of the main characteristics of Formation IA is the inclusion of complete reference applications.

These applications demonstrate the final result of concepts taught progressively throughout the learning modules.

### PropertyMatch

`reference-apps/propertymatch`

PropertyMatch is a fictional real-estate rental search platform used as the final application for a progressive web-development module.

It demonstrates:

- Next.js App Router
- TypeScript
- Responsive UI
- Search and filtering
- Dynamic property pages
- URL-based search state
- Matching algorithms
- Persistent favorites
- Accessibility
- Application testing

The application contains a local dataset of fictional properties and does not require an external database.

**Tech stack**

`Next.js` `React` `TypeScript` `Tailwind CSS`

### LaunchCraft

`reference-apps/launchcraft`

LaunchCraft is a full-stack project management application built as a standalone reference application.

It demonstrates a more advanced architecture involving authentication, a database and secure user-specific data.

Features include:

- User authentication
- Project management
- Supabase PostgreSQL database
- Server Actions
- Row Level Security
- User-specific data isolation
- Type-safe application architecture
- Automated tests

LaunchCraft uses its own Supabase project and follows security practices such as retrieving the authenticated user directly from the session and protecting database tables using RLS policies.

**Tech stack**

`Next.js` `React` `TypeScript` `Tailwind CSS` `Supabase` `PostgreSQL`

---

## Project Structure

```text
formation-ia/
│
├── app/
│   ├── abonnement/
│   ├── api/
│   ├── certificat/
│   ├── connexion/
│   ├── dashboard/
│   ├── formation/
│   ├── inscription/
│   ├── projets/
│   └── tarifs/
│
├── components/
├── docs/
├── lib/
├── public/
│
├── reference-apps/
│   ├── propertymatch/
│   ├── propertymatch-checkpoints/
│   └── launchcraft/
│
├── supabase/
│   └── migrations/
│
└── package.json
```

---

## Getting Started

### Requirements

- Node.js
- npm
- Supabase project
- Stripe account
- OpenAI API key

### Installation

Clone the repository:

```bash
git clone https://github.com/erwan75019/formation-ia.git
cd formation-ia
```

Install dependencies:

```bash
npm install
```

Create your local environment configuration:

```bash
cp .env.example .env.local
```

Add the required environment variables for Supabase, Stripe and OpenAI.

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## Development

Available commands:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Individual reference applications also contain their own configuration, dependencies and documentation.

---

## Security

Several security mechanisms are implemented throughout the project:

- Supabase Row Level Security
- Authenticated Server Actions
- User-specific data access
- Protected application routes
- Secure subscription synchronization
- Environment-based secret management

Sensitive credentials and service keys must never be committed to the repository.

---

## Project Goals

This project was built to explore and apply several areas of software engineering and artificial intelligence:

- Full-stack application development
- Modern React and Next.js architecture
- Database design
- Authentication and authorization
- API integration
- AI integration
- Payment systems
- Software architecture
- Testing
- Security
- Production-oriented development

---

## Author

**Erwan Vangu**

Engineering student at ENSISA  
Computer Science & Networks — Data Science & Artificial Intelligence

GitHub: [@erwan75019](https://github.com/erwan75019)
