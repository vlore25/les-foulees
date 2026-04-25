## Les Foulées Avrillaises

Les Foulées is a comprehensive management platform designed for a sports association. The application centralizes the management of members, annual subscriptions, events, and administrative documents within a modern and secure web environment.

## Main Features

The application is divided into three distinct areas:

Public Area

-- Presentation of the association and its activities.

-- Calendar of upcoming events open to visitors.

-- Contact and registration forms.

Member Area

-- User profile and personal information management.

-- Online membership system with subscription tracking by season.

-- Registration for events organized by the association.

-- Secure access to internal documents and medical certificate downloads.

Administration Area

-- Dashboard for tracking members and membership statistics.

-- Season management (pricing, opening periods).

-- Creation and moderation of events.

-- Validation of payments and administrative documents provided by members.

-- Invitation system for adding new users.


## Technical Stack
The project's architecture relies on cutting-edge technologies to ensure performance and maintainability:

-- Framework: Next.js (App Router)

-- Language: TypeScript

-- Database: PostgreSQL via Prisma ORM

-- User Interface: Tailwind CSS with the shadcn/ui component library

-- Email Management: Resend for notifications and account recovery

-- Containerization: Docker and Docker Compose for development and deployment environments

## Installation and Setup

Prerequisites
-- Node.js (version 18 or higher)

-- Docker

-- A PostgreSQL instance (or via Docker)

## Installation Steps

1. Clone the repository:

``git clone https://github.com/vlore25/les-foulees.git
cd les-foulees``

2. Install dependencies:

``npm install``

3. Environment configuration:
   
Create a .env file at the root and configure the following variables:

``DATABASE_URL="your_database_url"
RESEND_API_KEY="your_resend_api_key"``

4. Database initialization:

``npx prisma generate
npx prisma db push``

5. Run the application:

``npm run dev``

## Project Structure

/app: Routing and page logic (organized by route groups: admin, auth, main, external).

/components: Reusable UI component library.

/src/features: Business logic divided by domains (accounting, authentication, events, memberships).

/prisma: Data schemas and migrations.

/public: Static assets and PDF document templates.



Additional Information:
This project was developed with the goal of professionalization and putting a modular software architecture into practice.

Developer: Victor Loré

GitHub Link: https://github.com/vlore25
Personal site: https://www.victorlore.fr/
