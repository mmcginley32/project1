
const apiKey = "b7aeb306de9a1d1d11c8363f3b0a0a25";

var citiesArray = JSON.parse(localStorage.getItem("citiesArray")) || [];
var startCity = localStorage.getItem("startCity") || "";
var endCity = localStorage.getItem("endCity") || "";

function getHoursWeather(cityName, hr, dayOfMonth, id) {
    // make the Weather API calls to get the weather

    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},us&units=imperial&APPID=${apiKey}`;
    console.log('queryURL: ', queryURL);

    // first weather query to get longitude and latitude for city
    $.get(queryURL).then(function(response){
        // console.log(response);

        // get longitude and latitude for 2nd call
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        
        // 2nd call to get 5 day forcast
        let queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;
        console.log("queryURL", queryURL)
        
        $.ajax({
            // async: false,
            url: queryURL,
            method: "GET",
        }).then(function(res) {
            console.log('res: ', res);
            
            fillInWeatherCard(res, hr, dayOfMonth, id);
        });
    });
}

function fillInWeatherCard(response, hr, dayOfMonth, id) {
    // fill in the weather cards with the weather data

    console.log('fillInWeatherCard hr: ', hr);
    let hourly = response.hourly;
    let currTime = "";
    let hour = {};

    // look for correct hourly weather data
    for (i=0; i < hourly.length; i++) {
        currTime = moment(hourly[i].dt*1000);
        // console.log('currTime: ', currTime);
        let curHr = currTime.format("HH");
        let curDay = currTime.format("D");
        // console.log('curHr: ', curHr);
        if (curHr === hr && curDay === dayOfMonth) {
            hour = hourly[i];
            break;
        }
    }
    
    console.log('currTime: ', currTime);
    // create weather icon link
    let weatherIcon = `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;
    
    // add weather data to card
    $(`#icon-${id}`).attr("src",weatherIcon);
    $(`#date-${id}`).text(currTime.format('LLL'))
    $(`#desc-${id}`).text(hour.weather[0].description);
    $(`#temp-${id}`).text(`Temperature: ${hour.temp} \xB0F`);
    $(`#hum-${id}`).text(`Humidity: ${hour.humidity}%`);
    $(`#wind-${id}`).text(`Wind Speed: ${hour.wind_speed} mph`);
};

function createWeatherCard(cityName,id) {
    // console.log('creating card for: ', cityName);
    // console.log('id: ', id);
    /* create the weather cards HTML here to be filled in later when the data
     comes in so that everything will be in the proper order. */

    // create ids for card elements
    const icon = `icon-${id}`;
    const td = `date-${id}`;
    const desc = `desc-${id}`;
    const temp = `temp-${id}`;
    const hum = `hum-${id}`;
    const wind = `wind-${id}`;

    let currWeatherDiv = $("<div>");

    // create card with city name and ids
    currWeatherDiv.html(`
        <h2 style="text-align: center;">${cityName} <img id="${icon}" height="70px"></h2>
        <p id="${td}" style="text-align: center; font-weight: bold;"></p>
        <p style="text-align: center; text-transform: capitalize; font-family: 'Georgia','Times'; color: green">
        <span id="${desc}" style="background-color: white;"></span>
        </p>
        <p id="${temp}" style="text-align: center;"></p>
        <p id="${hum}" style="text-align: center;"></p>
        <p id="${wind}"style="text-align: center;"></p>
        <hr>
        `
    );
    
    currWeatherDiv.attr("style","background-color: lightskyblue; "); //color the card light blue

    // append card to table div
    $("#table").append(currWeatherDiv); //append it in
}

function pullCity(str) {
    // pull out the city and state from the google addresses 

    let city = str.match(/[\w]+[ \w]*\, [\w]{2}[ ,]/); // look for "city, ST," or "city, ST "
    console.log('city: ', city);
    city = city[0].match(/[\w ]*\, \w{2}/)[0]; // trim off ending space or comma to just "city, ST" for weather search
    console.log('city: ', city);
    return city;
}

