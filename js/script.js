//GLOBAL VARIABLES----------------------------------------------------------------------------------------------------------------------
//call geocoding to find lats and long to then use in one call
//note: this calls multiple locations with the same name, just limit to witht he limit query the first one

//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
//when clearing just set innerhtml to ""

const key_API = config.API_TOKEN;
var currentCityName = "";





//FUNCTIONS-------------------------------------------------------------------------------------------------------------------------------------
function addGenericCard(parent, temp, wind, humidity, uv) {
    let parentElement = document.querySelector(parent);
    parentElement.innerHTML = 
    `<div class="card">
        <div class="card-body">
            <h2 class="card-title">${cityName}</h2>
            <p class="card-text">Temp: ${temp} Fahrenheit</p>
            <p class="card-text">Wind: ${wind} MPH</p>
            <p class="card-text">Humidity: ${humidity} Fahrenheit</p>
            <p class="card-text">UV Index: ${uv}</p>
        </div>
    </div>`;
}
function infoPanel(cityName, currentWeather) { //need to add date (dt, utc) and icon
    let x = document.querySelector("#info-panel");
    console.log("here " + currentWeather);
    x.innerHTML = 
    `<div class="card">
        <div class="card-body">
            <h2 class="card-title">${cityName}</h2>
            <p class="card-text">Temp: ${currentWeather.current.temp} Fahrenheit</p>
            <p class="card-text">Wind: ${currentWeather.current.wind_speed} MPH</p>
            <p class="card-text">Humidity: ${currentWeather.current.humidity} Fahrenheit</p>
            <p class="card-text">UV Index: ${currentWeather.current.uvi}</p>
        </div>
    </div>`;
    let temp = currentWeather.current.temp;
    let wind = currentWeather.current.wind_speed;
    let humidity = currentWeather.current.humidity;
    let uvi = currentWeather.current.uvi;
    //let x = document.querySelector("#info-panel");
    //let weatherArray = [currentWeather.current.temp, currentWeather.current.wind_speed, currentWeather.current.humidity, currentWeather.current.uvi];

    //Would a create a function to handle card creation, but that's not working

    

    let dividerRow = document.createElement("div");
    dividerRow.id = "divider";
    x.appendChild(dividerRow);
    document.querySelector("#divider").innerHTML = "<h4 class='card-title'>5-Day Forecast: </h4>";

    let cardRow = document.createElement("div");
    cardRow.className = "row";
    cardRow.id = "card-row";
    x.appendChild(cardRow);

    let parentCard = document.querySelector("#card-row");


//create the 5 cards, note that temp actually is sectioned into different times of the day, so just take the max
//create an card element, before editing it's html before appending it to the actual parent row
    for(let i = 0; i < 5; i++) {
        var tempCard = document.createElement("div");
        tempCard.className = "card";
        tempCard.innerHTML = 
        `<div class="card-body">
            <h3 class="card-title">DATE</h3>
            <p class="card-text">Temp: ${currentWeather.daily[i].temp.max} Fahrenheit</p> 
            <p class="card-text">Wind: ${currentWeather.daily[i].wind_speed} MPH</p>
            <p class="card-text">Humidity: ${currentWeather.daily[i].humidity} Fahrenheit</p>
        </div>`;
        parentCard.appendChild(tempCard);
    }

}

/*"Temp: "[Degrees Fahrenheit]
            "Wind: "[Speed MPH]
            "Humdity: "[Percentage]
            "UV Index: "[Number colorcoded background]*/
function getCityWeather(lat, lon) { //exlude all except current and daily
    var weatherCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${key_API}`;
    fetch(weatherCall)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("success", data);
            
            infoPanel(currentCityName, data); //actually create here because api timing issues
            //return tempArray;
        })
        .catch(function(error) {
            alert("weather1 API call failed");
        });
}

function getCityINFO(cityName) {//REMEMBER TO REPLACE API JEY
    console.log("city called ");
    //call geo for coordinates first before calling the actual weather api
    var geoCall = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${key_API}`;
    fetch(geoCall)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data, "retrieved");
            getCityWeather(data[0].lat, data[0].lon); //start infopanel creation here
            
            //topHalf(cityName, temp);
        })
        .catch(function(error) {
            alert("geo API call failed");
        });
}


function sidePanel() {//create the side panel using the card class in bootstrap
    let buttonListE1 = document.querySelector("#btn-list");
    buttonListE1.innerHTML = "";
    //now iterate through local storage and create buttons for each
    for(let i = 0; i < localStorage.length; i++) {
        let keyText = localStorage.key(i);
        console.log("keys! " + keyText);
        let tempButton = document.createElement("button");
        tempButton.setAttribute(keyText, keyText);
        tempButton.className = "btn btn-secondary";
        tempButton.textContent = keyText;
        buttonListE1.appendChild(tempButton);
    }
    



}

//intializes top half of info panel, basically the current weather display






sidePanel();
//search form listener
let searchFormRetrieval = document.querySelector("#side-panel");

searchFormRetrieval.addEventListener("submit", function(event) {
    console.log("triggered");
    event.preventDefault();
    currentCityName = event.target[0].value;
    getCityINFO(currentCityName);
    localStorage.setItem(currentCityName, currentCityName);
    sidePanel();
});

//history button listeners
/*searchFormRetrieval.addEventListener("click", function(event) {
    event.preventDefault();
    
    localStorage.setItem(currentCityName, currentCityName)
});*/