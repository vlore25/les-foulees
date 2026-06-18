## Les Foulées Avrillaises

Les Foulées is a comprehensive management platform designed for a sports association. The application centralizes the management of members, annual subscriptions, events, and administrative documents within a modern and secure web environment.

## Main Features

The application is divided into three distinct areas:

**Public Area**
- Presentation of the association and its activities.
- Calendar of upcoming events open to visitors.
- Contact and registration forms.

**Member Area**
- User profile and personal information management.
- Online membership system with subscription tracking by season.
- Registration for events organized by the association.
- Secure access to internal documents and medical certificate downloads.

**Administration Area**
- Dashboard for tracking members and membership statistics.
- Season management (pricing, opening periods).
- Creation and moderation of events.
- Validation of payments and administrative documents provided by members.
- Invitation system for adding new users.

## Technical Stack
The project's architecture relies on cutting-edge technologies to ensure performance and maintainability:

- **Framework:** Next.js 16 (App Router, Edge Runtime)
- **Language:** TypeScript
- **Database:** PostgreSQL on Neon DB via Prisma ORM (with `@prisma/adapter-pg` connection pooling)
- **User Interface:** Tailwind CSS with the shadcn/ui component library
- **Authentication:** Custom Edge-compatible JWT authentication using `jose`
- **Email Management:** Resend for notifications and account recovery
- **Package Manager:** Bun
- **Deployment:** Vercel (Edge Functions for Middleware/Proxy)

## Installation and Setup

### Prerequisites
- Node.js (version 20 or higher) & Bun installed
- A Serverless PostgreSQL instance (like Neon Database)
- Vercel account (optional but recommended for Edge features)

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/vlore25/les-foulees.git
cd les-foulees
```

2. Install dependencies using Bun:
```bash
bun install
```

3. Environment configuration:
Create a `.env` file at the root and configure the following variables:
```env
POSTGRES_DATABASE_URL="your_pooled_neon_database_url"
JWT_SECRET="your_secret_key"
RESEND_API_KEY="your_resend_api_key"
BLOB_STORE_ID="your_vercel_blob_store_id"
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

4. Database initialization:
```bash
bunx prisma generate
bunx prisma db push
```

5. Run the application locally with Turbopack:
```bash
bun run dev
```

## Project Structure

- `/app`: Routing and page logic (organized by route groups: admin, auth, main, external).
- `/components`: Reusable UI component library.
- `/src/features`: Business logic divided by domains (accounting, authentication, events, memberships).
- `/src/lib`: Core utilities (Prisma setup, Edge-compatible Session management).
- `/prisma`: Data schemas and migrations.
- `/docs`: Detailed project documentation and test plans.
- `/public`: Static assets and PDF document templates.
- `proxy.ts`: Edge Middleware for route protection and authentication interception.

---

**Additional Information:**
This project was developed with the goal of professionalization and putting a modular software architecture into practice.

**Developer:** Victor Loré
**GitHub Link:** https://github.com/vlore25
**Personal site:** https://www.victorlore.fr/
