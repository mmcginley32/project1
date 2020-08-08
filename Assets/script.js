////////////////GLOBAL VARIABLES////////////////////

const apiKey = "b7aeb306de9a1d1d11c8363f3b0a0a25";
var currWeatherDiv = $("#table");
// var forecastDiv = $("#");
var citiesArray = JSON.parse(localStorage.getItem("citiesArray")) || [];
var startCity = localStorage.getItem("startCity") || "";
var endCity = localStorage.getItem("endCity") || "";

var cityName = $('#start-city').val();
var cityName2 = $('#end-city').val(); 
var cityName3 = $('#stop-city').val(); 
//////////////NEED TO CREATE VARAIBLE TO CONVERT TEMP/////////////////////////////// 


//////////////////CURRENT WEATHER FUNCTION FOR API CALL --START CITY ////////////////

function startCurrentWeather(api) {
  let queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey; 
  $.ajax ({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  $("#start-city").text(JSON.stringify(response)); 
  console.log('response:', response);

//////////////BRING IN API DATA AND APPEND TO HTML/////////////////////////

  var name = $('<p>').addClass('7').text(response.name); 
  console.log(name);  

  var temp = $('<p>').addClass('9').text(response.main.temp); 
  console.log(temp);  

  $('.7').append(name);
  $('.9').append(temp);

  }).catch(function(error){
  console.log(error)
  })
  };

//////////////////CURRENT WEATHER FUNCTION FOR API CALL--END CITY ////////////////

function endCurrentWeather(api) {
    let queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName2 + '&appid=' + apiKey; 
    // let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;
    $.ajax ({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    $("#end-city").text(JSON.stringify(response)); 
    console.log('response:', response);

//////////////BRING IN API DATA AND APPEND TO HTML/////////////////////////
  var name = $('<p>').addClass('4').text(response.name); 
  console.log(name);  

  var temp = $('<p>').addClass('6').text(response.main.temp); 
  console.log(temp);  

  $('.4').append(name);
  $('.6').append(temp);

  }).catch(function(error){
  console.log(error)
  })
  };

//////////////////CURRENT WEATHER FUNCTION FOR API CALL--END CITY ////////////////

function stopCurrentWeather(api) {
  let queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName3 + '&appid=' + apiKey; 
  // let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;
  $.ajax ({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  $("#stop-city").text(JSON.stringify(response)); 
  console.log('response:', response);

//////////////BRING IN API DATA AND APPEND TO HTML/////////////////////////

  var name = $('<p>').addClass('1').text(response.name); 
  console.log(name);  

  var temp = $('<p>').addClass('3').text(response.main.temp); 
  console.log(temp);  

  $('.1').append(name);
  $('.3').append(temp);

  }).catch(function(error){
  console.log(error)
  })
  };


//////////////////UV CALL FOR ONE LOCATION: FUNCTION FOR API /////////////////////

function returnCurrentWeather(coordinates) {
  let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;

 $.get(queryURL).then(function(response){
     let currTime = new Date(response.dt*1000);
     let weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;

     currWeatherDiv.html(`
     <h2>${response.name}, ${response.sys.country} (${currTime.getMonth()+1}/${currTime.getDate()}/${currTime.getFullYear()})<img src=${weatherIcon} height="70px"></h2>
     <p>Temperature: ${response.main.temp} &#176;C</p>
     `)
     createHistoryButton(response.name);
     console.log(response); // console logging 
 })
};
 citiesArray = JSON.parse(localStorage.getItem("localWeatherSearches")) || [];

/////////////////////CLICK EVENTS FOR WEATHER//////////////////////////////

//  EVENT FOR ROUTE BUTTON //
$(".btn-primary").click(function() {
  event.preventDefault();

  //creating variables to pull in start/end city input ///////////////////ADD IF/ELSE FOR EMPTY VALUES///////////////////
  cityName = $("#start-city").val();
  cityName2 = $("#end-city").val();
  startCurrentWeather(cityName, cityName2);
  endCurrentWeather(cityName3);
  // citiesArray.push(cityName, cityName2); 
  console.log("Start City:", cityName, "End City:" , cityName2);
});

// EVENT FOR STOP BUTTON //
$(".btn-secondary").click(function() {
  event.preventDefault();

  cityName3 = $("#stop-city").val();
  // use another api to get lat and lon based on city user typed
  // let test = {lat: "34", lon: "-118"} //dummy variable
  // returnCurrentWeather(test);
   stopCurrentWeather(cityName3);
  //  citiesArray.push(cityName3);
  //  console.log("Array:", citiesArray);
   console.log("Stop-in City:", cityName3); 
  //  console.log("lat & lon:", test);
});


