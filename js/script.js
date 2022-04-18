//GLOBAL VARIABLES----------------------------------------------------------------------------------------------------------------------
//takes the time from moment as well as formatting it into Weekday, Month Day format
//remember local storage should have 9 variables- 8 to store past searches, 1 to to store the current position; 
//reset to 1 to overwrite when reaches 9

//call geocoding to find lats and long to then use in one call
//note: this calls multiple locations with the same name, just use the first one

//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
//when clearing just set innerhtml to ""

const key = config.API_TOKEN;
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
function topHalf(cityName, currentWeather) { //need to add date (dt, utc) and icon
    let x = document.querySelector("#info-panel");
    /*console.log("here " + currentWeather);
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
*/
    let temp = currentWeather.current.temp;
    let wind = currentWeather.current.wind_speed;
    let humidity = currentWeather.current.humidity;
    let uvi = currentWeather.current.uvi;
    //let x = document.querySelector("#info-panel");
    //let weatherArray = [currentWeather.current.temp, currentWeather.current.wind_speed, currentWeather.current.humidity, currentWeather.current.uvi];

    addGenericCard("#info-panel", temp, wind, humidity, uvi);
    

    let dividerRow = document.createElement("div");
    dividerRow.id = "divider";
    x.appendChild(dividerRow);
    document.querySelector("#divider").innerHTML = "<h4 class='card-title'>5-Day Forecast: </h4>";

    let cardRow = document.createElement("div");
    cardRow.className = "row";
    cardRow.id = "cardRow";
    x.appendChild(cardRow);


}

/*"Temp: "[Degrees Fahrenheit]
            "Wind: "[Speed MPH]
            "Humdity: "[Percentage]
            "UV Index: "[Number colorcoded background]*/
function getCityWeather(lat, lon) { //exlude all except current and daily
    var weatherCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${key}`;
    fetch(weatherCall)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("success", data);
            
            topHalf(currentCityName, data); //actually create here because api timing issues
            //return tempArray;
        })
        .catch(function(error) {
            alert("weather1 API call failed");
        });
}

function getCityINFO(cityName) {//REMEMBER TO REPLACE API JEY
    console.log("city caled ");
    //call geo for coordinates first before calling the actual weather api
    var geoCall = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${key}`;
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
    let sideSelectE1 = document.querySelector("#side-panel");
    //create variable to hold card to insert into html
    //let insertedCard = '<div class="card-body">    <h5 class="card-title">Card title</h5>    <p class="card-text">Some quick example text to build on the card title and make up the bulk of thes content.</p>    <a href="#" class="btn btn-primary">Go somewhere</a>    </div>'
    //sideSelectE1.innerHTML = insertedCard;

   


    

    //remember to add buttons by retireiving from local storage and using for loop starting at pos[1]
    //sideSelectE1.appendChild(tempBodyE1); //attach the card to html proper

}

//intializes top half of info panel, basically the current weather display




function infoPanel() {


}


sidePanel();
//search form listener
let searchFormRetrieval = document.querySelector("#side-panel");

searchFormRetrieval.addEventListener("submit", function(event) {
    event.preventDefault();
    currentCityName = event.target[0].value;

//get array of lat,lon
    var temp = getCityINFO(currentCityName);
    console.log(temp);
    //topHalf(retrievedName, temp);
    //console.log("at thies point" + retrievedName);
});

