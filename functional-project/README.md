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

## Key Features

### Interactive Live Weather Wallpaper
The most visually distinctive feature of this dashboard is the **full-viewport, interactive weather wallpaper** powered by HTML5 Canvas. Instead of a flat, static background, the app renders real-time particle effects that match the current weather condition:

- **Rain / Thunderstorm:** 180 diagonal blue-white streaks fall across the screen, with slight wind drift. During thunderstorms, random bright lightning flashes illuminate the canvas every 5–10 seconds.
- **Snow:** 130 soft white snowflakes drift downward with sinusoidal horizontal wobble, creating a natural, gentle snowfall effect.
- **Clouds / Fog:** 18 large, semi-transparent cloud blobs drift horizontally across the viewport using radial gradients for soft, atmospheric shapes.
- **Clear / Sunny:** 35 warm, glowing amber dust particles float upward with a twinkling pulse effect, accompanied by subtle rotating sun rays from the top-right corner.

**Mouse interactivity** adds a tactile, hand-crafted feel:
- Rain drops deflect *away* from the cursor (wind pressure).
- Snowflakes gently *attract* toward the cursor (magnetic pull).
- Cloud blobs drift *away* from the cursor (parallax push).

**Performance optimizations:**
- Uses `requestAnimationFrame` for smooth 60fps rendering.
- Pauses animation when the tab is hidden (`visibilitychange` API).
- Particle counts are capped to remain performant on low-end devices.
- Smooth crossfade transitions when switching between weather conditions.

### Glass-Morphism UI
All UI cards use CSS `backdrop-filter: blur()` with semi-transparent white backgrounds, allowing the live wallpaper to remain visible while keeping text fully readable.

### Other Features
- **Asymmetrical 2-Column Layout:** A minimalist design focusing on typography and clear borders, avoiding symmetric card layouts.
- **Dynamic Theming:** Canvas gradient backgrounds that shift based on live weather data, with CSS solid-color fallbacks for unsupported browsers.
- **Geolocation (`My Location`):** Uses the native `navigator.geolocation` API to auto-detect and fetch the local weather.
- **Hourly & 5-Day Forecasts:** Integrates detailed forecast data from Open-Meteo, featuring a horizontally scrolling 6-hour forecast and a comprehensive 5-day outlook with high/low temperatures.
- **Unit Toggle:** Native front-end segmented control to mathematically switch between Celsius (°C) and Fahrenheit (°F) instantly.
- **Recent Searches History:** Automatically saves up to 5 recently searched locations to `localStorage` and displays them in an integrated dropdown.
