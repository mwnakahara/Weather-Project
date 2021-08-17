function makeBinary(value) {
  let binaryValue = "";
  if (value < 10) {
    binaryValue = `0${value}`;
  } else {
    binaryValue = `${value}`;
  }
  return binaryValue;
}

function getDate() {
  let today = new Date();
  let minutes = makeBinary(today.getMinutes());
  let hours = makeBinary(today.getHours());
  let day = makeBinary(today.getDate());
  let month = makeBinary(today.getMonth() + 1);
  let year = today.getFullYear();
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let weekday = weekdays[today.getDay()];

  let currentTime = `${hours}:${minutes}`;
  let currentDate = `${weekday} ${year}/${month}/${day}`;
  let dateLine = document.querySelector("#current-date");
  dateLine.innerHTML = `${currentDate} <small>${currentTime}</small>`;
}

function convertWeekday(timestamp) {
  let forecastDate = new Date(timestamp * 1000);
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let weekday = weekdays[forecastDate.getDay()];
  return weekday;
}

function convertDate(timestamp) {
  let forecastDate = new Date(timestamp * 1000);
  let date = makeBinary(forecastDate.getDate());
  let month = makeBinary(forecastDate.getMonth() + 1);
  let nextDate = `${month}/${date}`;
  return nextDate;
}

function decideUnit() {
  let unitNowLine = document.querySelector("#unit-now");
  if (unitNowLine.innerHTML === "℃") {
    return "metric";
  } else {
    return "imperial";
  }
}

function changeToFahrenheit(event) {
  let unitNowLine = document.querySelector("#unit-now");
  let unitNowMaxLine = document.querySelector("#unit-maxTemp-today");
  let unitNowMinLine = document.querySelector("#unit-minTemp-today");

  unitNowLine.innerHTML = "℉";
  unitNowMaxLine.innerHTML = "℉";
  unitNowMinLine.innerHTML = "℉";

  let tempNowLine = document.querySelector("#temp-now");
  let tempNowMaxLine = document.querySelector("#maxTemp-today");
  let tempNowMinLine = document.querySelector("#minTemp-today");

  fahrenheitTemp = Math.round(celsiusTemp * (9 / 5) + 32);
  fahrenheitTempMax = Math.round(celsiusTempMax * (9 / 5) + 32);
  fahrenheitTempMin = Math.round(celsiusTempMin * (9 / 5) + 32);

  tempNowLine.innerHTML = fahrenheitTemp;
  tempNowMaxLine.innerHTML = fahrenheitTempMax;
  tempNowMinLine.innerHTML = fahrenheitTempMin;

  convertForecast();
}

function changeToCelsius(event) {
  let unitNowLine = document.querySelector("#unit-now");
  let unitNowMaxLine = document.querySelector("#unit-maxTemp-today");
  let unitNowMinLine = document.querySelector("#unit-minTemp-today");

  unitNowLine.innerHTML = "℃";
  unitNowMaxLine.innerHTML = "℃";
  unitNowMinLine.innerHTML = "℃";

  let tempNowLine = document.querySelector("#temp-now");
  let tempNowMaxLine = document.querySelector("#maxTemp-today");
  let tempNowMinLine = document.querySelector("#minTemp-today");

  celsiusTemp = Math.round(((fahrenheitTemp - 32) * 5) / 9);
  celsiusTempMax = Math.round(((fahrenheitTempMax - 32) * 5) / 9);
  celsiusTempMin = Math.round(((fahrenheitTempMin - 32) * 5) / 9);

  tempNowLine.innerHTML = celsiusTemp;
  tempNowMaxLine.innerHTML = celsiusTempMax;
  tempNowMinLine.innerHTML = celsiusTempMin;

  convertForecast();
}

function convertForecast() {
  let cityLine = document.querySelector("#current-city");
  let city = cityLine.innerHTML;
  let apiKey = "aeba3e6df17f742792c4f3a90b3720ad";
  let unit = decideUnit();
  let urlWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(urlWeatherAPI).then(updateForecast);
}

function updateForecast(response) {
  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;
  let apiKey = "aeba3e6df17f742792c4f3a90b3720ad";
  let unit = decideUnit();
  let urlForecastAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(urlForecastAPI).then(displayForecast);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let unit = decideUnit();
  if (unit === "metric") {
    unit = "℃";
  } else {
    unit = "℉";
  }
  let forecastLine = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index >= 1 && index <= 6) {
      forecastHTML += `<div class="col next-day-all">
      <div class="next-day">
            <div id="weekday-next">${convertWeekday(forecastDay.dt)}</div>
            <div id="date-next">${convertDate(forecastDay.dt)}</div>
          </div>

          <div><img src="${`https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png`}" alt="${
        forecastDay.weather[0].description
      }" width="50" id="symbol-next" /></div>
          <div class="description description-next">${
            forecastDay.weather[0].description
          }</div>      
          <div class="next-mm-all">max/min</div>      
          <div class="next-mmTemp-all">
            <span id="max-next">${Math.round(
              forecastDay.temp.max
            )}</span><span id="unit-maxTemp-next">${unit}</span><span>/ </span>
            <span id="min-next">${Math.round(
              forecastDay.temp.min
            )}</span><span id="unit-minTemp-next">${unit}</span></div>
            </div>`;
    }
  });

  forecastHTML += `</div>`;
  forecastLine.innerHTML = forecastHTML;

  getDate();
}

