/*
//closure variable no accesible desde fuera a menos que los regreses en forma de funcion
(function(){
	var elem ="hola";
	return function(){
		//
	}
});
*/


(function() {
	//http://www.worldweatheronline.com
	var API_WORLDTIME_KEY = "d6a4075ceb419113c64885d9086d5";
	var API_WORLDTIME = "https://api.worldweatheronline.com/free/v2/tz.ashx?format=json&key=" + API_WORLDTIME_KEY + "&q=";


	//openweathermap.org
	var API_WEATHER_KEY = "80114c7878f599621184a687fc500a12";
	var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&";
	var IMG_WEATHER = "http://openweathermap.org/img/w/";


	var today = new Date();
	var timeNow = today.toLocaleTimeString();


	var $body = $("body");
	var $loader = $(".loader");
	var nombreNuevaCiudad = $("[data-input='cityAdd']");
	var buttonAdd =$("[data-button='add']");
	var buttonLoad = $("[data-saved-cities]");


	var cities = [];
	var cityWeather = {};
		cityWeather.zone;
		cityWeather.icon;
		cityWeather.temp;
		cityWeather.temp_max;
		cityWeather.temp_min;
		cityWeather.main;


	//escucha evento clic boton, pasamos funcion callback
	$(buttonAdd).on("click", addNewCity);
	$(nombreNuevaCiudad).on("keypress", function(event){
		//console.log(event.which);
		if(event.which == 13){
			addNewCity(event);	//Uncaught TypeError: Cannot read property 'preventDefault' of undefined
		}
	});

	$(buttonLoad).on("click", loadSavedCities);


	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(getCoord, errorFound);
	}else{
		alert("Navegador no aptop para geolocation");
	};


	function errorFound(error){
		alert("Error: " + error.code);
		//0: error conocido
		//1: permiso denegado
		//2: posicion no disponible
		//3: timeout
	};


	function getCoord(position){
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		//console.log("pegar dentro de la caja de google.com/maps " + lat + "," + lon);
		//toma peticion con callback
		$.getJSON(API_WEATHER_URL + "lat=" + lat + "&lon=" + lon, getCurrenWeather);
	};


		function getCurrenWeather(respuesta){
			//console.log(respuesta);
			cityWeather.zone = respuesta.name;
			cityWeather.icon = IMG_WEATHER + respuesta.weather[0].icon + ".png";
			cityWeather.temp = respuesta.main.temp - 273.15;
			cityWeather.temp_max = respuesta.main.temp_max - 273.15;
			cityWeather.temp_min = respuesta.main.temp_min - 273.15;
			cityWeather.main = respuesta.weather[0].main;

			//render: activarlo con js y despues con query selector
			renderTemplate(cityWeather);
		};

				function activateTemplate(id){
					//activar
					var t = document.querySelector(id);

					return document.importNode(t.content, true);
				};

			function renderTemplate(cityWeather, localtime){

				var clone = activateTemplate("#template--city");
				var timeToShow;

				if (localtime){
					timeToShow = localtime.split(" ")[1];
				} else {
					timeToShow = timeNow;
				}

				clone.querySelector("[data-time]").innerHTML = timeToShow;
				clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
				clone.querySelector("[data-icon]").src = cityWeather.icon;
				clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(1);
				clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(1);
				clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1);

				//$(".loader").hide();
				$($loader).hide();
				
				//$("body").append(clone);
				$($body).append(clone);
			}

	function addNewCity(event) {

		event.preventDefault();	//quita funcion submit al boton

		//llamar api del clima pasando las corrdenadas nombre de la ciudad del form de la url que tenemos como K
		$.getJSON(API_WEATHER_URL + "q=" + $(nombreNuevaCiudad).val(), getWeatherNewCity);
	}

		function getWeatherNewCity(data){
			//console.log(data);
			$.getJSON(API_WORLDTIME + $(nombreNuevaCiudad).val(), function(response){

				$(nombreNuevaCiudad).val("");	//borra campo

				cityWeather = {};
				cityWeather.zone = data.name;
				cityWeather.icon = IMG_WEATHER + data.weather[0].icon + ".png";
				cityWeather.temp = data.main.temp - 273.15;
				cityWeather.temp_max = data.main.temp_max - 273.15;
				cityWeather.temp_min = data.main.temp_min - 273.15;

				//console.log(response);
				renderTemplate(cityWeather, response.data.time_zone[0].localtime);

				//localStorage
				cities.push(cityWeather);
				localStorage.setItem("cities", JSON.stringify(cities));

			});
		}

		function loadSavedCities(event) {
			event.preventDefault();

			function renderCities(cities) {
				cities.forEach(function(city){
					renderTemplate(city);
				});
			};


			//leer localStorage
			var cities = JSON.parse(localStorage.getItem("cities"));

			renderCities(cities);
		}

})();//autoexec