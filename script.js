const apiKey = 'f00c38e0279b7bc85480c3fe775d518c'; 
const backgroundImages = [
    'german-rodriguez-43PkoZxbfek-unsplash.jpg',
    'angelina-radiance-xAgmY6x0yQE-unsplash.jpg',
    'kokouvi-essena-zmhwvM2MgVk-unsplash.jpg',
    'navi-jtyjcQj6MlA-unsplash.jpg',
    'johannes-plenio-RwHv7LgeC7s-unsplash.jpg'
];
let currentBackgroundIndex = 0;

function cycleBackground() {
    const body = document.querySelector('body');
    body.style.backgroundImage = `url('${backgroundImages[currentBackgroundIndex]}')`;
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length; 
}

cycleBackground(); // Initial call

setInterval(cycleBackground, 30000); 

function getWeather() {
    const locationInput = document.getElementById('location-input');
    const city = locationInput.value;

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); 
            }
            return response.json();
        })
        .then(data => {
            const locationElement = document.getElementById('location');
            const temperatureElement = document.getElementById('temperature');
            const descriptionElement = document.getElementById('description');
            const iconElement = document.getElementById('icon');
            const windElement = document.getElementById('wind');
            const humidityElement = document.getElementById('humidity');

            locationElement.textContent = `${data.name}, ${data.sys.country}`;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;
            iconElement.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`;
            windElement.textContent = `Wind: ${data.wind.speed} m/s`;
            humidityElement.textContent = `Humidity: ${data.main.humidity}%`;

            return fetch(forecastUrl); 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); 
            }
            return response.json();
        })
        .then(forecastData => {
            // Extract relevant data for the chart
            const chartData = forecastData.list.map(item => ({
                time: new Date(item.dt * 1000),
                temp: item.main.temp
            }));

            // Create the chart using Chart.js
            const ctx = document.getElementById('weather-chart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.map(item => item.time), 
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: chartData.map(item => item.temp),
                        borderColor: 'blue',
                        fill: false
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Temperature Forecast'
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                unit: 'hour', 
                                tooltipFormat: 'll HH:mm' 
                            },
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Date/Time'
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

            // Add the image to the chart container after successful API call
            const chartContainer = document.getElementById('chart-container');
            const chartImage = document.createElement('img');
            chartImage.src = 'Screenshot 2025-01-23 100326.png'; // Replace with the actual path
            chartImage.alt = 'Temperature Forecast Chart';
            chartContainer.appendChild(chartImage); 

        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            const errorMessage = document.createElement('p');
            errorMessage.id = 'error-message'; 
            errorMessage.textContent = 'Unable to retrieve weather data. Please try again later.';
            document.getElementById('weather-info').appendChild(errorMessage);
            document.getElementById('error-message').style.display = 'block'; 
        });
}