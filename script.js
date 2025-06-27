document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const weatherForm = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const weatherInfo = document.getElementById('weather-info');
    const videoSource = document.getElementById('video-source');
    const bgVideo = document.getElementById('bg-video');
    const weatherBox = document.getElementById('weather-box');

    // API Key
    const API_KEY = '5b74e87158f9cad9592fdfeac5683b9f';

    // Hide weather box initially
    weatherBox.style.display = 'none';

    // Initialize default video
    function initVideo() {
        videoSource.src = "videos/default.mp4";
        bgVideo.load();
        bgVideo.play().catch(e => {
            bgVideo.muted = true;
            bgVideo.play();
        });
    }

    // Initialize app
    initVideo();

    // Event Listeners
    weatherForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    });

    // Weather Function
    async function getWeather(city) {
        try {
            weatherBox.style.display = 'block';
            showLoading(`Fetching weather for ${city}...`);
            
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            
            if (!response.ok) {
                throw new Error('City not found');
            }
            
            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            showError("Weather Error", error.message);
            initVideo();
        }
    }

    function showLoading(message) {
        weatherInfo.innerHTML = `
            <div class="loading-spinner">⏳</div>
            <p>${message}</p>
        `;
    }

    function showError(title, message) {
        weatherInfo.innerHTML = `
            <h2 style="color: #ff6b6b;">❌ ${title}</h2>
            <p>${message}</p>
        `;
    }

    function displayWeather(data) {
        const condition = data.weather[0].main.toLowerCase();
        const { icon, video } = getWeatherAssets(condition);
        
        videoSource.src = `videos/${video}`;
        bgVideo.load();
        bgVideo.play();

        weatherInfo.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <div style="font-size: 3rem;">${icon}</div>
            <p class="temperature">${Math.round(data.main.temp)}°C</p>
            <p class="conditions">${data.weather[0].description}</p>
            <p class="feels-like">Feels like: ${Math.round(data.main.feels_like)}°C</p>
            
            <div class="weather-details">
                <div class="weather-detail-item">
                    <span>Humidity</span>
                    <span>${data.main.humidity}%</span>
                </div>
                <div class="weather-detail-item">
                    <span>Wind</span>
                    <span>${data.wind.speed} m/s</span>
                </div>
                <div class="weather-detail-item">
                    <span>Pressure</span>
                    <span>${data.main.pressure} hPa</span>
                </div>
            </div>
            
            <div class="sun-times">
                <p>🌅 Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p>🌇 Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
        `;
    }

    function getWeatherAssets(condition) {
        const weatherAssets = {
            'clear': { icon: '☀️', video: 'sunny.mp4' },
            'rain': { icon: '🌧️', video: 'rainy.mp4' },
            'drizzle': { icon: '🌦️', video: 'drizzle.mp4' },
            'clouds': { icon: '☁️', video: 'cloudy.mp4' },
            'snow': { icon: '❄️', video: 'snowy.mp4' },
            'thunderstorm': { icon: '⛈️', video: 'thunderstorm.mp4' },
            'mist': { icon: '🌫️', video: 'foggy.mp4' },
            'fog': { icon: '🌫️', video: 'foggy.mp4' },
            'haze': { icon: '🌫️', video: 'foggy.mp4' },
            'tornado': { icon: '🌪️', video: 'tornado.mp4' },
            'default': { icon: '🌤️', video: 'default.mp4' }
        };

        return weatherAssets[condition] || weatherAssets['default'];
    }
});