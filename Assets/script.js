
const apiKey = "b7aeb306de9a1d1d11c8363f3b0a0a25";
var currWeatherDiv = $("#table");
// var forecastDiv = $("#");
var citiesArray = JSON.parse(localStorage.getItem("citiesArray")) || [];
var startCity = localStorage.getItem("startCity") || "";
var endCity = localStorage.getItem("endCity") || "";

function returnCurrentWeather(coordinates) {
  let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;;

  $.get(queryURL).then(function (response) {
    let currTime = new Date(response.dt * 1000);
    let weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;

    currWeatherDiv.html(`
        <h2>${response.name}, ${response.sys.country} (${currTime.getMonth() + 1}/${currTime.getDate()}/${currTime.getFullYear()})<img src=${weatherIcon} height="70px"></h2>
        <p>Temperature: ${response.main.temp} &#176;C</p>
        `)
    createHistoryButton(response.name);
  })
};


//code functionality that will execute once the route or add stop buttons are clicked 
let addStart = (ev) => {
  ev.preventDefault(); //prevents the form from submitting 

  let inputStart = document.getElementById('start-city').value; //lines 17-19: grabbing  user input values and assigning them to variables 
  let inputEnd = document.getElementById('end-city').value;
  let inputStop = document.getElementById('stop-city').value;


  document.querySelector('form').reset(); //reset/clear the form for the next selected cities 

  console.log('Added:', startCity); //console logging array values 
  console.log('Added:', endCity);


  // let selectedStart = document.querySelector('createcontainer'); do we want to have selected cities for start, end, stop in appear on the page?
  // selectedStart.textContent = (startCity); 


}


// //add event listener for route and passing through the function addStart
// document.addEventListener('DOMContentLoaded', ()=> {
//   document.getElementById('route').addEventListener('click', addStart);
// });

// //add event listener for add and passing through the function addStart
// document.addEventListener('DOMContentLoaded', ()=> {
//   document.getElementById('add').addEventListener('click', addStart);
// });

//add event 
// $('.btn-primary').on('click', function() {
//   var startAPI = $('#start-city').val(); 
//   var endAPI = $('#end-city').val(); 
//   var stopAPI = $('#stop-city').val(); 
//   searchTrip (startAPI); 
//   console.log(startAPI, endCity, stopAPI); 
// });


function createWeatherCard(cityIndex, time) {
  var city = citiesArray[cityIndex];
  returnCurrentWeather(city);
  var card = document.createElement("<div>").setAttribute("card");
  div.textContent = city;
  tbody.appendChild(card);
};


//returnCurrentWeather("Toronto");
//returnSearchTrip("Toronto");

$("#route").click(function (event) {
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

$("#add").click(function (event) {
  event.preventDefault();
  let stop = $("#stop-city").val();
  console.log('stop: ', stop);

  // make sure stop is not blank and save it 
  if (stop !== "") {
    citiesArray.push(stop);
  } else {
    return alert("You are missing a starting city!")
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
    let curTime = moment(startTime).add(min, 'm');
    console.log('curTime: ', curTime);
    hrOfTheDay = moment(curTime).format("LT").split(":")[0];
    console.log('hrOfTheDay: ', hrOfTheDay);

    //get city name from leg
    let stopCity = pullCity(leg.end_address);

    // might want to revise local storage here instead of after it's entered so that dragged to citys will be updated
    if (i = legs.length - 1) {
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

// 0d67df869da6450e2d0d3147f8e85294701ac392




//adding data into table
//value="Add" onclick="AddRow()"
var list1 = [];
var list2 = [];
var list3 = [];


var n = 1;
var x = 0;

function AddRow() {

  var AddRown = document.getElementById('table');
  var NewRow = AddRown.insertRow(n);

  list1[x] = document.getElementById("start-city").value;
  list2[x] = document.getElementById("stop-city").value;
  list3[x] = document.getElementById("end-city").value;

  var cel1 = NewRow.insertCell(0);
  var cel2 = NewRow.insertCell(1);
  var cel3 = NewRow.insertCell(2);

  cel1.innerHTML = list1[x];
  cel2.innerHTML = list2[x];
  cel3.innerHTML = list3[x];


  n++;
  x++;
}

