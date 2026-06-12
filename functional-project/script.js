// Elements Selection
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');

const statusMessage = document.getElementById('statusMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');

const primaryWeather = document.getElementById('primaryWeather');
const secondaryWeather = document.getElementById('secondaryWeather');

// Data Nodes
const cityNameEl = document.getElementById('cityName');
const weatherDescEl = document.getElementById('weatherDescription');
const temperatureEl = document.getElementById('temperature');
const weatherIconEl = document.getElementById('weatherIcon');

const feelsLikeEl = document.getElementById('feelsLike');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');

// Form Submission
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;
    
    // UI state reset
    errorMessage.classList.add('hidden');
    statusMessage.classList.add('hidden');
    primaryWeather.classList.add('hidden');
    secondaryWeather.classList.add('hidden');
    
    loadingIndicator.classList.remove('hidden');

    try {
        await fetchWeatherData(city);
    } catch (error) {
        console.error("Fetch failed:", error);
        loadingIndicator.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
});

// API Integration
async function fetchWeatherData(city) {
    // 1. Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Location not found");
    }

    const { latitude, longitude, name, country_code } = geoData.results[0];

    // 2. Weather Data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    renderData(name, country_code, current);
}

// DOM Rendering
function renderData(city, countryCode, data) {
    loadingIndicator.classList.add('hidden');
    
    // Reveal main sections
    primaryWeather.classList.remove('hidden');
    secondaryWeather.classList.remove('hidden');

    // Populate Left Column (Primary)
    cityNameEl.textContent = `${city}, ${countryCode}`;
    temperatureEl.textContent = Math.round(data.temperature_2m);
    
    const condition = mapWeatherCode(data.weather_code, data.is_day);
    weatherDescEl.textContent = condition.text;
    weatherIconEl.className = `fas ${condition.icon} weather-icon-main`;

    // Populate Right Column (Secondary)
    feelsLikeEl.textContent = `${Math.round(data.apparent_temperature)}°C`;
    humidityEl.textContent = `${data.relative_humidity_2m}%`;
    windSpeedEl.textContent = `${data.wind_speed_10m} km/h`;
}

// WMO Code mapping utility
function mapWeatherCode(code, isDay) {
    let text = "Clear";
    let icon = isDay ? "fa-sun" : "fa-moon";

    if (code === 0) {
        text = "Clear sky";
    } else if (code >= 1 && code <= 3) {
        text = code === 3 ? "Overcast" : "Partly cloudy";
        icon = isDay ? "fa-cloud-sun" : "fa-cloud-moon";
        if (code === 3) icon = "fa-cloud";
    } else if (code === 45 || code === 48) {
        text = "Fog";
        icon = "fa-smog";
    } else if (code >= 51 && code <= 67) {
        text = "Rain";
        icon = "fa-cloud-rain";
    } else if (code >= 71 && code <= 77) {
        text = "Snow";
        icon = "fa-snowflake";
    } else if (code >= 80 && code <= 82) {
        text = "Showers";
        icon = "fa-cloud-showers-heavy";
    } else if (code >= 95 && code <= 99) {
        text = "Thunderstorm";
        icon = "fa-bolt";
    }

    return { text, icon };
}
