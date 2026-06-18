// ============================================================
//  Weather Dashboard — Script
//  Includes: API fetching, unit conversion, recent searches,
//  geolocation, and the Interactive Live Weather Wallpaper
//  (HTML5 Canvas particle system).
// ============================================================


// ---- Global State ----
let currentUnit = 'c';       // 'c' for Celsius, 'f' for Fahrenheit
let weatherCache = null;     // Stores last fetched data for unit re-render
let currentTheme = 'clouds'; // Tracks current weather theme for the wallpaper


// ---- DOM References ----
const searchForm       = document.getElementById('searchForm');
const cityInput        = document.getElementById('cityInput');
const recentSearchesEl = document.getElementById('recentSearches');
const geoBtn           = document.getElementById('geoBtn');
const unitToggleBtns   = document.querySelectorAll('.unit-btn');

const errorMessage     = document.getElementById('errorMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const weatherContent   = document.getElementById('weatherContent');

const cityNameEl       = document.getElementById('cityName');
const weatherIconEl    = document.getElementById('weatherIcon');
const weatherDescEl    = document.getElementById('weatherDescription');
const temperatureEl    = document.getElementById('temperature');
const mainTempUnit     = document.getElementById('mainTempUnit');

const feelsLikeEl      = document.getElementById('feelsLike');
const humidityEl       = document.getElementById('humidity');
const windSpeedEl      = document.getElementById('windSpeed');

const hourlyRow        = document.getElementById('hourlyRow');
const dailyList        = document.getElementById('dailyList');


// ============================================================
//  SECTION 1: INTERACTIVE LIVE WEATHER WALLPAPER
//  Uses HTML5 Canvas to render weather-specific particle effects.
//  Each weather condition (rain, snow, clouds, clear) has its
//  own particle class with unique movement, rendering, and
//  mouse interaction behavior.
// ============================================================

const canvas = document.getElementById('weatherCanvas');
const ctx    = canvas.getContext('2d');

// Track mouse position for interactive particle effects.
// Particles respond to cursor proximity for a tactile feel.
let mouse = { x: -1000, y: -1000 };

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

document.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// Resize canvas to match viewport dimensions.
// Called once on load and on every window resize.
function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();


// ---- Gradient Backgrounds per Weather Theme ----
// These replace the old solid-color backgrounds with smooth,
// atmosphere-appropriate gradients drawn directly on canvas.
const gradients = {
    clear:        ['#fdf6e3', '#fcefc7', '#fbe4a0'],  // warm cream tones
    clouds:       ['#e8edf2', '#d5dde6', '#c2cdd9'],  // muted slate
    rain:         ['#c8d3df', '#a8b8c8', '#8a9db3'],  // cool blue-gray
    thunderstorm: ['#8a9aaa', '#6b7d8e', '#4e6070'],  // dark stormy
    snow:         ['#f0f4f8', '#e2e8f0', '#d5dde6'],  // very light gray
};


// ---- Base Particle Class ----
// All weather particle types extend this class.
// Each particle stores position, velocity, size, and opacity,
// and can optionally respond to the mouse cursor.
class Particle {
    constructor(x, y, vx, vy, size, opacity) {
        this.x       = x;
        this.y       = y;
        this.vx      = vx;
        this.vy      = vy;
        this.size    = size;
        this.opacity = opacity;
    }

    // Check if particle has left the visible canvas area
    isOffScreen() {
        return (
            this.x < -50 || this.x > canvas.width  + 50 ||
            this.y < -50 || this.y > canvas.height + 50
        );
    }
}


// ---- RAIN PARTICLE ----
// Renders as a thin diagonal streak falling downward.
// Slightly deflects *away* from the mouse cursor,
// simulating wind pressure pushing droplets aside.
class RainDrop extends Particle {
    constructor() {
        const x  = Math.random() * (canvas.width + 200) - 100;
        const y  = Math.random() * -canvas.height;
        const vx = -1.5 + Math.random() * -1;         // slight leftward drift (wind)
        const vy = 8 + Math.random() * 7;              // fast downward fall
        const size    = 1 + Math.random() * 1.5;       // streak thickness
        const opacity = 0.15 + Math.random() * 0.3;    // subtle, not harsh
        super(x, y, vx, vy, size, opacity);
        this.length = 15 + Math.random() * 20;         // streak length in px
    }

    update() {
        // Mouse repulsion: droplets push away from cursor
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            const force = (120 - dist) / 120;
            this.x += (dx / dist) * force * 3;
        }

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        // Draw a short line in the direction of motion
        ctx.lineTo(this.x + this.vx * 2, this.y + this.length);
        ctx.strokeStyle = `rgba(200, 220, 240, ${this.opacity})`;
        ctx.lineWidth   = this.size;
        ctx.lineCap     = 'round';
        ctx.stroke();
    }

    shouldReset() {
        return this.y > canvas.height + 50;
    }

    reset() {
        this.x  = Math.random() * (canvas.width + 200) - 100;
        this.y  = Math.random() * -200;
        this.vy = 8 + Math.random() * 7;
    }
}