function getForecast(coordinates) {
  let latitude = coordinates.lat;
  let longitude = coordinates.lon;
  let apiKey = "aeba3e6df17f742792c4f3a90b3720ad";
  let unit = decideUnit();

  let urlForecastAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(urlForecastAPI).then(displayForecast);
}

function displayTemperature(response) {
  let newTemp = Math.round(response.data.main.temp);
  let newTempMax = Math.round(response.data.main.temp_max);
  let newTempMin = Math.round(response.data.main.temp_min);

  let unitNowLine = document.querySelector("#unit-now");
  if (unitNowLine.innerHTML === "℃") {
    celsiusTemp = newTemp;
    celsiusTempMax = newTempMax;
    celsiusTempMin = newTempMin;

    let tempNowLine = document.querySelector("#temp-now");
    let newMaxTempLine = document.querySelector("#maxTemp-today");
    let newMinTempLine = document.querySelector("#minTemp-today");

    tempNowLine.innerHTML = celsiusTemp;
    newMaxTempLine.innerHTML = celsiusTempMax;
    newMinTempLine.innerHTML = celsiusTempMin;
  } else {
    fahrenheitTemp = newTemp;
    fahrenheitTempMax = newTempMax;
    fahrenheitTempMin = newTempMin;

    let tempNowLine = document.querySelector("#temp-now");
    let newMaxTempLine = document.querySelector("#maxTemp-today");
    let newMinTempLine = document.querySelector("#minTemp-today");

    tempNowLine.innerHTML = fahrenheitTemp;
    newMaxTempLine.innerHTML = fahrenheitTempMax;
    newMinTempLine.innerHTML = fahrenheitTempMin;
  }

  let description = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;

  let descriptionLine = document.querySelector("#description");
  let humidityLine = document.querySelector("#humidity");
  let windSpeedLine = document.querySelector("#windSpeed");

  descriptionLine.innerHTML = description;
  humidityLine.innerHTML = humidity;
  windSpeedLine.innerHTML = windSpeed.toFixed(1);

  let symbolCode = response.data.weather[0].icon;
  let symbolURL = `http://openweathermap.org/img/wn/${symbolCode}@2x.png`;
  let symbolLine = document.querySelector("#symbol-now");
  symbolLine.setAttribute("src", symbolURL);
  symbolLine.setAttribute("alt", description);

  let newCity = response.data.name;
  let countryCode = response.data.sys.country;
  let cityLine = document.querySelector("#current-city");
  cityLine.innerHTML = `${newCity}, ${countryCode}`;

  let coordinates = response.data.coord;
  getForecast(coordinates);

  let searchInput = document.querySelector("#city-search-bar");
  searchInput.value = null;
}

function searchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-search-bar");
  let newCity = searchInput.value;
  let apiKey = "aeba3e6df17f742792c4f3a90b3720ad";
  let unit = decideUnit();

  let urlWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}&units=${unit}`;
  axios.get(urlWeatherAPI).then(displayTemperature);
}

function retrieveLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "aeba3e6df17f742792c4f3a90b3720ad";
  let unit = decideUnit();

  let urlWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(urlWeatherAPI).then(displayTemperature);
}

function useLocation(event) {
  navigator.geolocation.getCurrentPosition(retrieveLocation);
}

function defaultScreen() {
  let apiKey = "aeba3e6df17f742792c4f3a90b3720ad";
  let city = "Vancouver";
  let unit = "metric";

  let urlWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(urlWeatherAPI).then(displayTemperature);
  let unitNowLine = document.querySelector("#unit-now");
  unitNowLine.innerHTML = "℃";
  getDate();
}

let celsiusTemp = null;
let celsiusTempMax = null;
let celsiusTempMin = null;

let fahrenheitTemp = null;
let fahrenheitTempMax = null;
let fahrenheitTempMin = null;

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", useLocation);

let citySearchForm = document.querySelector("#city-search-form");
citySearchForm.addEventListener("submit", searchCity);

let fahrenheitButton = document.querySelector("#fahrenheit-button");
let celsiusButton = document.querySelector("#celsius-button");
fahrenheitButton.addEventListener("click", changeToFahrenheit);
celsiusButton.addEventListener("click", changeToCelsius);

defaultScreen();

//possible improvements:
// (get time from API + add time zone conversion)
// (remove unnecessary classes [HTML])
// (simplify/streamline code)
// (change background header depending on weather)
