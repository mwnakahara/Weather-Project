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
    let tempNowLine = document.querySelector("#temp-now");
    let tempNow = tempNowLine.innerHTML;
    let tempNowFahrenheit = Math.round(tempNow * (9 / 5) + 32);
    tempNowLine.innerHTML = tempNowFahrenheit;
    unitNowLine.innerHTML = "℉";
  }
}
function changeToCelsius(event) {
  let unitNowLine = document.querySelector("#unit-now");
  let unitNow = unitNowLine.innerHTML;
  if (unitNow === "℉") {
    let tempNowLine = document.querySelector("#temp-now");
    let tempNow = tempNowLine.innerHTML;
    let tempNowCelsius = Math.round((tempNow - 32) * (5 / 9));
    tempNowLine.innerHTML = tempNowCelsius;
    unitNowLine.innerHTML = "℃";
  }
}

function displayTemperature(response) {
  let newTemp = Math.round(response.data.main.temp);
  let tempNowLine = document.querySelector("#temp-now");
  tempNowLine.innerHTML = newTemp;

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

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", useLocation);

let citySearchForm = document.querySelector("#city-search-form");
citySearchForm.addEventListener("submit", searchCity);

let fahrenheitButton = document.querySelector("#fahrenheit-button");
let celsiusButton = document.querySelector("#celsius-button");
fahrenheitButton.addEventListener("click", changeToFahrenheit);
celsiusButton.addEventListener("click", changeToCelsius);

function defaultScreen() {
  let apiKey = "aeba3e6df17f742792c4f3a90b3720ad";
  let city = "Vancouver";
  let urlWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(urlWeatherAPI).then(displayTemperature);
  let unitNowLine = document.querySelector("#unit-now");
  unitNowLine.innerHTML = "℃";
  getDate();
}

defaultScreen();
