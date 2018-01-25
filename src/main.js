import Vue from 'vue'
import axios from 'axios'

new Vue({
  el: '#app',
  data: {
    city: 'Your City',
    lat: null,
    lon: null,
    weatherData: null,
    temp: null,
    tempType: 'FAHRENHEIT',
    // 	weatherUrl is prepended with url to avoid CORS error
    weatherUrl: 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?',
    apiKey: '5ff51663eb541e74296530b17a1eaf5e'
  },
  filters: {
		properTemp: function(temp, tempType) {
			if(tempType === 'FAHRENHEIT') {
				return Math.round(temp * (9/5) - 459.67)
			} else {
				return Math.round(temp - 273.15)
			}
		}	
	},
  methods: {
    getLatAndLong: function() {
			if(!navigator.geolocation) {
      axios.get('https://ipinfo.io').then((res) => {
        let locString = res.data.loc.split(",")
				this.city = res.data.city
        this.lat = locString[0]
        this.lon = locString[1]
				// now that the latitude and longitude has been retrieved we can call getWeather method
        this.getWeather(false)
				
				}, (error) => {
        console.log(error.message)
      })
			} else {
				this.getPosition().then((res) => {
					this.lat = res.coords.latitude
					this.lon = res.coords.longitude
					// now that the latitude and longitude has been retrieved we can call getWeather method
        	this.getWeather(true)
				})
			}
    },
    getPosition: function(options) {
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      })
    },
    // axios will perform ajax request to openweathermap api to get the current weather using lat and lon returned from getLatAndLong method
    getWeather: function(option) {
      // perform GET request using string template and upon success set weatherData varible to the response object
      axios.get(`${this.weatherUrl}appid=${this.apiKey}&lat=${this.lat}&lon=${this.lon}`).then((res) => {
        this.weatherData = res.data
        if(option) {this.city = this.weatherData.name }
        this.temp = this.weatherData.main.temp
      }, (error) => {
        console.log(error.message)
      })
    }
  },
  mounted: function() {
    this.getLatAndLong()
  }
})
