# Development Tasks for [App Name] Product Demonstration

This document details the individual tasks required to develop a functional demonstration of the [App Name] web application. The focus is on implementing the core features and foundational components necessary to showcase the product proposal effectively, adhering to the specified technical stack and design guidelines. Whenever a task is complete, please mark it with a checkmark in this file. 

## 1. Project Setup & Core Infrastructure

* **Task 1.1: Initialize Next.js Project** ✅
    * Create a new Next.js project.
    * Configure Tailwind CSS.
    * Integrate `shadcn/ui` (initialize with desired theme/colors as per `requirements.md`).
    * Set up ESLint and Prettier for consistent code quality.
* **Task 1.2: Initialize FastAPI Backend** ✅
    * Create a new FastAPI project.
    * Set up project structure (e.g., `app/`, `routers/`).
    * Configure Poetry for dependency management.
    * Set up Black and Flake8 for consistent code quality.

## 2. Global UI Components & Navigation

* **Task 2.1: Navigation Bar (Top)**
    * Implement a persistent top navigation bar (using `shadcn/ui` components).
    * Include App Logo/Name (`Your Cycle Journey` / `Nourish & Thrive` / `Your Self-Love Space` - dynamic based on page or generic app name).
    * Navigation links for "Today", "Trends" (or "Progress"), "Learn", and "Profile".
    * Ensure responsiveness and clean aesthetic.
* **Task 2.2: Basic Page Layout & Container** ✅
    * Create a consistent `Layout` component that wraps all page content.
    * Include `shadcn/ui` Card component as the base for content sections.
    * Implement primary background color and consistent padding/margins.
* **Task 2.3: Placeholder Login/Registration Screens**
    * Create basic placeholder Login and Registration pages (using `shadcn/ui` Input, Button, Card components).
    * For the demo, these can be simple, non-functional forms that navigate to the main app dashboard directly on "submit" for demonstration purposes without actual authentication.

## 3. Smart BBT Temperature Tracker Page

* **Task 3.1: BBT Logging Input**
    * Create a card for "Log Today's BBT" (using `shadcn/ui` Card).
    * Implement an input field for temperature (using `shadcn/ui` Input).
    * Add a "Confirm Entry" button (using `shadcn/ui` Button).
    * *(For demo: Connect to a simple frontend state to update the graph without a backend save for now.)*
    * Display a confirmation message or a subtle toast notification.
* **Task 3.2: BBT Trends Graph**
    * Create a card for "BBT Trends" (using `shadcn/ui` Card).
    * Integrate Nivo to display a line graph of BBT data.
    * Populate graph with frontend dummy data or data managed in local state.
    * Implement color-coded zones for "Fertile Window" (green) and "Ovulation Confirmed!" (peach/orange) based on basic rules or dummy indicators.
    * Ensure interactive tooltips are functional.
* **Task 3.3: Progress & Insight Cards**
    * Create a "Your Progress" card to display placeholder metrics (e.g., "Avg. Cycle Length: -- Days", "Longest Luteal Phase: 10 Days").
    * Create a "Daily Insight" card with a placeholder encouraging message.
    * Use `shadcn/ui` Card for these elements.

## 4. Gentle Calorie Tracking Page

* **Task 4.1: Fuel Meter (Progress Bar)**
    * Implement the horizontal "Fuel Meter" progress bar (using `shadcn/ui` Progress).
    * Connect its value to a simple mock or manually updated "energy level" in the frontend for demo purposes.
    * Display text status ("Optimal", "Moderate", "Needs More Fuel") dynamically based on the progress bar value.
    * Include the encouraging tagline.
* **Task 4.2: Log Meals Input**
    * Implement the "Log Today's Meals +" button.
    * On click, open a simple modal/form (using `shadcn/ui` Dialog/Form) to input meal details (e.g., "Breakfast", "Lunch", "Dinner", simple text description).
    * *(For demo: Save logged meals to frontend state only for display.)*
* **Task 4.3: Today's Meals Display**
    * Display logged meals as cards (using `shadcn/ui` Card) with placeholder images or small text summaries.
    * Include positive indicators (e.g., "✅ Balanced Plate").
* **Task 4.4: AI Meal Inspiration**
    * Create the "AI Meal Inspiration" card (using `shadcn/ui` Card).
    * Implement the proactive and encouraging AI message.
    * Implement the "GET ME THIS RECIPE" button (using `shadcn/ui` Button).
    * On click, display a mock recipe or a placeholder text with recipe details.
    * *(Backend MVP for AI: A simple API endpoint that returns a hardcoded "recovery-friendly" meal suggestion for the demo.)*

## 5. Mirror / Corkboard for Self-Love Page

* **Task 5.1: Corkboard Canvas & Silhouette**
    * Implement the corkboard background.
    * Display a central user silhouette.
* **Task 5.2: Interactive Sticky Notes**
    * Implement initial static sticky notes with pre-filled affirmations (using `shadcn/ui` Card or custom div for notes).
    * Enable basic drag-and-drop functionality for these notes (frontend-only for demo).
    * Implement "Add New Affirmation +" button to create a new, editable sticky note (using `shadcn/ui` Input/Textarea).
* **Task 5.3: Daily Affirmation Card**
    * Create the "Daily Affirmation" card (using `shadcn/ui` Card).
    * Display a placeholder AI-generated affirmation.
    * Implement the "Make this my wallpaper" button (using `shadcn/ui` Button) (functionality can be a simple prompt or image save for demo).

## 6. Backend API Development (Minimal for Demo)

* **Task 6.1: Dummy API Endpoint for BBT (GET)** ✅
    * Create a FastAPI endpoint `/api/bbt` that returns a hardcoded array of BBT data for a demo user over the last 30 days.
* **Task 6.2: Dummy API Endpoint for Meals (GET)** ✅
    * Create a FastAPI endpoint `/api/meals` that returns a hardcoded array of example logged meals.
* **Task 6.3: Dummy API Endpoint for AI Meal Suggestion (GET)** ✅
    * Create a FastAPI endpoint `/api/ai/meal-suggestion` that returns a hardcoded "recovery-friendly" meal suggestion text.

## 7. Quality Assurance & Polish

* **Task 7.1: Cross-Browser Compatibility:** Test functionality and appearance on major browsers (Chrome, Firefox).
* **Task 7.2: Basic Responsiveness:** Ensure pages are usable on tablet screen sizes.
* **Task 7.3: Data Seeding (Frontend Mock):** Prepare a small set of mock data in the frontend for demonstration purposes (e.g., historical BBT, logged meals) to simulate interaction.
* **Task 7.4: Demo Flow:** Ensure smooth navigation between pages and logical flow for a product demonstration.
