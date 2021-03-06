/*https://www.youtube.com/watch?v=n4dtwWgRueI*/

// API
// https://home.openweathermap.org/
// mail: intmaxmk@gamil.com
// password: usual

const API = {
    KEY: "7ee91a6297b55524ffd8fc1978842f5c",
    BASE: "https://api.openweathermap.org/data/2.5/",
}

const searchCity = document.querySelector('.search-city');

let setDefaultCity = function() {
    if (localStorage.city) {
        searchCity.value = localStorage.city; 
        getResults(searchCity.value);
    } else {
        searchCity.value = "";
    }
}

setDefaultCity();

// THEME

const btnMode = document.querySelector('.btn-mode'),
      mode = document.querySelector('body'),
      currentMode = localStorage.getItem('mode');

let setMode = function(modeName) {
    mode.setAttribute('data-mode', modeName);
    localStorage.setItem('mode', modeName);
}

if (currentMode) {
    mode.setAttribute('data-mode', currentMode) 
} else {
    setMode('light');
}

btnMode.addEventListener('click', () => {
    console.log("btnMode clicked");
    if (mode.getAttribute('data-mode') == "light") {
        setMode('dark');
    } else {
        setMode('light');
    }
})

//////////////////////////////

searchCity.addEventListener('keypress', setQuery);

function setQuery(event) {
    if (event.keyCode == 13) {
        getResults(searchCity.value); 
        }
    }

function getResults(query) {
    fetch(`${API.BASE}weather?q=${query}&units=metric&APPID=${API.KEY}`)
        .then(weather => {
            return weather.json();
        }).then(displayResults)
}
// Map

function getWeatherMap() {
    fetch(`http://maps.openweathermap.org/maps/2.0/weather/${op}/${z}/${x}/${y}?appid=${API.KEY}`)
        .then(weather => {
            return weather.json();
        }).then(showMap())
}
let showMap = function() {
    
}

let mapCity = document.querySelector('.city-map');
mapCity.innerHTML = `<iframe width="800" height="600" scrolling="yes"
src="https://www.openstreetmap.org/export/embed.html?bbox=10.25537109375001%2C49.62672481765917%2C38.84216308593751%2C51.18795112740308&amp;
layer=mapnik"></iframe>`

//////////////////////////////////

function displayResults(weather) {
    console.log(weather);

    let city = document.querySelector('.city'),
        date = document.querySelector('.date'),
        time = document.querySelector('.time'),

        temp = document.querySelector('.temp'),
        tempFills = document.querySelector('.temp-fills'),
        tempMin = document.querySelector('.temp-min'),
        tempMax = document.querySelector('.temp-max'),

        sunRise = document.querySelector('.sunrise'),
        sunSet = document.querySelector('.sunset'),
        dayLength = document.querySelector('.day-length'),

        windDirection = document.querySelector('.direction'),
        windSpeed = document.querySelector('.speed'),
        windGust = document.querySelector('.gust'),

        cloudy = document.querySelector('.cloudy'),
        humidity = document.querySelector('.humidity'),
        pressure = document.querySelector('.pressure');

    let timezone = weather.timezone,
        sunrise = weather.sys.sunrise,
        sunset = weather.sys.sunset,
        mainTemp = weather.main.temp,
        presPascal = weather.main.pressure;
        gust = weather.wind.gust;
    
    city.innerHTML = `${weather.name}, ${weather.sys.country}`;
    date.innerHTML = dateBuilder(timezone);
    time.innerHTML = timeBuilder(timezone);

    temp.innerHTML = `${mainTemp.toFixed(0)}??C`;
    tempFills.innerHTML = `Fills like ${(weather.main.feels_like).toFixed(0)}??C`;
    tempMin.innerHTML = `Min ${(weather.main.temp_min).toFixed(1)}??C`;
    tempMax.innerHTML = `Max ${(weather.main.temp_max).toFixed(1)}??C`;
    temp.style.color = setColor((mainTemp));

    sunRise.innerHTML = `Sunrise ${sun(sunrise, timezone)}`;
    sunSet.innerHTML = `Sunset ${sun(sunset, timezone)}`;
    dayLength.innerHTML = `Day length ${dayLengthCalc(sunset, sunrise)}`;

    windDirection.innerHTML = `Wind direction ${getWindDirection(weather.wind.deg)}`;
    windSpeed.innerHTML = `Wind speed ${Math.round(weather.wind.speed)} m/s`;
    windGust.innerHTML = `${isGustExist(gust)}`;
 
    cloudy.innerText = `Sky ${weather.weather[0].description}`;
    humidity.innerHTML = `Humidity ${weather.main.humidity}%`;
    pressure.innerHTML = `Pressure mm Hg ${getPressure(presPascal)}`;

    addCityToLocalStorage(weather.cod, weather.name);
    // addCityToList(weather.name);
    addCityToList(searchCity.value);
}