// ---- SNOWFLAKE PARTICLE ----
// Renders as a soft white circle drifting slowly downward.
// Snowflakes gently *attract* toward the mouse cursor,
// creating a magical, playful interaction.
class Snowflake extends Particle {
    constructor() {
        const x  = Math.random() * canvas.width;
        const y  = Math.random() * -canvas.height;
        const vx = -0.5 + Math.random() * 1;           // gentle horizontal drift
        const vy = 0.5 + Math.random() * 1.5;           // slow fall
        const size    = 2 + Math.random() * 4;           // varying sizes
        const opacity = 0.4 + Math.random() * 0.4;
        super(x, y, vx, vy, size, opacity);
        // Each snowflake has a unique wobble phase for natural-looking sway
        this.wobblePhase = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.01 + Math.random() * 0.02;
    }

    update() {
        // Sinusoidal horizontal wobble for natural drift
        this.wobblePhase += this.wobbleSpeed;
        this.x += this.vx + Math.sin(this.wobblePhase) * 0.5;
        this.y += this.vy;

        // Mouse attraction: snowflakes gently drift toward cursor
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 1) {
            const force = (150 - dist) / 150 * 0.8;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }

    shouldReset() {
        return this.y > canvas.height + 20;
    }

    reset() {
        this.x  = Math.random() * canvas.width;
        this.y  = -10 - Math.random() * 50;
        this.vy = 0.5 + Math.random() * 1.5;
    }
}


// ---- CLOUD BLOB PARTICLE ----
// Renders as a large, soft, semi-transparent blob using
// a radial gradient. Drifts horizontally at varying speeds.
// Clouds push *away* from the mouse for a parallax-like effect.
class CloudBlob extends Particle {
    constructor() {
        const size = 80 + Math.random() * 160;          // large blobs
        const x  = Math.random() * (canvas.width + size) - size / 2;
        const y  = Math.random() * canvas.height * 0.7; // mostly upper area
        const vx = 0.15 + Math.random() * 0.35;         // slow rightward drift
        const vy = 0;
        const opacity = 0.06 + Math.random() * 0.1;     // very subtle
        super(x, y, vx, vy, size, opacity);
    }

    update() {
        this.x += this.vx;

        // Mouse repulsion: clouds gently drift away from cursor
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 1) {
            const force = (200 - dist) / 200 * 0.4;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force * 0.3;
        }
    }

    draw() {
        // Use a radial gradient to create a soft, blurry cloud shape
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    shouldReset() {
        return this.x > canvas.width + this.size;
    }

    reset() {
        this.x    = -this.size;
        this.y    = Math.random() * canvas.height * 0.7;
        this.vx   = 0.15 + Math.random() * 0.35;
    }
}


