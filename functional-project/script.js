// Elements
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');

const statusState = document.getElementById('statusState');
const loadingState = document.getElementById('loadingState');
const weatherCard = document.getElementById('weatherCard');
const errorMessage = document.getElementById('errorMessage');

const cityNameEl = document.getElementById('cityName');
const weatherIconEl = document.getElementById('weatherIcon');
const temperatureEl = document.getElementById('temperature');
const weatherDescEl = document.getElementById('weatherDescription');
const feelsLikeEl = document.getElementById('feelsLike');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');

// Event Listeners
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;
    
    errorMessage.classList.add('hidden');
    statusState.classList.add('hidden');
    weatherCard.classList.add('hidden');
    loadingState.classList.remove('hidden');

    try {
        await fetchWeatherData(city);
    } catch (error) {
        console.error("Fetch error:", error);
        loadingState.classList.add('hidden');
        statusState.classList.remove('hidden');
        errorMessage.classList.remove('hidden');
    }
});

// API Calls
async function fetchWeatherData(city) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found");
    }

    const location = geoData.results[0];
    const { latitude, longitude, name, country_code } = location;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    updateUI(name, country_code, current);
}

function updateUI(city, countryCode, data) {
    loadingState.classList.add('hidden');
    weatherCard.classList.remove('hidden');

    // Text data
    cityNameEl.textContent = `${city}, ${countryCode}`;
    temperatureEl.textContent = Math.round(data.temperature_2m);
    feelsLikeEl.textContent = `${Math.round(data.apparent_temperature)}°C`;
    humidityEl.textContent = `${data.relative_humidity_2m}%`;
    windSpeedEl.textContent = `${data.wind_speed_10m} km/h`;

    // Condition mapping
    const condition = mapWeatherCode(data.weather_code, data.is_day);
    weatherDescEl.textContent = condition.text;
    weatherIconEl.className = `fas ${condition.icon} weather-icon`;
}

// Map WMO codes to basic conditions
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
