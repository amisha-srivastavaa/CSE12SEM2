# Weather Dashboard

A minimal, utilitarian weather application built with vanilla web technologies (HTML, CSS, JavaScript). Designed with a focus on usability, clean typography, and robust functionality without unnecessary visual clutter.

## Overview
This tool allows users to search for any city worldwide and instantly retrieve current weather conditions. It leverages asynchronous JavaScript (`async/await`, `fetch`) to chain two endpoints from the Open-Meteo API, handling data parsing and error states gracefully.

## Design Philosophy
- **Utilitarian Interface:** A stark, neutral color palette (slate gray, off-white) paired with native system fonts.
- **Performance First:** No heavy frameworks, no bloated background images, and no unnecessary animations.
- **Robust Error Handling:** Provides clear, technical feedback if a city is not found or a network error occurs.

## Technical Details
- **APIs Used:** 
  - `geocoding-api.open-meteo.com` (City Name to Coordinates)
  - `api.open-meteo.com` (Weather Forecast Data)
- **Styling:** Vanilla CSS utilizing CSS Grid, Flexbox, and CSS Variables for consistent spacing and typography.
- **Icons:** Standard FontAwesome icons for clear data labeling.

## How to Run
1. Open this folder in your file explorer.
2. Open `index.html` in your preferred web browser.
3. No build tools or local servers are required.