// ---- SUNNY DUST PARTICLE ----
// Renders as warm, glowing dust motes floating gently upward.
// Creates a serene, sun-drenched atmosphere.
class SunDust extends Particle {
    constructor() {
        const x  = Math.random() * canvas.width;
        const y  = Math.random() * canvas.height;
        const vx = -0.2 + Math.random() * 0.4;
        const vy = -0.2 - Math.random() * 0.5;          // gentle upward drift
        const size    = 1.5 + Math.random() * 3;
        const opacity = 0.15 + Math.random() * 0.3;
        super(x, y, vx, vy, size, opacity);
        this.pulsePhase = Math.random() * Math.PI * 2;   // twinkle effect
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        // Subtle twinkle: oscillate opacity for a living, breathing feel
        this.pulsePhase += 0.02;
        this.currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(this.pulsePhase));
    }

    draw() {
        // Draw a soft glow circle with a warm yellow/amber tone
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 3
        );
        gradient.addColorStop(0, `rgba(245, 200, 80, ${this.currentOpacity})`);
        gradient.addColorStop(1, `rgba(245, 200, 80, 0)`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Inner bright core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 220, 120, ${this.currentOpacity})`;
        ctx.fill();
    }

    shouldReset() {
        return this.y < -20;
    }

    reset() {
        this.x  = Math.random() * canvas.width;
        this.y  = canvas.height + 10;
        this.vy = -0.2 - Math.random() * 0.5;
    }
}


// ---- Particle System Controller ----
// Manages the lifecycle of all active particles. Handles
// spawning, transitioning between weather types, and rendering.

let particles       = [];        // Currently active particles
let targetParticles = [];        // Particles being transitioned to
let transitioning   = false;     // Is a weather transition in progress?
let transitionAlpha = 1;         // Opacity during crossfade (1 = fully visible)

// Lightning state for thunderstorms
let lightningFlash  = 0;         // Current flash brightness (0–1)
let nextLightning   = 0;         // Timestamp of next lightning flash

// Sun ray rotation angle for clear weather
let sunRayAngle     = 0;


// Spawn a full set of particles for the given weather theme.
// Returns an array of Particle instances.
function spawnParticles(theme) {
    const arr = [];

    switch (theme) {
        case 'rain':
        case 'thunderstorm':
            // 180 rain streaks for dense rainfall
            for (let i = 0; i < 180; i++) {
                const drop = new RainDrop();
                // Spread initial positions across full screen height
                drop.y = Math.random() * canvas.height;
                arr.push(drop);
            }
            if (theme === 'thunderstorm') {
                // Schedule first lightning flash 3–8 seconds from now
                nextLightning = Date.now() + 3000 + Math.random() * 5000;
            }
            break;

        case 'snow':
            // 130 snowflakes at varying altitudes
            for (let i = 0; i < 130; i++) {
                const flake = new Snowflake();
                flake.y = Math.random() * canvas.height;
                arr.push(flake);
            }
            break;

        case 'clouds':
            // 18 soft cloud blobs across the viewport
            for (let i = 0; i < 18; i++) {
                arr.push(new CloudBlob());
            }
            break;

        case 'clear':
        default:
            // 35 warm dust motes for sunny days
            for (let i = 0; i < 35; i++) {
                const dust = new SunDust();
                dust.y = Math.random() * canvas.height;
                arr.push(dust);
            }
            break;
    }

    return arr;
}


// Transition to a new weather theme with a smooth crossfade.
// Old particles fade out while new ones fade in over ~1.5 seconds.
function setWeatherTheme(theme) {
    if (theme === currentTheme && particles.length > 0) return;

    currentTheme    = theme;
    targetParticles = spawnParticles(theme);
    transitioning   = true;
    transitionAlpha = 0; // new particles start invisible, then fade in
}


// Draw the background gradient for the current weather theme.
// This replaces the old solid-color CSS background.
function drawBackground() {
    const colors = gradients[currentTheme] || gradients.clouds;
    const grad   = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.5, colors[1]);
    grad.addColorStop(1, colors[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


// Draw subtle sun rays from the top-right corner (clear weather only).
// Uses rotating translucent triangles for a gentle glow effect.
function drawSunRays() {
    if (currentTheme !== 'clear') return;

    sunRayAngle += 0.002; // very slow rotation
    const cx = canvas.width - 80;
    const cy = 80;
    const rayCount = 12;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(sunRayAngle);

    for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const len = 250 + Math.sin(sunRayAngle * 3 + i) * 50;
        ctx.lineTo(
            Math.cos(angle) * len,
            Math.sin(angle) * len
        );
        ctx.lineTo(
            Math.cos(angle + 0.15) * len,
            Math.sin(angle + 0.15) * len
        );
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 230, 140, 0.04)`;
        ctx.fill();
    }

    ctx.restore();
}


