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
var searchString = '';
var date = new Date();
var time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
console.log("Time: " + time);

// Place time variable in the right side of navbar.
var timeElement = document.getElementById('time');
timeElement.innerHTML = time;



// Find user's location and display it in the right panel.
if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position.coords.latitude, position.coords.longitude);
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        console.log(position)

        weatherRequest.open('GET', `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&temperature_unit=fahrenheit&timezone=America%2FNew_York`, true);

        weatherRequest.onload = function () {
        // Access JSON data here
        var weatherData = JSON.parse(this.response);

        // Data to be used in the app.

        if (weatherRequest.status >= 200 && weatherRequest.status < 400) {

            var status = wmo[weatherData.current_weather.weathercode][0];
            status = "<h4>" + status + "</h4>";

            var current_temp = weatherData.current_weather.temperature;
            current_temp = current_temp + "°F";

            var high_temp = weatherData.daily.temperature_2m_max[0];
            high_temp = "<h4>High:  </h4>" +  high_temp + "°F";

            var low_temp = weatherData.daily.temperature_2m_min[0];
            low_temp = "<h4>Low:  </h4>" + low_temp + "°F";

            const weathercode_img = document.createElement('img');
            weathercode_img.src = wmo[weatherData.current_weather.weathercode][1]; 
            weathercode_img.style.height = '100px';
            weathercode_img.style.width = '100px';  
        
            // Left panel, contains today's high and low temps.
            var leftPanel = document.getElementById('leftPanel');
            leftPanel.innerHTML = "<h4>TODAY</h4>" + high_temp + "<hr>" + low_temp;

            // Right panel, contains current temperature and city name.
            var rightPanel = document.getElementById('rightPanel');
            rightPanel.innerHTML = `${lat}, ${lon}<h4>CURRENTLY</h4><h2>` + current_temp + `</h2>`;

            var mainPanel = document.getElementById('mainPanel');
            mainPanel.appendChild(weathercode_img);
            mainPanel.appendChild(document.createElement('br'));
            mainPanel.innerHTML = mainPanel.innerHTML + status;

        
        } else {
            console.log('error');
        }
    }
    // Send request
    weatherRequest.send();
        });
    } else {
        console.log('geolocation not available');
}
var weatherRequest = new XMLHttpRequest();