////////////// FUNCTION FOR WEATHER CARD //////////////////////////

function createWeatherCard(cityIndex, time) {
    var city = citiesArray[cityIndex];
    returnCurrentWeather(city);
    var card = document.createElement("<div>").setAttribute("card");
    div.textContent = city;
    tbody.appendChild(card);
};



/////////////////////CLICK EVENT FOR GOOGLE MAPS//////////////////////////

$("#route").click(function(event) {
    event.preventDefault();

    // set starting city
    var cityName = $("#start-city").val();
    console.log('startCity: ', startCity);

    // set ending city
    var cityName2 = $("#end-city").val();
    console.log('endCity: ', endCity);
    if (cityName !== "") {
        startCity = cityName;
    } else {
        return alert("You are missing a starting city!")
    }

    if (cityName2 !== "") {
        endCity = cityName2;
    } else {
        return alert("You are missing an ending city!")
    }

    //clear stops if start and end are changed
    citiesArray = [];
    
    document.querySelector('form').reset(); //reset/clear the form for the next selected cities 

    initMap();
});

$("#add").click(function(event) {
    event.preventDefault();
    let stop = $("#stop-city").val();
    console.log('stop: ', stop);
    
    // make sure stop is not blank and save it 
    if (stop !== "") {
        citiesArray.push(stop);
    } else {
        return alert("You are missing a starting city!") //should this be missing a stop in city?
    }

    document.querySelector('form').reset(); //reset/clear the form for the next selected cities 

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
        //   {
        //     location: "Golden, US"
        //   },
        //   {
        //     location: "Idaho Springs, US"
        //   },
            // {
            //     location: "Denver, US"
            // }
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

function pullCity(str) {
    let city = str.match(/[\w ]*\, \w{2}[ ,]/); // look for "city, ST," or "city, ST "
    console.log('city: ', city);
    city = city[0].match(/[\w ]*\, \w{2}/)[0]; // trim to just "city, ST" for weather search
    console.log('city: ', city);
    return city;
}

function getLegsWeather(result) {
    console.log('result in getLegsWeather: ', result);

    let startTime = moment();
    console.log('startTime: ', startTime);
    
   

    const legs = result.routes[0].legs;
    console.log('legs: ', legs);
    console.log('legs[0].start_address: ', legs[0].start_address);
    
    startCity = pullCity(legs[0].start_address); // trim to just "city, ST" for weather search
    console.log('startCity: ', startCity);
    
    // might want to revise local storage here instead of after it's entered so that dragged to citys will be updated


    // Get weather for starting city here ****


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
            min += 24*60*days + 60*hrs + parseInt(time[4]);
        } else if (time.length === 4) {
            hrs = parseInt(time[0]);
            min += 60*hrs + parseInt(time[2]);
        } else {
            min += parseInt(time[0]);
        }
        
        console.log('days: ', days);
        console.log('hrs: ', hrs);
        console.log('min: ', min);

        // add time to starting time to get time when stop will be hit
        let curTime = moment(startTime).add(min, 'm');
        console.log('curTime: ', curTime);
        hrOfTheDay = moment(curTime).format("LT").split(":")[0];
        console.log('hrOfTheDay: ', hrOfTheDay);
        
        //get city name from leg
        let stopCity = pullCity(leg.end_address);

        // might want to revise local storage here instead of after it's entered so that dragged to citys will be updated
        if (i = legs.length-1) {
            //save end city
            endCity = stopCity;
            localStorage.setItem("endCity", endCity);
        } else {
            citiesArray.push(stopCity);
            localStorage.setItem("citiesArray", JSON.stringify(citiesArray));
    
        }

        //get weather and create the card for stopCity at hrOfTheDay here ******
        
        
        

        // add 1 hr to time for stop
        min += 60;
    }

    //total = total / 1000;
    // document.getElementById("total").innerHTML = total + " km";
}

// // 0d67df869da6450e2d0d3147f8e85294701ac392









//     for (var i = 0; i < citiesArray.length; i++) {
//       var city = citiesArray[i];
//       var card = document.createElement("card");
//       card.textContent = city;
//       tbody.appendChild(card);
//     };

// 0d67df869da6450e2d0d3147f8e85294701ac392