// Handle thunderstorm lightning flashes.
// Periodically overlays a bright white flash on the canvas,
// then schedules the next one randomly between 5–10 seconds.
function handleLightning() {
    if (currentTheme !== 'thunderstorm') {
        lightningFlash = 0;
        return;
    }

    const now = Date.now();
    if (now > nextLightning) {
        lightningFlash = 0.7 + Math.random() * 0.3;    // bright flash
        nextLightning  = now + 5000 + Math.random() * 5000;
    }

    if (lightningFlash > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${lightningFlash})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        lightningFlash *= 0.85; // quick exponential decay
        if (lightningFlash < 0.01) lightningFlash = 0;
    }
}


// ---- Main Animation Loop ----
// Runs at ~60fps using requestAnimationFrame.
// Draws background, updates and renders all particles,
// handles transitions, lightning, and sun rays.

let animationId  = null;
let isTabVisible = true;

function animate() {
    animationId = requestAnimationFrame(animate);

    // Don't burn CPU when the tab isn't visible
    if (!isTabVisible) return;

    // 1. Draw the gradient background (clears previous frame)
    drawBackground();

    // 2. Draw sun rays for clear weather
    drawSunRays();

    // 3. Handle smooth transition between weather themes
    if (transitioning) {
        transitionAlpha += 0.02; // fade in over ~50 frames (~0.8s)
        if (transitionAlpha >= 1) {
            transitionAlpha = 1;
            transitioning   = false;
            particles       = targetParticles;
            targetParticles = [];
        }
    }

    // 4. Draw old particles fading out during transition
    if (transitioning && particles.length > 0) {
        ctx.globalAlpha = 1 - transitionAlpha;
        for (const p of particles) {
            p.update();
            p.draw();
        }
    }

    // 5. Draw current/new particles
    ctx.globalAlpha = transitioning ? transitionAlpha : 1;
    const active = transitioning ? targetParticles : particles;
    for (const p of active) {
        p.update();
        p.draw();
        // Reset particles that go off-screen
        if (p.shouldReset()) {
            p.reset();
        }
    }

    ctx.globalAlpha = 1;

    // 6. Lightning overlay for thunderstorms
    handleLightning();
}


// Pause animation when tab is hidden to save resources.
// Resume when the user returns to the tab.
document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
});


// Initialize the wallpaper on page load with the default theme
particles = spawnParticles(currentTheme);
animate();



// ============================================================
//  SECTION 2: WEATHER APP LOGIC
//  API fetching, search, geolocation, unit toggle, rendering.
// ============================================================


// ---- App Initialization ----
document.addEventListener('DOMContentLoaded', () => {
    loadRecentSearches();
});


