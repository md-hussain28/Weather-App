document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('searchInput').value;
    if (city) {
        fetchWeather(city);
    }
});

document.getElementById('locationButton').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByLocation(latitude, longitude);
        }, error => {
            console.error('Error getting location:', error);
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

async function fetchWeather(city) {
    const apiKey = '1edb9b45182f33fe3d915d0149bfe9fe'; // Your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        showLoadingSpinner();
        const response = await fetch(url);
        const data = await response.json();
        hideLoadingSpinner();
        displayWeather(data);
        fetchTemperatureTrend(city);
    } catch (error) {
        hideLoadingSpinner();
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

async function fetchWeatherByLocation(latitude, longitude) {
    const apiKey = '1edb9b45182f33fe3d915d0149bfe9fe'; // Your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
        showLoadingSpinner();
        const response = await fetch(url);
        const data = await response.json();
        hideLoadingSpinner();
        displayWeather(data);
        fetchTemperatureTrendByLocation(latitude, longitude);
    } catch (error) {
        hideLoadingSpinner();
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weatherContainer');
    if (data.cod === 200) {
        weatherContainer.innerHTML = `
            <div class="weather-info">
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>${data.weather[0].description}</p>
                <p>${data.main.temp}°C</p>
                <p>Feels Like: ${data.main.feels_like}°C</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <p>Pressure: ${data.main.pressure} hPa</p>
                <p>Visibility: ${data.visibility / 1000} km</p>
                <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
                <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>
        `;
    } else {
        weatherContainer.innerHTML = `<p class="error">City not found. Please try again.</p>`;
    }
}

async function fetchTemperatureTrend(city) {
    const apiKey = '1edb9b45182f33fe3d915d0149bfe9fe'; // Your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayTemperatureTrend(data);
    } catch (error) {
        console.error('Error fetching temperature trend data:', error);
    }
}

async function fetchTemperatureTrendByLocation(latitude, longitude) {
    const apiKey = '1edb9b45182f33fe3d915d0149bfe9fe'; // Your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayTemperatureTrend(data);
    } catch (error) {
        console.error('Error fetching temperature trend data:', error);
    }
}

function displayTemperatureTrend(data) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    const labels = data.list.map(item => new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const temperatures = data.list.map(item => item.main.temp);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}

function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}
