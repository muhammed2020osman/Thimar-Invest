# Coding Guidelines

This document outlines the coding standards and best practices to be followed when developing this application. Adhering to these guidelines ensures code consistency, readability, and maintainability.

## 1. General Principles

- **Clarity and Readability:** Write code that is easy for other developers to understand. Use meaningful variable and function names.
- **Component-Based Architecture:** Break down the UI into small, reusable components.
- **Single Responsibility:** Each component or function should have a single, well-defined purpose.
- **No Comments in Code:** Code should be self-documenting. Avoid adding comments unless the logic is unusually complex.

## 2. Next.js & React

- **App Router:** Use the Next.js App Router for routing and layouts.
- **Server Components by Default:** Prefer Server Components to reduce the amount of JavaScript sent to the client, improving performance.
- **Client Components:** Use the `'use client';` directive only when necessary (e.g., for components with hooks like `useState`, `useEffect`, or event listeners).
- **Hooks:** Use React hooks (`useState`, `useEffect`, etc.) for state management and side effects in client components.
- **Hydration Errors:** To avoid hydration mismatches, any code that depends on browser-specific APIs (`window`, `localStorage`) or produces random values (`Math.random()`, `new Date()`) must be placed inside a `useEffect` hook.
- **Data Fetching:** Use Server Actions for data mutations (e.g., form submissions) and standard `async/await` in Server Components for data fetching.

## 3. TypeScript

- **Strong Typing:** Use TypeScript to ensure type safety. Avoid using `any` whenever possible.
- **Type Imports:** Use `import type` for importing TypeScript types to improve build performance.
  ```typescript
  import type { MyType } from './types';
  ```

## 4. Styling (Tailwind CSS & ShadCN)

- **Utility-First:** Use Tailwind CSS for all styling.
- **Theme Variables:** Use the CSS variables defined in `src/app/globals.css` for colors (e.g., `bg-primary`, `text-foreground`). Do not use hardcoded color values.
- **ShadCN UI:** Prefer using components from the ShadCN UI library (`/components/ui`) whenever possible to maintain a consistent look and feel.
- **Icons:** Use the `lucide-react` library for icons. Ensure the icon you want to use exists in the library.

## 5. File Structure

- **Components:** Reusable components go in `src/components/`. UI-specific, low-level components are in `src/components/ui`.
- **Pages/Routes:** Each route corresponds to a `page.tsx` file within the `src/app/` directory.
- **Static Data:** Static data used across the app (like product lists for demos) should be in `src/lib/data.ts`.
- **AI Flows:** Genkit flows and AI-related logic should be placed in `src/ai/flows/`.

By following these guidelines, we can build a robust and scalable application.
