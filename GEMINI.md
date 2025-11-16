# Project: Consultant Assignment Scraper

## Project Overview

This is a Next.js web application built with TypeScript that scrapes consultant assignment portals. The primary goal is to aggregate job listings from various sources into a single, filterable view.

The backend logic uses **Playwright** to perform the scraping. Each target website has its own scraper function located in `src/lib/scrapers`. These scrapers are executed in parallel for efficiency. The collected data is then stored in a local JSON file (`src/context/assignments.json`) using **lowdb**.

The frontend is built with **React Server Components (RSC)**. The main page (`src/app/page.tsx`) fetches the scraped data on the server during the rendering process and passes it to client components for display.

## Building and Running

The project uses `pnpm` as the package manager.

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

2.  **Install Playwright Browsers:**
    This is a one-time setup to download the necessary browser binaries for Playwright.
    ```bash
    pnpm exec playwright install chromium
    ```

3.  **Run the Development Server:**
    ```bash
    pnpm dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

4.  **Run Linter:**
    ```bash
    pnpm lint
    ```

5.  **Build for Production:**
    ```bash
    pnpm build
    ```

6.  **Start Production Server:**
    ```bash
    pnpm start
    ```

## Development Conventions

*   **Project Structure:** All source code resides within the `src` directory, organized by feature type (e.g., `app`, `components`, `lib`).
*   **Scraping Logic:** The core orchestration of the scraping process is in `src/lib/scrape-assignments.ts`. It launches a single browser instance and runs all individual scrapers in parallel using `Promise.allSettled` for robustness.
*   **Individual Scrapers:** Each scraper is a standalone module in `src/lib/scrapers/`. It receives a Playwright `page` object and is responsible for navigating to a specific site and extracting the assignment data.
*   **Data Flow:** The root page (`src/app/page.tsx`) is a Server Component that directly calls the `scrapeAssignments` function. The resulting data is passed as props to the `<AssignmentScraper>` client component, which handles the presentation and filtering.
*   **Styling:** The project is configured with Tailwind CSS for styling.
*   **Linting:** ESLint is configured with a comprehensive set of rules for TypeScript, React, and Playwright to ensure code quality and consistency.
