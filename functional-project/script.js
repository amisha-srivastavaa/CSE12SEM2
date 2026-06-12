// Global State
let currentUnit = 'c'; // 'c' or 'f'
let currentWeatherData = null; // Store to allow recalculation

// Elements Selection
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const geoBtn = document.getElementById('geoBtn');
const recentSearchesEl = document.getElementById('recentSearches');
const unitToggle = document.getElementById('unitToggle');
const bgTint = document.getElementById('bgTint');

const statusMessage = document.getElementById('statusMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');

const primaryWeather = document.getElementById('primaryWeather');
const secondaryWeather = document.getElementById('secondaryWeather');

// Data Nodes
const cityNameEl = document.getElementById('cityName');
const weatherDescEl = document.getElementById('weatherDescription');
const temperatureEl = document.getElementById('temperature');
const mainTempUnit = document.getElementById('mainTempUnit');
const weatherIconEl = document.getElementById('weatherIcon');

const feelsLikeEl = document.getElementById('feelsLike');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');
const forecastRow = document.getElementById('forecastRow');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadRecentSearches();
});

// --- Feature: Unit Toggle ---
unitToggle.addEventListener('click', (e) => {
    if (e.target.classList.contains('unit-btn')) {
        const selectedUnit = e.target.getAttribute('data-unit');
        if (selectedUnit === currentUnit) return;
        
        currentUnit = selectedUnit;
        
        // Update toggle UI
        document.querySelectorAll('.unit-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Re-render data if available
        if (currentWeatherData) {
            renderData(currentWeatherData.city, currentWeatherData.countryCode, currentWeatherData.data, currentWeatherData.daily);
        }
    }
});

// Utility to convert C to F
function convertTemp(celsiusValue) {
    if (currentUnit === 'f') {
        return Math.round((celsiusValue * 9/5) + 32);
    }
    return Math.round(celsiusValue);
}

// --- Feature: Recent Searches ---
function loadRecentSearches() {
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    renderRecentSearches(searches);
}

function saveSearch(city) {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    // Remove if exists
    searches = searches.filter(s => s.toLowerCase() !== city.toLowerCase());
    // Add to top
    searches.unshift(city);
    // Keep max 5
    if (searches.length > 5) searches.pop();
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    renderRecentSearches(searches);
}

function renderRecentSearches(searches) {
    recentSearchesEl.innerHTML = '';
    if (searches.length === 0) {
        recentSearchesEl.classList.add('hidden');
        return;
    }

    searches.forEach(city => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${city}</span> <i class="fas fa-history history-icon"></i>`;
        li.addEventListener('mousedown', () => {
            cityInput.value = city;
            recentSearchesEl.classList.add('hidden');
            handleSearch(city);
        });
        recentSearchesEl.appendChild(li);
    });
}

// Show/Hide dropdown
cityInput.addEventListener('focus', () => {
    if (recentSearchesEl.children.length > 0) {
        recentSearchesEl.classList.remove('hidden');
    }
});
cityInput.addEventListener('blur', () => {
    // Timeout allows click event on list items to register first
    setTimeout(() => recentSearchesEl.classList.add('hidden'), 200);
});

// --- Feature: Geolocation ---
geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    resetUI();
    loadingIndicator.textContent = "Locating...";
    loadingIndicator.classList.remove('hidden');

    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            // Reverse Geocoding
            const revUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
            const revRes = await fetch(revUrl);
            const revData = await revRes.json();
            
            const city = revData.city || revData.locality || "Unknown Location";
            cityInput.value = city;
            
            await fetchWeatherData(latitude, longitude, city, revData.countryCode);
        } catch (error) {
            showError();
        }
    }, () => {
        showError("Permission denied or unable to locate.");
    });
});

// --- Search Form ---
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;
    
    recentSearchesEl.classList.add('hidden');
    handleSearch(city);
});

async function handleSearch(city) {
    resetUI();
    loadingIndicator.textContent = "Fetching records...";
    loadingIndicator.classList.remove('hidden');

    try {
        // Geocoding
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Location not found");
        }

        const { latitude, longitude, name, country_code } = geoData.results[0];
        saveSearch(name);
        await fetchWeatherData(latitude, longitude, name, country_code);
    } catch (error) {
        showError();
    }
}

// --- Fetch Weather Data ---
async function fetchWeatherData(lat, lon, city, countryCode) {
    // Feature: 5-Day Forecast
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    
    // Cache for unit toggling
    currentWeatherData = {
        city,
        countryCode,
        data: data.current,
        daily: data.daily
    };

    renderData(city, countryCode, data.current, data.daily);
}

// --- DOM Rendering ---
function renderData(city, countryCode, current, daily) {
    loadingIndicator.classList.add('hidden');
    
    primaryWeather.classList.remove('hidden');
    secondaryWeather.classList.remove('hidden');

    // Unit Labels
    const unitLabel = currentUnit === 'c' ? '°C' : '°F';
    mainTempUnit.textContent = unitLabel;
    document.querySelectorAll('.temp-unit-small').forEach(el => el.textContent = unitLabel);

    // Primary
    cityNameEl.textContent = `${city}, ${countryCode}`;
    temperatureEl.textContent = convertTemp(current.temperature_2m);
    
    const condition = mapWeatherCode(current.weather_code, current.is_day);
    weatherDescEl.textContent = condition.text;
    weatherIconEl.className = `fas ${condition.icon} weather-icon-main`;

    // Feature: Dynamic Background
    updateTheme(condition.theme);

    // Secondary
    feelsLikeEl.textContent = convertTemp(current.apparent_temperature);
    humidityEl.textContent = `${current.relative_humidity_2m}%`;
    windSpeedEl.textContent = `${current.wind_speed_10m} km/h`;

    // Render Forecast
    renderForecast(daily);
}

function renderForecast(daily) {
    forecastRow.innerHTML = '';
    // Show next 5 days
    for (let i = 1; i <= 5; i++) {
        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const maxTemp = convertTemp(daily.temperature_2m_max[i]);
        const condition = mapWeatherCode(daily.weather_code[i], 1); // assume day for forecast icon
        
        const item = document.createElement('div');
        item.className = 'forecast-item';
        item.innerHTML = `
            <span class="forecast-day">${dayName}</span>
            <i class="fas ${condition.icon} forecast-icon"></i>
            <span class="forecast-temp">${maxTemp}°</span>
        `;
        forecastRow.appendChild(item);
    }
}

// --- Dynamic Theme ---
function updateTheme(themeName) {
    bgTint.className = `bg-tint theme-${themeName}`;
}

// --- Utility Functions ---
function resetUI() {
    errorMessage.classList.add('hidden');
    statusMessage.classList.add('hidden');
    primaryWeather.classList.add('hidden');
    secondaryWeather.classList.add('hidden');
}

function showError(msg = "Location not found. Try again.") {
    loadingIndicator.classList.add('hidden');
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
}

function mapWeatherCode(code, isDay) {
    let text = "Clear";
    let icon = isDay ? "fa-sun" : "fa-moon";
    let theme = "clear";

    if (code === 0) {
        text = "Clear sky";
        theme = "clear";
    } else if (code >= 1 && code <= 3) {
        text = code === 3 ? "Overcast" : "Partly cloudy";
        icon = isDay ? "fa-cloud-sun" : "fa-cloud-moon";
        if (code === 3) icon = "fa-cloud";
        theme = code === 3 ? "cloudy" : "clear";
    } else if (code === 45 || code === 48) {
        text = "Fog";
        icon = "fa-smog";
        theme = "cloudy";
    } else if (code >= 51 && code <= 67) {
        text = "Rain";
        icon = "fa-cloud-rain";
        theme = "rain";
    } else if (code >= 71 && code <= 77) {
        text = "Snow";
        icon = "fa-snowflake";
        theme = "snow";
    } else if (code >= 80 && code <= 82) {
        text = "Showers";
        icon = "fa-cloud-showers-heavy";
        theme = "rain";
    } else if (code >= 95 && code <= 99) {
        text = "Thunderstorm";
        icon = "fa-bolt";
        theme = "rain";
    }

    // fallback night theme logic if wanted, but using daytime colors with dimming could work.
    // For simplicity, we keep themes clean and minimal as requested.
    
    return { text, icon, theme };
}
