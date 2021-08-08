function makeBinary(value) {
  if (value < 10) {
    let binaryValue = `0${value}`;
    return binaryValue;
  } else {
    let binaryValue = `${value}`;
    return binaryValue;
  }
}

function getDate() {
  let today = new Date();
  let minutesToday = today.getMinutes();
  let hoursToday = today.getHours();

  let dateToday = today.getDate();
  let monthToday = today.getMonth() + 1;
  let yearToday = today.getFullYear();

  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dayToday = weekdays[today.getDay()];

  let minutesBinary = makeBinary(minutesToday);
  let currentTime = `${hoursToday}:${minutesBinary}`;

  let monthBinary = makeBinary(monthToday);
  let dateBinary = makeBinary(dateToday);
  let currentDate = `${dayToday} ${yearToday}/${monthBinary}/${dateBinary}`;

  let dateLine = document.querySelector("#current-date");
  dateLine.innerHTML = `${currentDate} <small>${currentTime}</small>`;
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
}

function displayTemperature(response) {
  console.log(response);
  let newTemp = Math.round(response.data.main.temp);
  let newTempMax = Math.round(response.data.main.temp_max);
  let newTempMin = Math.round(response.data.main.temp_min);

  let unitNowLine = document.querySelector("#unit-now");
  if (unitNowLine.innerHTML === "℃") {
    celsiusTemp = newTemp;
    celsiusTempMax = newTempMax;
    celsiusTempMin = newTempMin;

    let tempNowLine = document.querySelector("#temp-now");
    let nextMaxTempLine = document.querySelector("#maxTemp-today");
    let nextMinTempLine = document.querySelector("#minTemp-today");

    tempNowLine.innerHTML = celsiusTemp;
    nextMaxTempLine.innerHTML = celsiusTempMax;
    nextMinTempLine.innerHTML = celsiusTempMin;
  } else {
    fahrenheitTemp = newTemp;
    fahrenheitTempMax = newTempMax;
    fahrenheitTempMin = newTempMin;

    let tempNowLine = document.querySelector("#temp-now");
    let nextMaxTempLine = document.querySelector("#maxTemp-today");
    let nextMinTempLine = document.querySelector("#minTemp-today");

    tempNowLine.innerHTML = fahrenheitTemp;
    nextMaxTempLine.innerHTML = fahrenheitTempMax;
    nextMinTempLine.innerHTML = fahrenheitTempMin;
  }

  let description = response.data.weather[0].main;
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
  let cityLine = document.querySelector("#current-city");
  cityLine.innerHTML = newCity;

  let searchInput = document.querySelector("#city-search-bar");
  searchInput.value = null;
}

function searchCity(event) {
  event.preventDefault();
  getDate();
  let searchInput = document.querySelector("#city-search-bar");
  let newCity = searchInput.value;
  let apiKey = "aeba3e6df17f742792c4f3a90b3720ad";
  let unitNowLine = document.querySelector("#unit-now");
  let unit = "metric";
  if (unitNowLine.innerHTML === "℃") {
    unit = "metric";
  } else {
    unit = "imperial";
  }
  let urlWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}&units=${unit}`;
  axios.get(urlWeatherAPI).then(displayTemperature);
}

function retrieveLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "aeba3e6df17f742792c4f3a90b3720ad";
  let unitNowLine = document.querySelector("#unit-now");
  let unit = null;

  if (unitNowLine.innerHTML === "℃") {
    unit = "metric";
  } else {
    unit = "imperial";
  }
  let urlWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(urlWeatherAPI).then(displayTemperature);
}

function useLocation(event) {
  navigator.geolocation.getCurrentPosition(retrieveLocation);
}

function defaultScreen() {
  let apiKey = "aeba3e6df17f742792c4f3a90b3720ad";
  let city = "Vancouver";
  let urlWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
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

// (get Time from API)
// (remove unnecessary classes [HTML])
