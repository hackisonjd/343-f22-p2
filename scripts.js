const wmo = Object.freeze( {
    0: ['Clear sky', 'images/sun-light.svg'], 
    1: ['Mainly clear', 'images/sun-light.svg'],
    2: ['Partly cloudy', 'images/cloud-sunny.svg'],
    3: ['Overcast', 'images/cloud.svg'],
    45: ['Fog', 'images/cloud.svg'],
    48: ['Depositing rime fog','images/cloud.svg'],
    51: ['Drizzle: light intensity', 'images/rain.svg'],
    53: ['Drizzle: moderate intensity', 'images/rain.svg'],
    55: ['Drizzle: heavy intensity', 'images/rain.svg'],
    56: ['Freezing drizzle: light intensity', 'images/rain.svg'],
    57: ['Freezing drizzle: dense intensity', 'images/rain.svg'],
    61: ['Rain: slight intensity', 'images/heavy-rain.svg'],
    63: ['Rain: moderate intensity', 'images/heavy-rain.svg'],
    65: ['Rain: heavy intensity', 'images/heavy-rain.svg'],
    66: ['Freezing rain: light intensity', 'images/heavy-rain.svg'],
    67: ['Freezing rain: heavy intensity', 'images/heavy-rain.svg'],
    71: ['Snow fall: slight intensity', 'images/snow-flake.svg'],
    73: ['Snow fall: moderate intensity', 'images/snow-flake.svg'],
    75: ['Snow fall: heavy intensity', 'images/snow-flake.svg'],
    77: ['Snow grains', 'images/snow-flake.svg'],
    80: ['Rain showers: slight intensity', 'images/rain.svg'],
    81: ['Rain showers: moderate intensity', 'images/rain.svg'],
    82: ['Rain showers: violent intensity', 'images/heavy-rain.svg'],
    85: ['Snow showers: slight intensity', 'images/snow.svg'],
    86: ['Snow showers: heavy intensity', 'images/snow.svg'],
    95: ['Thunderstorm', 'images/thunderstorm.svg'],
    96: ['Thunderstorm with slight hail', 'images/thunderstorm.svg'],
    99: ['Thunderstorm with heavy hail', 'images/thunderstorm.svg']
}
);


const app = document.getElementById('root');
const logo = document.createElement('img');
logo.src = 'images/bop.jpg';

const container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(logo);
app.appendChild(container);

var weatherRequest = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
weatherRequest.open('GET', 'https://api.open-meteo.com/v1/forecast?latitude=38.43&longitude=-78.86&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&temperature_unit=fahrenheit&timezone=America%2FNew_York', true);

weatherRequest.onload = function () {
    // Access JSON data here
    var weatherData = JSON.parse(this.response);

    // Data to be used in the app.

    if (weatherRequest.status >= 200 && weatherRequest.status < 400) {

        var date = new Date();
        var time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        console.log("Time: " + time);

        var status = wmo[weatherData.current_weather.weathercode][0];
        console.log("Status: " + status);

        var current_temp = weatherData.current_weather.temperature;
        console.log("Current Temp: " + current_temp + "°F");

        var high_temp = weatherData.daily.temperature_2m_max[0];
        console.log("High: " + high_temp + "°F");

        var low_temp = weatherData.daily.temperature_2m_min[0];
        console.log("Low: " + low_temp + "°F");

        var icon = wmo[weatherData.current_weather.weathercode][1];
        console.log("Icon: " + icon);      
        
    } else {
        console.log('error');
    }

    

}

// Send request
weatherRequest.send();