function resetStops() {
    // reset citiesArray variable and local storage for adding current city
    citiesArray = [];
    localStorage.removeItem("citiesArray");
    $("#table").empty(); // clear weather cards
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

$("#route").click( function(event) {
    event.preventDefault();
    event.stopPropagation();

    // set starting city
    var cityName = $("#start-city").val();
    console.log('ROUTING ****** startCity: ', startCity);

    // set ending city
    var cityName2 = $("#end-city").val();
    console.log('endCity: ', endCity);
    if (cityName !== "") {
        startCity = cityName;
        localStorage.setItem("startCity", startCity);
    } else {
        return alert("You are missing a starting city!")
    }

    if (cityName2 !== "") {
        endCity = cityName2;
        localStorage.setItem("endCity", endCity);
    } else {
        return alert("You are missing an ending city!")
    }

    //clear stops if start and end are changed
    resetStops();
    
    document.querySelector('form').reset(); //reset/clear the form for the next selected cities 

    initMap();
    
});

$("#add").click(function(event) {
    event.preventDefault();
    event.stopPropagation();

    let stop = $("#stop-city").val();
    console.log('ADDING ****** stop: ', stop);
    
    // make sure stop is not blank and save it 
    if (stop !== "") {
        citiesArray.push(stop);
    } else {
        return alert("You are missing a city to stop in!")
    }

    document.querySelector('.stops-form').reset(); //reset/clear the form for the next selected cities 

    // redraw the map with the new stop
    initMap();
});



//////////////////////// Goggle functions //////////////////////////

function initMap() {
    // starts the API process of getting the map
    // console.log('endCity: ', endCity);
    // console.log('startCity: ', startCity);
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
    
    });
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map,
    //   panel: document.getElementById("right-panel")
    });
    directionsRenderer.addListener("directions_changed", () => {
        getLegsWeather(directionsRenderer.getDirections());
    });

    if (startCity != "" && endCity !== "") {
        displayRoute(
            startCity + ", US",
            endCity + ", US",
            directionsService,
            directionsRenderer
        );
    } 
}

function displayRoute(origin, destination, service, display) {
    // create inbetween stops/waypoints for the map
    const stops = [];
    for (i = 0; i < citiesArray.length; i++) {
        let cur = {
            location: citiesArray[i] + ", US"
        }
        stops.push(cur);
    }
    console.log('stops: ', stops);

    // get the route with stops
    service.route({
        origin: origin,
        destination: destination,
        waypoints: stops,
        // [
        //     {
        //         location: "Golden, US"
        //     },
        //     {
        //         location: "Idaho Springs, US"
        //     },
        //     {
        //         location: "Denver, US"
        //     }
        // ],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true
    },
    (result, status) => {
        if (status === "OK") {
            display.setDirections(result); //show the new map
            console.log('result in displayRoute: ', result);
        } else {
            console.log("Could not display directions due to: " + status); //had a problem with a location probably
        }
    }
    );
}

function getLegsWeather(result) {
    console.log('result in getLegsWeather: ', result);
    
    // reset citiesArray for adding current cities
    resetStops();

    let startTime = moment();
    console.log('startTime: ', startTime);
    var dayOfMonth = startTime.format('D');

    const legs = result.routes[0].legs;
    console.log('legs: ', legs);
    console.log('legs[0].start_address: ', legs[0].start_address);
    
    startCity = pullCity(legs[0].start_address); // trim to just "city, ST" for weather search
    console.log('startCity: ', startCity);
    localStorage.setItem("startCity", startCity);

    // Get weather for starting city here ****
    console.log('startTime.format("D"): ', startTime.format("HH"));

    createWeatherCard(startCity, 0);
    getHoursWeather(startCity, startTime.format("HH"),dayOfMonth, 0);

    // loop through legs of the trip getting weather for the citys at the end of the legs
    for (let i = 0; i < legs.length; i++) {
        let leg = legs[i];

        //get time for leg
        let time = leg.duration.text.split(" ")
        let days = 0;
        let hrs = 0;
        let min = 0;
        console.log('time: ', time);

        // seperate time into days hours and mins for calculating time in minutes to 
        // figure out time of day the leg will be finished
        for (t = 0; t < time.length; t += 2)
        if (time[t+1].match("day")) {
            days = parseInt(time[t]); //get number of days for leg
        } else if (time[t+1].match("hour")) {
            hrs = parseInt(time[t]); //get number of hours for leg
        } else {
            min += parseInt(time[t]); //get number of minutes for leg added to the current minutes
        }

        min += 24*60*days + 60*hrs; //add days and hours to miniutes for total minutes

        // console.log('days: ', days);
        // console.log('hrs: ', hrs);
        // console.log('min: ', min);

        // add time to starting time to get time when stop will be hit
        let curTime = startTime.add(min, 'm'); //add minutes to time
        console.log('curTime: ', curTime);
        hrOfTheDay = curTime.format('HH'); // get hour
        console.log('hrOfTheDay: ', hrOfTheDay);
        dayOfMonth = curTime.format('D'); // get day of the month

        //get city name from leg
        let stopCity = pullCity(leg.end_address);

        // update variable city names and local storage here so that dragged to citys will be updated
        if (i === legs.length-1) {
            //save end city
            endCity = stopCity;
            localStorage.setItem("endCity", endCity);
        } else {
            citiesArray.push(stopCity);
            localStorage.setItem("citiesArray", JSON.stringify(citiesArray));
    
        }

        //get weather and create the card for stopCity at hrOfTheDay here ******
        createWeatherCard(stopCity, i + 1);
        getHoursWeather(stopCity, hrOfTheDay,dayOfMonth, i + 1);

        // add 1 hr to time for stop
        min += 60;
    }

     //total = total / 1000;
    // document.getElementById("total").innerHTML = total + " km";
}
