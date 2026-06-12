# B.Tech 2nd Semester Web Design Project Portfolio

Welcome to the comprehensive repository for the 2nd Semester Web Design coursework. This project is a curated collection of web applications demonstrating progression from fundamental UI design to full-stack development.

## Table of Contents
1. [Project 1: Bootstrap Responsive Website](#project-1-bootstrap-responsive-website)
2. [Project 2: JavaScript Interactive Features](#project-2-javascript-interactive-features)
3. [Project 3: React Application](#project-3-react-application)
4. [Project 4: Spring Boot REST API](#project-4-spring-boot-rest-api)

---

## Getting Started

To explore the projects, you can open the root `index.html` file in any modern web browser. It serves as a unified landing page that links to all the individual sub-projects.

### Screenshots
*(Placeholders for project screenshots)*
- `demo/landing-page.png`
- `demo/react-dashboard.png`
- `demo/api-tests.png`

---

## Project 1: Bootstrap Responsive Website
**Directory:** `bootstrap-website/`

A professional, corporate-style landing page built entirely with HTML5 and Bootstrap 5. 

**Key Features:**
- Fully responsive grid layout.
- Implementation of Bootstrap components (Navbar, Cards, Modals).
- Custom CSS overrides for a unique, polished aesthetic.

**How to run:**
Simply open `bootstrap-website/index.html` in your browser.

---

## Project 2: JavaScript Interactive Features
**Directory:** `javascript-projects/`

This section focuses on Vanilla JavaScript to add interactivity and handle asynchronous data.

**Key Features:**
- **To-Do List (`dom-manipulation.html`):** Demonstrates DOM manipulation, event handling, and data persistence using the browser's `localStorage`.
- **Data Fetcher (`api-fetch.html`):** Demonstrates asynchronous JavaScript (`fetch`, `async/await`) by retrieving and rendering data from a public REST API (JSONPlaceholder).

**How to run:**
Open either `dom-manipulation.html` or `api-fetch.html` in your browser.

---

## Project 3: React Application
**Directory:** `react-app/`

A Single Page Application (SPA) serving as a Student Management Dashboard frontend.

**Key Features:**
- Built using React (initialized via Vite).
- Functional components and Hooks (`useState`, `useEffect`).
- Dynamic rendering of lists and form handling.

**How to run:**
1. Navigate into the directory: `cd react-app`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

---

## Project 4: Spring Boot REST API
**Directory:** `springboot-api/`

The backend component of the architecture, providing a RESTful API for Student Management.

**Key Features:**
- Built with Java and Spring Boot.
- CRUD operations (Create, Read, Update, Delete) via `StudentController`.
- Data persistence using Spring Data JPA and an H2 in-memory database.

**How to run:**
1. Navigate to the directory: `cd springboot-api`
2. Run using Maven wrapper: `./mvnw spring-boot:run` (Mac/Linux) or `mvnw.cmd spring-boot:run` (Windows)
3. The API will be available at `http://localhost:8080/api/students`.
