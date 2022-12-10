const wmo = Object.freeze({
  0: ["Clear sky", "images/sun-light.svg"],
  1: ["Mainly clear", "images/sun-light.svg"],
  2: ["Partly cloudy", "images/cloud-sunny.svg"],
  3: ["Overcast", "images/cloud.svg"],
  45: ["Fog", "images/cloud.svg"],
  48: ["Depositing rime fog", "images/cloud.svg"],
  51: ["Drizzle: light intensity", "images/rain.svg"],
  53: ["Drizzle: moderate intensity", "images/rain.svg"],
  55: ["Drizzle: heavy intensity", "images/rain.svg"],
  56: ["Freezing drizzle: light intensity", "images/rain.svg"],
  57: ["Freezing drizzle: dense intensity", "images/rain.svg"],
  61: ["Rain: slight intensity", "images/heavy-rain.svg"],
  63: ["Rain: moderate intensity", "images/heavy-rain.svg"],
  65: ["Rain: heavy intensity", "images/heavy-rain.svg"],
  66: ["Freezing rain: light intensity", "images/heavy-rain.svg"],
  67: ["Freezing rain: heavy intensity", "images/heavy-rain.svg"],
  71: ["Snow fall: slight intensity", "images/snow-flake.svg"],
  73: ["Snow fall: moderate intensity", "images/snow-flake.svg"],
  75: ["Snow fall: heavy intensity", "images/snow-flake.svg"],
  77: ["Snow grains", "images/snow-flake.svg"],
  80: ["Rain showers: slight intensity", "images/rain.svg"],
  81: ["Rain showers: moderate intensity", "images/rain.svg"],
  82: ["Rain showers: violent intensity", "images/heavy-rain.svg"],
  85: ["Snow showers: slight intensity", "images/snow.svg"],
  86: ["Snow showers: heavy intensity", "images/snow.svg"],
  95: ["Thunderstorm", "images/thunderstorm.svg"],
  96: ["Thunderstorm with slight hail", "images/thunderstorm.svg"],
  99: ["Thunderstorm with heavy hail", "images/thunderstorm.svg"],
});

const form = document.getElementById("form");
const searchQuery = document.getElementById("search");

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
});

searchQuery.addEventListener("keyup", async function (ev) {
  ev.preventDefault();
  if (ev.key == "Enter") {
    const results = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery.value}`
    );
    const resultsJSON = await results.json();
    console.log(resultsJSON);
    const lat = resultsJSON[0].latitude;
    const lon = resultsJSON[0].longitude;
  }
});

// Get current time and display it in the right side of navbar.
var date = new Date();
var time = date.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});
console.log("Time: " + time);

// Place time variable in the right side of navbar.
var timeElement = document.getElementById("time");
timeElement.innerHTML = time;

// sets up a promise to get the weather data asynchonously.
// lat: latitude of location
// lon: longitude of location
async function weatherSearch(lat, lon) {
  console.log(lat);
  await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&temperature_unit=fahrenheit&timezone=America%2FNew_York`
  )
    .then((response) => response.json())
    .then((jsonResponse) => parseData(jsonResponse));
}

// Parses promise data into the appropriate elements.
// response: the response from the API call
function parseData(response) {
  // weathercodes. look up in wmo object.
  const status = wmo[response.current_weather.weathercode][0];

  // json data from API call
  var weatherData = response;

  // these are the elements that will be displayed on the page.
  var statusElement = status;
  var locationElement = weatherData.latitude + ", " + weatherData.longitude;
  var current_tempElement =
    "</p><h4>CURRENTLY</h4><p>" +
    weatherData.current_weather.temperature +
    "°F</p>";
  var high_tempElement =
    `High:  <p>` + weatherData.daily.temperature_2m_max[0] + "°F</p>";
  var low_tempElement =
    `Low:  <p>` + weatherData.daily.temperature_2m_min[0] + "°F</p>";
  var iconRef = wmo[weatherData.current_weather.weathercode][1];
  buildPage(
    statusElement,
    current_tempElement,
    high_tempElement,
    low_tempElement,
    iconRef,
    locationElement
  );
}

// Builds the page. If a new instance, then it will take the client's location. If not, then it will take the location from the search bar (TODO).
function buildPage(
  status,
  current_temp,
  high_temp,
  low_temp,
  iconRef,
  locationElement
) {
  const weatherStatus = document.getElementById("weather-status");
  const currentTemp = document.getElementById("current-temperature");
  const highTemp = document.getElementById("high-temperature");
  const lowTemp = document.getElementById("low-temperature");
  const location = document.getElementById("location");

  weatherStatus.innerHTML = status;
  currentTemp.innerHTML = current_temp;
  highTemp.innerHTML = high_temp;
  lowTemp.innerHTML = low_temp;
  location.innerHTML = locationElement;
  document.getElementById("weather-icon").src = iconRef;
}

// Gets the client's location and passes it to the weatherSearch function.
function locateClient() {
  if ("geolocation" in navigator) {
    console.log("geolocation available");
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position.coords.latitude, position.coords.longitude);
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      console.log(position);
      weatherSearch(lat, lon);
    });
  } else {
    console.log("geolocation not available");
  }
}

locateClient();
