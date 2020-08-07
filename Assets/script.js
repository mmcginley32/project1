
//create variable to hold API key 
const apiKey = "0765d126b0f6a7eb158764d733ae5823";


//create variables that bring in city values selected by user 
let startCity = $("#start-city"); 
let endCity = $("#end-city"); 
let stopCity =$("#stop-city");
console.log(startCity, endCity, stopCity); //logging to make sure code is functioning 


// var currWeatherDiv = $("#");
// var forecastDiv = $("#");

//create an array for the start, end and stop city values  
var citiesArray = [startCity, endCity, stopCity];
console.log(citiesArray); 


// Click event for route button 
$("#submit").click(function() {
  event.preventDefault();
  let cityName = $("#start-city").val();
  let cityName2 = $("#end-city").val();
  returnCurrentWeather(cityName, cityName2);
  console.log(cityName, cityName2); 
});

// Click event for add button 
$("#submit").click(function() {
  event.preventDefault();
  let cityName3 = $("#stop-city").val();
  returnCurrentWeather(cityName3);
  console.log(cityName3); 
});


function returnCurrentWeather(cityName) {
     let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;

    $.get(queryURL).then(function(response){
        let currTime = new Date(response.dt*1000);
        let weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;

        currWeatherDiv.html(`
        <h2>${response.name}, ${response.sys.country} (${currTime.getMonth()+1}/${currTime.getDate()}/${currTime.getFullYear()})<img src=${weatherIcon} height="70px"></h2>
        <p>Temperature: ${response.main.temp} &#176;C</p>
        `)
        createHistoryButton(response.name);
    })
};
    citiesArray = JSON.parse(localStorage.getItem("localWeatherSearches")) || [];
 
    

    for (var i = 0; i < citiesArray.length; i++) {
      var city = citiesArray[i];
      var card = document.createElement("card");
      card.textContent = city;
      tbody.appendChild(card);
    };



// //code functionality that will execute once the route or add stop buttons are clicked 
// let addStart = (ev) => {
//   ev.preventDefault(); //prevents the form from submitting 

//   let inputStart = document.getElementById('start-city').value; //lines 17-19: grabbing  user input values and assigning them to variables 
//   let inputEnd = document.getElementById('end-city').value; 
//   let inputStop = document.getElementById('stop-city').value; 
 

//   document.querySelector('form').reset(); //reset/clear the form for the next selected cities 

//   console.log('Added:' , startCity); //console logging array values 
//   console.log('Added:', endCity); 
//   console.log('Added:', stopCity); 

//   // let selectedStart = document.querySelector('createcontainer'); do we want to have selected cities for start, end, stop in appear on the page?
//   // selectedStart.textContent = (startCity); 

//   //locally storing input values and end of addStart execution 
//   localStorage.setItem('startCity', JSON.stringify(startCity) ); 
//   localStorage.setItem('endCity', JSON.stringify(endCity) ); 
//   localStorage.setItem('stopcity', JSON.stringify(stopCity) ); 
// }


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
//   searchTrip (startAPI, endAPI,stopAPI); 
//   console.log(startAPI, endCity, stopAPI); 
// });


// already have function --- keep in case needed  

// Function to execute the API call once buttons are clicked 

// function searchTrip(cityAPI) {
//       var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityAPI + '&appid=ce3b9593e61b336933f1777b5554991c';
//    var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + startAPI + '&' + endCity + '&' + stopAPI + '&appid=ce3b9593e61b336933f1777b5554991c';

// $.ajax ({
//     url: queryURL,
//     method: "GET"
//   }).then(function(response) {
//     console.log(response);
//     $("#end-city").text(JSON.stringify(response)); 

//   }); 
// };





// 0d67df869da6450e2d0d3147f8e85294701ac392


// call searchtrip for start, end and stop if there is a value (if not empty string then call searchtrip startAPI) return current weather called within search Trip function and search trip function can be called for each city 

// start city, end city and add city into array 

