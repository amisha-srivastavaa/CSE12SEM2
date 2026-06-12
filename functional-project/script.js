// Global State
let currentUnit = 'c'; // 'c' or 'f'
let weatherCache = null; // Cache for unit conversion

// DOM Elements
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const recentSearchesEl = document.getElementById('recentSearches');
const geoBtn = document.getElementById('geoBtn');
const unitToggleBtns = document.querySelectorAll('.unit-btn');

const errorMessage = document.getElementById('errorMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const weatherContent = document.getElementById('weatherContent');

const cityNameEl = document.getElementById('cityName');
const weatherIconEl = document.getElementById('weatherIcon');
const weatherDescEl = document.getElementById('weatherDescription');
const temperatureEl = document.getElementById('temperature');
const mainTempUnit = document.getElementById('mainTempUnit');

const feelsLikeEl = document.getElementById('feelsLike');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');

const hourlyRow = document.getElementById('hourlyRow');
const dailyList = document.getElementById('dailyList');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadRecentSearches();
});

// --- Unit Toggle ---
unitToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const selected = e.target.getAttribute('data-unit');
        if (selected === currentUnit) return;
        
        currentUnit = selected;
        unitToggleBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

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

// --- Recent Searches ---
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

// --- Form & Search ---
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
        // Geocoding via Open-Meteo (No API key needed)
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

// --- Geolocation ---
geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            // Reverse geocode
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

// --- Fetch Weather ---
async function fetchWeather(lat, lon, city, country) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    
    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();
        
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

// --- Render UI ---
function renderWeather(city, country, current, hourly, daily) {
    setLoading(false);
    weatherContent.classList.remove('hidden');

    // Unit Setup
    const unitLabel = getUnitLabel();
    mainTempUnit.textContent = unitLabel;

    // Left Column: Primary
    cityNameEl.textContent = `${city}, ${country || ''}`.replace(/, $/, '');
    temperatureEl.textContent = convertTemp(current.temperature_2m);
    
    const condition = mapWeather(current.weather_code, current.is_day);
    weatherDescEl.textContent = condition.text;
    weatherIconEl.className = `fas ${condition.icon} condition-icon`;
    
    // Dynamic Theme
    document.body.className = `theme-${condition.theme}`;

    // Left Column: Metrics
    feelsLikeEl.textContent = `${convertTemp(current.apparent_temperature)}${unitLabel}`;
    humidityEl.textContent = `${current.relative_humidity_2m}%`;
    windSpeedEl.textContent = `${current.wind_speed_10m} km/h`;

    // Right Column: Hourly Forecast (Next 6 hours)
    hourlyRow.innerHTML = '';
    // Find current hour index
    const now = new Date();
    const currentHourString = now.toISOString().slice(0, 14) + "00"; 
    // Simplified: Just take the first 6 hours from current time in the array
    // Open-Meteo provides hours for the whole day. We find the index matching closest to now.
    const currentTimeIndex = hourly.time.findIndex(t => new Date(t) > now) || 0;
    
    for (let i = currentTimeIndex; i < currentTimeIndex + 6; i++) {
        if (!hourly.time[i]) break;
        const time = new Date(hourly.time[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = convertTemp(hourly.temperature_2m[i]);
        const cond = mapWeather(hourly.weather_code[i], 1); // Assume day icon for simplicity
        
        const div = document.createElement('div');
        div.className = 'hourly-item';
        div.innerHTML = `
            <span class="hourly-time">${time}</span>
            <i class="fas ${cond.icon} hourly-icon"></i>
            <span class="hourly-temp">${temp}°</span>
        `;
        hourlyRow.appendChild(div);
    }

    // Right Column: Daily Forecast (Next 5 days)
    dailyList.innerHTML = '';
    for (let i = 1; i <= 5; i++) { // Skip 0 as it is today
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

// --- Utilities ---
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

// Maps WMO codes to text, icon, and theme
function mapWeather(code, isDay) {
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
        theme = "clouds";
    } else if (code === 45 || code === 48) {
        text = "Fog";
        icon = "fa-smog";
        theme = "clouds";
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
        theme = "thunderstorm";
    }

    return { text, icon, theme };
}