// ---- Unit Toggle (Celsius / Fahrenheit) ----
unitToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const selected = e.target.getAttribute('data-unit');
        if (selected === currentUnit) return;
        
        currentUnit = selected;
        unitToggleBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Re-render with converted temps (no new API call needed)
        if (weatherCache) {
            renderWeather(weatherCache.city, weatherCache.country, weatherCache.current, weatherCache.hourly, weatherCache.daily);
        }
    });
});

function convertTemp(celsius) {
    if (currentUnit === 'f') {
        return Math.round((celsius * 9/5) + 32);
    }
    return Math.round(celsius);
}

function getUnitLabel() {
    return currentUnit === 'c' ? '°C' : '°F';
}


// ---- Recent Searches (localStorage) ----
function loadRecentSearches() {
    const searches = JSON.parse(localStorage.getItem('weatherRecent')) || [];
    renderRecentList(searches);
}

function saveSearch(city) {
    let searches = JSON.parse(localStorage.getItem('weatherRecent')) || [];
    searches = searches.filter(s => s.toLowerCase() !== city.toLowerCase());
    searches.unshift(city);
    if (searches.length > 5) searches.pop();
    localStorage.setItem('weatherRecent', JSON.stringify(searches));
    renderRecentList(searches);
}

function renderRecentList(searches) {
    recentSearchesEl.innerHTML = '';
    if (searches.length === 0) {
        recentSearchesEl.classList.add('hidden');
        return;
    }

    searches.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('mousedown', () => {
            cityInput.value = city;
            recentSearchesEl.classList.add('hidden');
            handleSearch(city);
        });
        recentSearchesEl.appendChild(li);
    });
}

cityInput.addEventListener('focus', () => {
    if (recentSearchesEl.children.length > 0) {
        recentSearchesEl.classList.remove('hidden');
    }
});

cityInput.addEventListener('blur', () => {
    setTimeout(() => recentSearchesEl.classList.add('hidden'), 200);
});


// ---- Form Submission & Search ----
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        recentSearchesEl.classList.add('hidden');
        handleSearch(city);
    }
});

async function handleSearch(city) {
    setLoading(true);
    
    try {
        // Step 1: Convert city name to lat/lon using Open-Meteo's geocoding API
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name, country_code } = geoData.results[0];
        saveSearch(name);
        await fetchWeather(latitude, longitude, name, country_code);
    } catch (error) {
        showError("City not found. Check spelling.");
    }
}


// ---- Geolocation (My Location button) ----
geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            // Reverse geocode coordinates to city name
            const revUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
            const revRes = await fetch(revUrl);
            const revData = await revRes.json();
            
            const city = revData.city || revData.locality || "Unknown";
            cityInput.value = city;
            
            await fetchWeather(latitude, longitude, city, revData.countryCode);
        } catch (error) {
            showError("Unable to fetch location details.");
        }
    }, () => {
        showError("Location permission denied.");
    });
});


// ---- Fetch Weather Data ----
async function fetchWeather(lat, lon, city, country) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    
    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();
        
        // Cache raw data so we can re-render on unit toggle
        weatherCache = {
            city,
            country,
            current: data.current,
            hourly: data.hourly,
            daily: data.daily
        };

        renderWeather(city, country, data.current, data.hourly, data.daily);
    } catch (error) {
        showError("Failed to fetch weather data. Check network connection.");
    }
}


