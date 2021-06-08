//set global variables
var searchBtn = document.querySelector("#search-button");
var todayEl = document.getElementById("today");
var historyEl = document.getElementById("history");
var forecast = document.getElementById("forecast");

//function to set the value of the search box
function searchValue() {
    var searchValue = document.querySelector("#search-value").value;
    console.log(searchValue);

    if (searchValue == "") {
        alert("Must input a search term");
        return false;
    }

    var city = JSON.parse(localStorage.getItem("city")) || [];
    console.log("city:", city);

    console.log(`city includes searchValue: ${city.includes(searchValue)}`)

    if (!city.includes(searchValue)) {
        city.unshift(searchValue);
        localStorage.setItem("city", JSON.stringify(city));
        saveSearch();
    }

    getWeather(searchValue);
    fiveDayForecast(searchValue);
    //set the search box to "nothing" the button has been pressed
    document.querySelector("#search-value").value = "";
    
}

//function to save the search term
function saveSearch() {
    historyEl.innerHTML = "";

    //get the item city from the local storage
    var city = JSON.parse(localStorage.getItem("city")) || [];
    console.log(city)
    //for loop for creating the buttons on the left side
    for (var i = 0; i < city.length; i++) {
        //create the button element
        var previous = document.createElement("button");
        //set the attribute of the button
        previous.setAttribute("data-city", city[i]);
        //set the text content of the button
        previous.textContent = city[i];
        //event listener for the click of the functions, and getting the attributes 
        previous.addEventListener("click", function() {
            getWeather(this.getAttribute("data-city"));
            fiveDayForecast(this.getAttribute("data-city"));
        });
        //append the previous button to the history element on the page
        historyEl.appendChild(previous);
    }
}


//get the current weather for TODAY
function getWeather(searchValue) {
    todayEl.innerHTML = "";
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + apiKey + "&units=imperial";

    //create border for the today element
    todayEl.style.border = "1px solid"

    //set up validation if form is blank

    //fetch the api URL defined above
    fetch(apiURL)
        .then(function (response) {
            //return the response in json
            return response.json()
        }).then(function (data) {
            console.log(data);

            //create variable for the city name
            var cityName = data.name;
            console.log("city name");
            console.log(cityName);

            //create variable for the wind speed
            var windSpeed = data.wind.speed;

            //create variable for the temperature
            var temperature = data.main.temp;
            console.log("temperature");
            console.log(temperature);

            //create variable for the humidity
            var humidity = data.main.humidity;
            console.log("humidity");
            console.log(humidity);

            //get today's date in moment
            var dateEl = moment().format("MM/DD/YYYY");

            //create the element for the icon from the URL, and set the attribute
            var iconUrl = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
            var iconItem = document.createElement("img")
            iconItem.setAttribute("src", iconUrl);

            //create the element for the city name and append it to the page
            var cityNameEl = document.createElement("h1");
            $(cityNameEl).text(cityName + " " + dateEl);
            todayEl.append(cityNameEl);

            //append the icon to the page
            todayEl.append(iconItem);
            
            //create element for the temperature and append it to the page
            var temperatureEl = document.createElement("p");
            $(temperatureEl).text("Temp: " + temperature + "°F")
            todayEl.append(temperatureEl);

            //create the wind element and append it to the page
            var windEl = document.createElement("p");
            $(windEl).text("Wind: " + windSpeed + " MPH");
            todayEl.append(windEl);

            //create the element for humidity and append it to the page
            var humidityEl = document.createElement("p");
            $(humidityEl).text("Humidity: " + humidity + " %");
            todayEl.append(humidityEl);

            // create variable for the longitude
            var longitude = data.coord.lon;
            console.log(longitude);

            //create variable for the latitude
            var latitude = data.coord.lat;
            console.log(latitude);

            //call the uvIndex function
            uvIndex(latitude, longitude);

            

            
        })




}


//create the variable for the uvIndex function
function uvIndex(latitude, longitude) {
    var uvURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;
    //fetch the UV Index URL whose variable is created above
    fetch(uvURL)
        .then(function (response) {
            //return the repsonse as json
            return response.json()
        }).then(function (data) {
            console.log(data);
            
            // get the uvi variable using .notation
            var uviValue = data.current.uvi;
            console.log(uviValue);
            
            //create element for uvIndex and append it to the page
            var uviEl = document.createElement("p");
            uviEl.textContent ="UV Index: " + uviValue;
            todayEl.append(uviEl);

            if (uviValue <= 2) {
                uviEl.setAttribute("class", "favorable")
            } else if (uviValue > 2 && uviValue < 6) {
                uviEl.setAttribute("class", "moderate")
            } else {
                uviEl.setAttribute("class", "severe")
            }
            
        })
}




//function for the five day forecast
function fiveDayForecast(searchValue) {
    console.log("hello it's me")
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=" + apiKey + "&units=imperial";
    //fetch the URL for the five day forecast whose variable is created above
    fetch(fiveDayURL)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            console.log(data);

            

            forecast.innerHTML = "";

        var day = 1
        for (var i = 0; i < data.list.length; i++) {
            if (data.list[i].dt_txt.indexOf('15:00:00') !== -1){
                
                console.log(day);

                var todayDate = moment().add(day, 'days').format("MM/DD/YYYY");
                var dateFive = todayDate;
                var iconUrl = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";
                var temperatureFive = "Temp: " + data.list[i].main.temp + "°F";
                var windFive = "Wind: " + data.list[i].wind.speed + "MPH";
                var humidityFive = "Humidity: " + data.list[6].main.humidity + "%";

                //create an element for the card, and give it a class of card
                var cardEl = document.createElement("div");
                cardEl.classList.add("card")

                //create the element for the date, give it the text content, and append it to the card element
                var dateFiveEl = document.createElement("h5");
                dateFiveEl.textContent = dateFive;
                cardEl.append(dateFiveEl);

                //create the element for the icon, set the attribute , and append it to the card element
                var iconFiveEl = document.createElement("img");
                iconFiveEl.setAttribute("src", iconUrl);
                cardEl.append(iconFiveEl);

                //create the element for the temperature, and append it to the card element
                var tempFiveEl = document.createElement("p");
                tempFiveEl.textContent = temperatureFive;
                cardEl.append(tempFiveEl);

                //create the element for the wind, set the text content, and append it to the card element
                var windFiveEl = document.createElement("p");
                windFiveEl.textContent = windFive;
                cardEl.append(windFiveEl);

                //create the element for the humidity, and append it to the card element
                var humidityFiveEl = document.createElement("p");
                humidityFiveEl.textContent = humidityFive;                
                cardEl.append(humidityFiveEl);

                //append the card element to the page
                forecast.append(cardEl);

                //increment the moment day
                day++;
            }
        }

        })

}

//add the event listener for the search button
searchBtn.addEventListener("click", searchValue);


//call the save search function
saveSearch();
