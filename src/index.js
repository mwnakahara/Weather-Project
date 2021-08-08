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
  let unitNow = unitNowLine.innerHTML;

  if (unitNow === "℃") {
    let unitNowMaxLine = document.querySelector("#unit-maxTemp-today");
    let unitNowMinLine = document.querySelector("#unit-minTemp-today");

    unitNowLine.innerHTML = "℉";
    unitNowMaxLine.innerHTML = "℉";
    unitNowMinLine.innerHTML = "℉";

    let tempNowLine = document.querySelector("#temp-now");
    let tempNowMaxLine = document.querySelector("#maxTemp-today");
    let tempNowMinLine = document.querySelector("#minTemp-today");
    console.log(tempNowMaxLine.innerHTML);

    fahrenheitTemp = Math.round(celsiusTemp * (9 / 5) + 32);
    fahrenheitTempMax = Math.round(celsiusTempMax * (9 / 5) + 32);
    fahrenheitTempMin = Math.round(celsiusTempMin * (9 / 5) + 32);

    console.log(fahrenheitTempMin);

    tempNowLine.innerHTML = fahrenheitTemp;
    tempNowMaxLine.innerHTML = fahrenheitTempMax;
    tempNowMinLine.innerHTML = fahrenheitTempMin;
  }
}
function changeToCelsius(event) {
  let unitNowLine = document.querySelector("#unit-now");
  let unitNow = unitNowLine.innerHTML;

  if (unitNow === "℉") {
    let unitNowMaxLine = document.querySelector("#unit-maxTemp-today");
    let unitNowMinLine = document.querySelector("#unit-minTemp-today");

    unitNowLine.innerHTML = "℃";
    unitNowMaxLine.innerHTML = "℃";
    unitNowMinLine.innerHTML = "℃";

    let tempNowLine = document.querySelector("#temp-now");
    let tempNowMaxLine = document.querySelector("#maxTemp-today");
    let tempNowMinLine = document.querySelector("#minTemp-today");

    tempNowLine.innerHTML = celsiusTemp;
    tempNowMaxLine.innerHTML = celsiusTempMax;
    tempNowMinLine.innerHTML = celsiusTempMin;
  }
}

function displayTemperature(response) {
  console.log(response);

  let unitNowLine = document.querySelector("#unit-now");
  if (unitNowLine.innerHTML === "℃") {
    celsiusTemp = Math.round(response.data.main.temp);
    let tempNowLine = document.querySelector("#temp-now");
    tempNowLine.innerHTML = celsiusTemp;

    celsiusTempMax = Math.round(response.data.main.temp_max);
    let nextMaxTempLine = document.querySelector("#maxTemp-today");
    nextMaxTempLine.innerHTML = celsiusTempMax;

    celsiusTempMin = Math.round(response.data.main.temp_min);
    let nextMinTempLine = document.querySelector("#minTemp-today");
    nextMinTempLine.innerHTML = celsiusTempMin;
  } else {
    fahrenheitTemp = Math.round(response.data.main.temp);
    let tempNowLine = document.querySelector("#temp-now");
    tempNowLine.innerHTML = fahrenheitTemp;

    fahrenheitTempMax = Math.round(response.data.main.temp_max);
    let nextMaxTempLine = document.querySelector("#maxTemp-today");
    nextMaxTempLine.innerHTML = fahrenheitTempMax;

    fahrenheitTempMin = Math.round(response.data.main.temp_min);
    let nextMinTempLine = document.querySelector("#minTemp-today");
    nextMinTempLine.innerHTML = fahrenheitTempMin;
  }

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
  let unit = "metric";
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

// get Time from API
// humidity & wind speed
// (simplify unit conversion)
// (remove unnecessary classes [HTML])
