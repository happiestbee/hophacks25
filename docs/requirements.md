# Requirements for [App Name] Web Application

This document outlines the core requirements for the development of the [App Name] web application, focusing on Functional Hypothalamic Amenorrhea (FHA) recovery. It details the technical stack, design principles, and feature-specific requirements to ensure a consistent, high-quality, and maintainable product.

## 1. Project Goal & Philosophy

The primary goal of this application is to support individuals in their recovery from Functional Hypothalamic Amenorrhea (FHA) by providing intelligent tracking, proactive guidance, and an empowering self-love environment. The app prioritizes a **gentle, encouraging, and non-triggering approach** to health data.

**Key Principles:**
* User-Centric & Empathetic: Design and features must be sensitive to the unique challenges of FHA.
* Data-Driven Intelligence: Leverage ML/AI for personalized insights and predictions.
* Minimalist & Clean Aesthetic: A calming, fresh, and uncluttered user experience.
* Positive Reinforcement: Language and interactions should always be encouraging.
* Privacy & Security: Handling sensitive health data with the highest standards.

## 2. Technical Stack (Strict Adherence Required)

To ensure consistency, performance, and scalability, the following tech stack must be strictly adhered to.

### 2.1. Frontend

* **Framework:** **Next.js** (React)
    * **Reason:** SSR, SSG, API routes, and excellent developer experience for performant web applications.
* **UI Library / Component System:**
    * **React:** Underlying UI library.
    * **shadcn/ui:** **Primary UI Component Library.** (Selected components like Button, Card, Input, Graph containers will be copied directly into the codebase and customized.)
        * **Reason:** Provides beautifully designed, accessible, and headless components that are highly customizable via Tailwind CSS. This allows for deep control over the "fresh and clean" aesthetic.
    * **Radix UI (Underlying Primitives for shadcn/ui):** `shadcn/ui` builds on Radix UI primitives for accessibility and unstyled functionality.
* **Styling:**
    * **Tailwind CSS:** **Primary styling framework.** Utility-first approach for rapid, consistent, and maintainable styling. Crucial for customizing `shadcn/ui` components.
    * **PostCSS:** Used under the hood by Tailwind.
* **State Management:**
    * **React Query (TanStack Query):** For all server-side data fetching, caching, and synchronization. Crucial for data-heavy features.
    * **Zustand:** For lightweight, global client-side UI state.
* **Form Management:** **React Hook Form**
    * **Reason:** Performant, flexible, and easy to integrate with validation. `shadcn/ui` provides excellent form components.
* **Data Visualization:** **Nivo**
    * **Reason:** Nivo offers a wide range of charts, consistent APIs, and good SSR support for Next.js.
* **Date & Time Utilities:** **date-fns**
    * **Reason:** Lightweight, immutable, and tree-shakable.
* **Linting & Formatting:**
    * **ESLint:** With a well-defined configuration.
    * **Prettier:** For consistent code formatting.

### 2.2. Backend

* **Web Framework (API):** **FastAPI**
    * **Reason:** Modern, fast, asynchronous, Pydantic-based for data validation, and automatic API documentation.
* **Machine Learning / Data Science Libraries (Essential for MVP):**
    * **scikit-learn:** For basic ML models (e.g., simple risk scoring logic, initial anomaly detection rules).
    * **pandas / NumPy:** For data manipulation and numerical operations.
* **Database:** **PostgreSQL**
    * **Reason:** Robust, scalable relational database.
* **ORM:** **SQLAlchemy**
    * **Reason:** Powerful and flexible ORM for Python.
* **Database Migrations:** **Alembic**
* **Caching:** **Redis** (for general caching)
* **Environment Management:** **Poetry**
    * **Reason:** Modern dependency management and virtual environment creation.
* **Linting & Formatting:**
    * **Black:** Opinionated code formatter.
    * **Flake8:** For linting Python code.

### 2.3. Infrastructure & Deployment

* **Frontend Deployment:** **Vercel** (preferred)
* **Backend Deployment:** AWS (EC2/Fargate, RDS for PostgreSQL, ElastiCache for Redis).
* **Containerization:** **Docker** (for backend services).

## 3. Appearance & Styling Guidelines

The application must maintain a **fresh, clean, and minimalist aesthetic** across all pages, drawing inspiration from the first wireframe's visual style. The goal is to create a calming and supportive environment.

### 3.1. Color Palette

* **Primary Background:** Soft, off-white (`#F7F7F7` or similar light neutral).
* **Accent Colors:** Muted, natural tones.
    * **Primary Accent:** Soft Teal/Mint Green (e.g., `#87C4BB`) - for active states, positive feedback, or key highlights.
    * **Secondary Accent:** Warm Peach/Coral (e.g., `#FFB4A2`) - for encouragement, ovulation indicators, or attention.
    * **Tertiary Accent:** Muted Lavender/Berry (e.g., `#C1A7E1`) - for diversity in visualization.
    * **Neutral Text:** Dark grey (`#333333`) for primary text, lighter grey (`#666666`) for secondary text/labels.
    * **Error/Warning:** Soft Red (e.g., `#E87C7C`) - used sparingly and gently.
* **Use of Color:** Strategic and meaningful. Avoid overwhelming the user with bright or conflicting colors.

### 3.2. Typography

* **Font Family:** A clean, legible sans-serif font.
    * **Primary:** (e.g., `Inter`, `Roboto`, or `Lato`) for all body text, labels, and numbers.
    * **Headings/Titles:** Can use the same font but with bolder weights or slightly