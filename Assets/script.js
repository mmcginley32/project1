
const apiKey = "b7aeb306de9a1d1d11c8363f3b0a0a25";

var citiesArray = JSON.parse(localStorage.getItem("citiesArray")) || [];
var startCity = localStorage.getItem("startCity") || "";
var endCity = localStorage.getItem("endCity") || "";

function getHoursWeather(cityName, hr, dayOfMonth, id) {
    console.log('hr: ', hr);
    console.log('cityName: ', cityName);
    // let name = cityName.replaceAll(" ", "").toLowerCase(); // remove spaces from name
    // let name = cityName.toLowerCase(); // remove spaces from name

    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},us&units=imperial&APPID=${apiKey}`;
    console.log('queryURL: ', queryURL);

    $.get(queryURL).then(function (response) {
        console.log(response);

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
        }).then(function (res) {
            console.log('res: ', res);

            fillInWeatherCard(res, cityName, hr, dayOfMonth, id);
        });
    });
}

function fillInWeatherCard(response, cityName, hr, dayOfMonth, id) {
    // fill in the weather cards with the weather data

    console.log('createWeatherCard hr: ', hr);
    let hourly = response.hourly;
    let currTime = "";
    let hour = {};
    for (i = 0; i < hourly.length; i++) {
        currTime = moment(hourly[i].dt * 1000);
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
    let weatherIcon = `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;

    // add data to weather card
    $(`#icon-${id}`).attr("src", weatherIcon);
    $(`#date-${id}`).text(currTime.format('LLL'))
    $(`#desc-${id}`).text(hour.weather[0].description);
    $(`#temp-${id}`).text(`Temperature: ${hour.temp} \xB0F`);
    $(`#hum-${id}`).text(`Humidity: ${hour.humidity}%`);
    $(`#wind-${id}`).text(`Wind Speed: ${hour.wind_speed} mph`);

    // currWeatherDiv.html(`
    //     <h2 style="text-align: center;">${cityName} <img src=${weatherIcon} height="70px"></h2>
    //     <p style="text-align: center; font-weight: bold;">${currTime.format('LLL')}</p>
    //     <p style="text-align: center; text-transform: capitalize; font-family: 'Georgia','Times'; color: green">
    //     <span style="background-color: white;">  ${hour.weather[0].description}  </span>
    //     </p>
    //     <p style="text-align: center;">Temperature: ${hour.temp} &#176;F</p>
    //     <p style="text-align: center;">Humidity: ${hour.humidity}%</p>
    //     <p style="text-align: center;">Wind Speed: ${hour.wind_speed} mph</p>
    //     <hr>
    //     `
    // );

    // currWeatherDiv.attr("style","background-color: lightskyblue")

    // $("#table").append(currWeatherDiv);
    // // weatherCards[cityName] = currWeatherDiv;
};

function createWeatherCard(cityName, id) {
    console.log('creating card for: ', cityName);
    console.log('id: ', id);
    /* create the weather cards HTML here to be filled in later when the data
     comes in so that everything will be in the proper order. */

    // id vars
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

    currWeatherDiv.attr("style", "background-color: lightskyblue; margin: 15px; border-radius: 12px 12px 12px 12px;"); //color the card light blue

    $("#table").append(currWeatherDiv); //append it in
}

function pullCity(str) {
    let city = str.match(/[\w]+[ \w]*\, [\w]{2}[ ,]/); // look for "city, ST," or "city, ST "
    console.log('city: ', city);
    city = city[0].match(/[\w ]*\, \w{2}/)[0]; // trim to just "city, ST" for weather search
    console.log('city: ', city);
    return city;
}

function resetStops() {
    // reset citiesArray for adding current city
    citiesArray = [];
    localStorage.removeItem("citiesArray");
    $("#table").empty();
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

$("#route").click(function (event) {
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

$("#add").click(function (event) {
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
    console.log('endCity: ', endCity);
    console.log('startCity: ', startCity);
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
    // create stops for the map
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
    getHoursWeather(startCity, startTime.format("HH"), dayOfMonth, 0);
    // await sleep(5000);

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
        if (time.length > 4) {
            days = parseInt(time[0]);
            hrs = parseInt(time[2]);
            min += 24 * 60 * days + 60 * hrs + parseInt(time[4]);
        } else if (time.length === 4) {
            hrs = parseInt(time[0]);
            min += 60 * hrs + parseInt(time[2]);
        } else {
            min += parseInt(time[0]);
        }

        console.log('days: ', days);
        console.log('hrs: ', hrs);
        console.log('min: ', min);

        // add time to starting time to get time when stop will be hit
        let curTime = startTime.add(min, 'm');
        console.log('curTime: ', curTime);
        hrOfTheDay = curTime.format('HH');
        console.log('hrOfTheDay: ', hrOfTheDay);
        dayOfMonth = curTime.format('D');

        //get city name from leg
        let stopCity = pullCity(leg.end_address);

        // might want to revise local storage here instead of after it's entered so that dragged to citys will be updated
        if (i === legs.length - 1) {
            //save end city
            endCity = stopCity;
            localStorage.setItem("endCity", endCity);
        } else {
            citiesArray.push(stopCity);
            localStorage.setItem("citiesArray", JSON.stringify(citiesArray));

        }

        //get weather and create the card for stopCity at hrOfTheDay here ******
        createWeatherCard(stopCity, i + 1);
        getHoursWeather(stopCity, hrOfTheDay, dayOfMonth, i + 1);
        // await sleep(1000);

        // add 1 hr to time for stop
        min += 60;
    }

    // append weather cards in order
    // append start city
    // while (weatherCards[startCity] === undefined) {await sleep(100);}
    // $("#table").append(weatherCards[startCity]);
    // console.log('weatherCards[' + startCity + ']: ', weatherCards[startCity]);

    // // append stops
    // for (i=0; i<citiesArray.length; i++) {
    //     while (weatherCards[citiesArray[i]] === undefined) {await sleep(100);}
    //     $("#table").append(weatherCards[citiesArray[i]]);
    //     console.log('weatherCards[' + citiesArray[i] + ']: ', weatherCards[citiesArray[i]]);
    // }

    // // append end city
    // while (weatherCards[endCity] === undefined) {await sleep(100);}
    // $("#table").append(weatherCards[endCity]);
    // console.log('weatherCards[' + endCity + ']: ', weatherCards[endCity]);

    //total = total / 1000;
    // document.getElementById("total").innerHTML = total + " km";
}