let addCityToList = function(city) {
    let cityLowerCase = city.toLowerCase();
    let citiesList = JSON.parse(localStorage.getItem('cityList')) || [];
    if (citiesList.includes(cityLowerCase)) {
        citiesList.splice(citiesList.indexOf(cityLowerCase), 1);
        citiesList.unshift(cityLowerCase);
        localStorage.setItem('cityList', JSON.stringify(citiesList.slice(0, 10)));
    } else {
        citiesList.unshift(cityLowerCase);
        localStorage.setItem('cityList', JSON.stringify(citiesList.slice(0, 10)));
    }
}

let sun = function(time, timezone) {
    let sunTimeH = new Date(time * 1000 + timezone * 1000).getUTCHours();
    let sunTimeM = new Date(time * 1000 + timezone * 1000).getUTCMinutes();
    return `${sunTimeH}:${(sunTimeM < 10 ) ? "0" + sunTimeM : sunTimeM}`;
}

let dayLengthCalc = function(sunset, sunrise) {
    let msDayLength = (sunset - sunrise) * 1000;
    let dayLength = msToReadableTime(msDayLength);
    return dayLength;
}

let msToReadableTime = function(time){
    const s = 1000;
    const m = s * 60;
    const h = m * 60;
  
    let hours = Math.floor(time / h % 24);
    let minutes = Math.floor(time / m % 60);
    let seconds = Math.floor(time / s % 60);

    // create f() and use in timeBuilder and sun
    hours = (hours < 10) ? "0"+ hours : hours;
    minutes = (minutes < 10) ? "0"+ minutes : minutes;
    seconds = (seconds < 10) ? "0"+ seconds : seconds;
     
    return `${hours}:${minutes}:${seconds}`;
}

let dateBuilder = function(timezone) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

    // function currentDate
    let localDate = new Date();
    let currentDate = new Date(localDate.getTime() + 
    new Date().getTimezoneOffset() * 60 * 1000 + timezone * 1000);

    let day = days[currentDate.getDay()];
    let date = currentDate.getDate();
    let month = months[currentDate.getMonth()];
    let year = currentDate.getFullYear();
    return `${day}, ${date} ${month} ${year}`;
}

let timeBuilder = function(timezone) {

    // function currentDate
    let localDate = new Date();
    let currentDate = new Date(localDate.getTime() + 
    new Date().getTimezoneOffset() * 60 * 1000 + timezone * 1000);

    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    return `${hours}:${minutes}`;
}

let addCityToLocalStorage = function(cod, name) {
    if (cod == 200) {
        localStorage.setItem('city', name);
    } else {
        alert("City not found");
    }
}

let setColor = function(temp) {
    let coefficient = 4.5;  //2.5
    let color;
    if (temp == 0) {
        color = 125;
    } else         
        color = 250 - Math.floor(125 + temp * coefficient);
    return `hsl(${color}, 50%, 50%)`;
}

let getPressure = function(pressure) {
    const coeff = 0.75;
    let presMmMercury = Math.floor(pressure * coeff);
    return presMmMercury;    
}

let getWindDirection = function(deg) {
    let direction;
    switch (true) {
        case (deg > 22.5 && deg <= 67.5): 
            return direction = "NE"
        case (deg > 67.5 && deg <= 112.5): 
            return direction = "E"
        case (deg > 112.5 && deg <= 157.5): 
            return direction = "SE"
        case (deg > 157.5 && deg <= 202.5): 
            return direction = "S"
        case (deg > 202.5 && deg <= 247.5): 
            return direction = "SW"
        case (deg > 247.5 && deg <= 292.5): 
            return direction = "W"
        case (deg > 292.5 && deg <= 337.5): 
            return direction = "NW"
        case (deg > 337.5 && deg <= 22.5):
            return direction = "N";
    }
    // console.log(direction);
}

let isGustExist = function(gust) {
    if (gust) {
        return `Wind gust ${Math.round(gust)} m/s`;
    } else {
        return `No gusts of wind`
    }
}