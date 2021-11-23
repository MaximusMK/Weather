/*https://www.youtube.com/watch?v=n4dtwWgRueI*/

// API
// https://home.openweathermap.org/
// mail: intmaxmk@gamil.com
// password: usual

const api = {
    key: "7ee91a6297b55524ffd8fc1978842f5c",
    base: "https://api.openweathermap.org/data/2.5/"
}

const searchCity = document.querySelector('.search-city');

function setDefaultCity() {
    if (localStorage.city) {
        searchCity.value = localStorage.city; 
        getResults(searchCity.value);
    } else {
        searchCity.value = "";
    }
}

setDefaultCity();

searchCity.addEventListener('keypress', setQuery);

function setQuery(event) {
    if (event.keyCode == 13) {
        getResults(searchCity.value); 
        }
    }

function getResults(query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(weather => {
            return weather.json();
        }).then(displayResults)
}

function displayResults(weather) {
    console.log(weather);

    let city = document.querySelector('.city'),
        date = document.querySelector('.date'),

        temp = document.querySelector('.temp'),
        tempFills = document.querySelector('.temp-fills'),
        tempMin = document.querySelector('.temp-min'),
        tempMax = document.querySelector('.temp-max'),

        sunRise = document.querySelector('.sunrise'),
        sunSet = document.querySelector('.sunset'),
        dayLength = document.querySelector('.day-length'),

        // wind

        cloudy = document.querySelector('.cloudy'),
        humidity = document.querySelector('.humidity'),
        pressure = document.querySelector('.pressure');

    let timezone = weather.timezone,
        sunrise = weather.sys.sunrise,
        sunset = weather.sys.sunset;
        mainTemp = weather.main.temp;
        presPascal = weather.main.pressure;
    
    city.innerHTML = `${weather.name}, ${weather.sys.country}`;
    date.innerHTML = dateBuilder(new Date());

    temp.innerHTML = `${Math.round(mainTemp)}°C`;
    tempFills.innerHTML = `Fills like ${Math.round(weather.main.feels_like)}°C`;
    tempMin.innerHTML = `Min ${Math.round(weather.main.temp_min).toFixed(1)}°C`;
    tempMax.innerHTML = `Max ${(weather.main.temp_max).toFixed(1)}°C`;

    sunRise.innerHTML = `Sunrise ${sun(sunrise, timezone)}`;
    sunSet.innerHTML = `Sunset ${sun(sunset, timezone)}`;
    dayLength.innerHTML = `Day length ${dayLengthCalc(sunset, sunrise)}`;

    // wind

    cloudy.innerText = weather.weather[0].main;
    humidity.innerHTML = `Humidity ${weather.main.humidity}%`;
    pressure.innerHTML = `Pressure mm Hg ${getPressure(presPascal)}`;

    addCityToLocalStorage(weather.cod, weather.name);

    let mapCity = document.querySelector('.city-map');
    // mapCity.style.backgroundColor = setColor((27));

    temp.style.color = setColor((mainTemp));
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

let msToReadableTime = function (time){
    const s = 1000;
    const m = s * 60;
    const h = m * 60;
  
    let hours = Math.floor(time / h % 24);
    let minutes = Math.floor(time / m % 60);
    let seconds = Math.floor(time / s % 60);

    hours = (hours < 10) ? "0"+ hours : hours;
    minutes = (minutes < 10) ? "0"+ minutes : minutes;
    seconds = (seconds < 10) ? "0"+ seconds : seconds;
     
    return `${hours}:${minutes}:${seconds}`;
  }

let dateBuilder = function (currentDate) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

    let day = days[currentDate.getDay()];
    let date = currentDate.getDate();
    let month = months[currentDate.getMonth()];
    let year = currentDate.getFullYear();
    return `${day}, ${date} ${month} ${year}`;
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
        // console.log(`color ${color}`);
 
    return `hsl(${color}, 50%, 50%)`;
}

let getPressure = function(pressure) {
    const coeff = 0.75;
    let presMmMercury = Math.floor(pressure * coeff);
    // console.log(presMmMercury);
    return presMmMercury;    
}