// ---- Render Weather UI ----
function renderWeather(city, country, current, hourly, daily) {
    setLoading(false);
    weatherContent.classList.remove('hidden');

    const unitLabel = getUnitLabel();
    mainTempUnit.textContent = unitLabel;

    // Left Column: City, temperature, condition
    cityNameEl.textContent = `${city}, ${country || ''}`.replace(/, $/, '');
    temperatureEl.textContent = convertTemp(current.temperature_2m);
    
    const condition = mapWeather(current.weather_code, current.is_day);
    weatherDescEl.textContent = condition.text;
    weatherIconEl.className = `fas ${condition.icon} condition-icon`;
    
    // Apply CSS theme class (fallback background)
    document.body.className = `theme-${condition.theme}`;

    // === UPDATE THE LIVE WALLPAPER ===
    // This is the bridge between weather data and the canvas.
    // When the API returns a new condition, we transition the
    // particle system to match.
    setWeatherTheme(condition.theme);

    // Left Column: Metrics
    feelsLikeEl.textContent = `${convertTemp(current.apparent_temperature)}${unitLabel}`;
    humidityEl.textContent = `${current.relative_humidity_2m}%`;
    windSpeedEl.textContent = `${current.wind_speed_10m} km/h`;

    // Right Column: Hourly Forecast (next 6 hours)
    hourlyRow.innerHTML = '';
    const now = new Date();
    const currentTimeIndex = hourly.time.findIndex(t => new Date(t) > now) || 0;
    
    for (let i = currentTimeIndex; i < currentTimeIndex + 6; i++) {
        if (!hourly.time[i]) break;
        const time = new Date(hourly.time[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = convertTemp(hourly.temperature_2m[i]);
        const cond = mapWeather(hourly.weather_code[i], 1);
        
        const div = document.createElement('div');
        div.className = 'hourly-item';
        div.innerHTML = `
            <span class="hourly-time">${time}</span>
            <i class="fas ${cond.icon} hourly-icon"></i>
            <span class="hourly-temp">${temp}°</span>
        `;
        hourlyRow.appendChild(div);
    }

    // Right Column: 5-Day Forecast (skip today)
    dailyList.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (!daily.time[i]) break;
        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const high = convertTemp(daily.temperature_2m_max[i]);
        const low = convertTemp(daily.temperature_2m_min[i]);
        const cond = mapWeather(daily.weather_code[i], 1);

        const div = document.createElement('div');
        div.className = 'daily-item';
        div.innerHTML = `
            <span class="daily-day">${dayName}</span>
            <i class="fas ${cond.icon} daily-icon"></i>
            <div class="daily-temps">
                <span class="temp-high">${high}°</span>
                <span class="temp-low">${low}°</span>
            </div>
        `;
        dailyList.appendChild(div);
    }
}


// ---- UI Helpers ----
function setLoading(isLoading) {
    errorMessage.classList.add('hidden');
    if (isLoading) {
        loadingIndicator.classList.remove('hidden');
        weatherContent.classList.add('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}

function showError(msg) {
    loadingIndicator.classList.add('hidden');
    weatherContent.classList.add('hidden');
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
}


// ---- WMO Weather Code Mapping ----
// Maps Open-Meteo's WMO weather codes to human-readable
// descriptions, FontAwesome icons, and wallpaper themes.
function mapWeather(code, isDay) {
    let text  = "Clear";
    let icon  = isDay ? "fa-sun" : "fa-moon";
    let theme = "clear";

    if (code === 0) {
        text  = "Clear sky";
        theme = "clear";
    } else if (code >= 1 && code <= 3) {
        text = code === 3 ? "Overcast" : "Partly cloudy";
        icon = isDay ? "fa-cloud-sun" : "fa-cloud-moon";
        if (code === 3) icon = "fa-cloud";
        theme = "clouds";
    } else if (code === 45 || code === 48) {
        text  = "Fog";
        icon  = "fa-smog";
        theme = "clouds";
    } else if (code >= 51 && code <= 67) {
        text  = "Rain";
        icon  = "fa-cloud-rain";
        theme = "rain";
    } else if (code >= 71 && code <= 77) {
        text  = "Snow";
        icon  = "fa-snowflake";
        theme = "snow";
    } else if (code >= 80 && code <= 82) {
        text  = "Showers";
        icon  = "fa-cloud-showers-heavy";
        theme = "rain";
    } else if (code >= 95 && code <= 99) {
        text  = "Thunderstorm";
        icon  = "fa-bolt";
        theme = "thunderstorm";
    }

    return { text, icon, theme };
}
